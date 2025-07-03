import type NotesRepository from "../repositories/NotesRepository";
import type {
  GetNotesResponse,
  StoredNoteData,
  SubmitNoteRequest,
} from "../../types";
import { GlobalError } from "../../utils";
import { createStoredNoteDataFromPayLoad } from "../../utils";

type Subscriber = React.Dispatch<
  React.SetStateAction<{
    notesMap: Map<number, StoredNoteData>;
    videoLength: number;
  }>
>;

export default class NotesCache {
  private apiRepository: NotesRepository;
  private subscribers: Set<Subscriber>;
  private cachedApiRepositoryResponse: Map<string, GetNotesResponse>;
  private currentVideoId: string;
  constructor(apiRepository: NotesRepository) {
    this.apiRepository = apiRepository;
    this.subscribers = new Set();
    this.cachedApiRepositoryResponse = new Map();
    this.currentVideoId = "";
  }

  subscribe(sub: Subscriber) {
    this.subscribers.add(sub);
  }

  unsubscribe(sub: Subscriber) {
    this.subscribers.delete(sub);
  }

  async getCachedNotes(videoId: string) {
    try {
      this.currentVideoId = videoId;
      // check if there's cached api responses
      const cachedNoteData = this.cachedApiRepositoryResponse.get(videoId);
      if (cachedNoteData) {
        this.notifySubscribers();
        return;
      }
      const noteData = await this.apiRepository.getNotes(videoId);
      if (noteData) {
        this.cachedApiRepositoryResponse.set(videoId, noteData);
        this.notifySubscribers();
      }
    } catch (error) {
      console.error("Something went Wrong while getting notes", error);
      throw new GlobalError({
        global: {
          target: "form",
          message: "Something went Wrong while getting notes",
        },
      });
    }
  }

  async updateNotes(payload: SubmitNoteRequest) {
    let lastCreatedNoteId;
    const videoId = payload["videoId"];
    try {
      const cachedNotesData = this.cachedApiRepositoryResponse.get(videoId);
      const newNoteData = createStoredNoteDataFromPayLoad(payload);
      const newCachedNoteData: GetNotesResponse = {
        videoId: videoId,
        notes: cachedNotesData
          ? [...cachedNotesData["notes"], newNoteData]
          : [newNoteData],
        videoLength: payload["videoLength"],
      };
      this.cachedApiRepositoryResponse.set(videoId, newCachedNoteData);
      lastCreatedNoteId = newNoteData.id;
      await this.apiRepository.addNote(payload);
      this.notifySubscribers();
    } catch (error) {
      // remove last cached note
      if (lastCreatedNoteId)
        this.rollBackOptimistic(lastCreatedNoteId, videoId);
      console.error("Something went Wrong while saving notes", error);
      throw new GlobalError({
        global: {
          target: "form",
          message:
            "Something went Wrong while saving notes, please try again later",
        },
      });
    }
  }

  rollBackOptimistic(lastCreatedNoteId: string, videoId: string) {
    const noteDataInCache = this.cachedApiRepositoryResponse.get(videoId);
    if (noteDataInCache) {
      this.cachedApiRepositoryResponse.set(videoId, {
        ...noteDataInCache,
        notes: noteDataInCache["notes"].filter(
          (note) => note.id !== lastCreatedNoteId
        ),
      });
      this.notifySubscribers();
    }
  }

  private notifySubscribers() {
    const cachedResponse = this.cachedApiRepositoryResponse.get(
      this.currentVideoId
    );
    if (cachedResponse) {
      // using a map with endTime as keys allows O(1) lookup on each timeupdate event instead of looping over all notes
      // or using the old approach of nextNoteIndex which need the notes to be sorted based on end time
      // also when user skips or seek forwards or backward there's no need to reset the nextNoteIndex
      // also will make it easier to add optimistic UI later when a note is added, deleted or edited
      // cause no sorting is needed
      const notesMap = new Map<number, StoredNoteData>();
      // build the noteMap
      cachedResponse.notes.forEach((note) => {
        notesMap.set(note.endTime, note);
      });

      // notify subscribers
      this.subscribers.forEach((sub) => {
        sub({
          notesMap: notesMap,
          videoLength: cachedResponse.videoLength,
        });
      });
    }
  }
}

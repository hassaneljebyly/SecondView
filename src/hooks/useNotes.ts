import { useEffect, useState } from "react";
import NotesCache from "../api/state/NotesCache";
import type { StoredNoteData, SubmitNoteRequest } from "../types";
import { dbLocalstorage } from "../api/repositories/LocalStorageRepository";
import { getVideoDetails } from "../utils";

let noteCacheInstance: NotesCache | null = null; // singleton instance of NotesCache

export function useNotes() {
  const [noteMap, setNoteMap] = useState({
    notesMap: new Map<number, StoredNoteData>(),
    videoLength: 0,
  });

  if (!noteCacheInstance) {
    noteCacheInstance = new NotesCache(dbLocalstorage);
  }

  useEffect(() => {
    const videoId = getVideoDetails().videoId;
    if (videoId) {
      noteCacheInstance!.subscribe(setNoteMap);
      noteCacheInstance!.getCachedNotes(videoId);
    }
    return () => {
      noteCacheInstance!.unsubscribe(setNoteMap);
    };
  }, []);

  return {
    noteMap,
    setNoteMap,
    noteCacheInstance,
    getCachedNotes: (videoId: string) =>
      noteCacheInstance!.getCachedNotes(videoId),
    updateNotes: (payload: SubmitNoteRequest) =>
      noteCacheInstance!.updateNotes(payload),
  };
}

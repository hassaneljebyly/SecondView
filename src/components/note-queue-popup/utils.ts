import type { BufferType } from ".";
import type { Note as NoteType } from "../segments-list";

export function addNewNote(note: NoteType, noteBuffer: BufferType): BufferType {
  const [topSlot, bottomSlot] = noteBuffer;
  if (note.id === bottomSlot?.id) {
    return noteBuffer;
  }
  if (bottomSlot) {
    return [note, bottomSlot];
  }
  return [topSlot, note];
}

export function removeNote(
  noteItemID: NoteType["id"],
  noteBuffer: BufferType
): BufferType {
  const [topSlot, bottomSlot] = noteBuffer;
  const newBuffer: BufferType = [
    topSlot?.id === noteItemID ? null : topSlot,
    bottomSlot?.id === noteItemID ? null : bottomSlot,
  ];
  // if note in bottom slot was removed
  if (!newBuffer[1]) {
    return [null, topSlot];
  }
  return newBuffer;
}

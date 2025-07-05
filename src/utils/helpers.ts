import type { BufferType } from "../components/note-queue-popup";
import type { StoredNoteData } from "../types";
import { PREFIX } from "./constant";

export function createRandomId() {
  return Math.random().toString(36);
}

const cashedClassNames = new Map();
export function withPrefix(...classNames: string[]) {
  if (cashedClassNames.get(classNames.join("")))
    return cashedClassNames.get(classNames.join(""));
  const regex = /\s+/gm;
  const result = classNames
    .filter(Boolean) // remove empty classes strings
    .map((className) => {
      // don't use global modifier with .test.
      // https://forum.freecodecamp.org/t/mutations-using-regex-passing-all-tests-but-one/302801
      const hasWhiteSpace = /\s+/.test(className);
      const classNameWithPrefix = PREFIX + className.replaceAll(regex, "_");
      if (hasWhiteSpace) {
        console.warn(
          `className has whitespace, did you mean ${className.replaceAll(
            regex,
            "_"
          )}`
        );
      }
      return classNameWithPrefix;
    })
    .join(" ");

  cashedClassNames.set(classNames.join(""), result);
  return result;
}

export function addNewNote(
  note: StoredNoteData,
  noteBuffer: BufferType
): BufferType {
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
  noteItemID: StoredNoteData["id"],
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

const displayLinksCacheMap = new Map<string, string>();
export function truncateLinks(link: string) {
  const cachedLinkText = displayLinksCacheMap.get(link);
  if (cachedLinkText) {
    return cachedLinkText;
  }
  try {
    const url = new URL(link.startsWith("http") ? link : "http://" + link);
    // remove www. and only display  to and second level domain
    const hostname = url.hostname
      .replace(/www\./, "")
      .split(".")
      .slice(-2)
      .join(".");
    // get last path name in link
    const lastPathName = url.pathname.split("/").filter(Boolean).at(-1) || "";
    // add truncation
    const middle = lastPathName ? "/../" : "";
    const displayLink = `${hostname}${middle}${lastPathName}`;
    displayLinksCacheMap.set(link, displayLink);
    return displayLink;
  } catch (error) {
    console.error("Error while formatting link", error);
    const alternativeDisplayLink = link.slice(0, 12);
    displayLinksCacheMap.set(link, alternativeDisplayLink);
    return alternativeDisplayLink;
  }
}

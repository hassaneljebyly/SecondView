import { PREFIX } from "./constant";

export function withPrefix(...classNames: string[]) {
  // [🛑 BLOCKER]:  no white space, and possible empty strings
  return classNames.map((className) => PREFIX + className).join(" ");
}

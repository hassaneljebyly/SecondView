import { PREFIX } from "./constant";

export function withPrefix(...classNames: string[]) {
  // no white space
  return classNames.map((className) => PREFIX + className).join(" ");
}

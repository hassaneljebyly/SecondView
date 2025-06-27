import { PREFIX } from "./constant";

export function withPrefix(...classNames: string[]) {
  const regex = /\s+/gm;
  return classNames
    .filter(Boolean) // remove empty classes
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
}

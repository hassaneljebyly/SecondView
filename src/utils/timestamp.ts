import { REGEX } from "./constant";

export function timeStringToSeconds(segmentBound: string) {
  let result = 0;
  const valuesArray: number[] = segmentBound.split(":").map(Number);
  // start from last index cause expected format is hh:mm:ss or mm:ss or ss
  const seconds = valuesArray.at(-1) || 0;
  const minutes = (valuesArray.at(-2) || 0) * 60;
  const hours = (valuesArray.at(-3) || 0) * 3600;
  result = seconds + minutes + hours;

  return result;
}

export function getSegmentPercentRange({
  videoLength,
  start,
  end,
}: {
  videoLength: number;
  start: number;
  end: number;
}) {
  const segmentWidth = `${Math.floor(((end - start) * 100) / videoLength)}%`;
  const segmentLeftPos = `${Math.floor((start * 100) / videoLength)}%`;
  return { segmentWidth, segmentLeftPos };
}

export function timeStringIsValid(timeStamp: string): boolean {
  const testRegex = new RegExp(REGEX.TIME_STAMP_PATTERN);
  return testRegex.test(timeStamp);
}

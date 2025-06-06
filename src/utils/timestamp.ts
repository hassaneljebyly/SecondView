import type { FormDataType } from "../components/Note";

export type SegmentBound = Pick<FormDataType, "end" | "start">;
export type timeStringToSecondsType = Record<keyof SegmentBound, number>;

export function timeStringToSeconds(
  segmentBound: SegmentBound
): timeStringToSecondsType {
  const result: Record<string, number> = {};
  for (const [bound, value] of Object.entries(segmentBound)) {
    // start from back cause expected format is hh:mm:ss or mm:ss or ss
    const valuesArray: number[] = value.split(":").map(Number);
    // TODO config ts to remove "Property 'at' does not exist on type 'number[]'" error
    const seconds = valuesArray.at(-1) || 0;
    const minutes = valuesArray.at(-2) * 60 || 0;
    const hours = valuesArray.at(-3) * 3600 || 0;
    result[bound] = seconds + minutes + hours;
  }

  return result as timeStringToSecondsType;
}

export function timeStringIsValid(timeStamp: string): boolean {
  const testRegex = /^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?$/;
  return testRegex.test(timeStamp);
}

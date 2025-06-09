export function timeStringToSeconds(segmentBound: string) {
  let result = 0;
  const valuesArray: number[] = segmentBound.split(":").map(Number);
  // TODO config ts to remove "Property 'at' does not exist on type 'number[]'" error
  // start from back cause expected format is hh:mm:ss or mm:ss or ss
  const seconds = valuesArray.at(-1) || 0;
  const minutes = valuesArray.at(-2) * 60 || 0;
  const hours = valuesArray.at(-3) * 3600 || 0;
  result = seconds + minutes + hours;

  return result;
}

export function timeStringIsValid(timeStamp: string): boolean {
  const testRegex = /^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?$/;
  return testRegex.test(timeStamp);
}

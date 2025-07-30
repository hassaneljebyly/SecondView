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

export function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const timeParts = [
    hours > 0 ? String(hours).padStart(2, "0") : null,
    hours > 0 ? String(minutes).padStart(2, "0") : String(minutes),
    String(secs).padStart(2, "0"),
  ].filter(Boolean);

  return timeParts.join(":");
}

export function getSegmentPercentRange({
  videoLength,
  startTime,
  endTime,
}: {
  videoLength: number;
  startTime: number;
  endTime: number;
}) {
  const segmentWidth = `${(((endTime - startTime) * 100) / videoLength).toFixed(
    2
  )}%`;
  const segmentLeftPos = `${((startTime * 100) / videoLength).toFixed(2)}%`;
  return { segmentWidth, segmentLeftPos };
}

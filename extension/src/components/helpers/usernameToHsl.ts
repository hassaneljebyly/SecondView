function mapValueToRange(value: number, range: [number, number]) {
  const [start, end] = range;
  const rangeSize = end - start;
  return start + (value % (rangeSize + 1));
}

export function strToHsl(str: string) {
  const strSumValue = str.split('').reduce((prev, cur) => prev + cur.charCodeAt(0), 0);
  const hueRange = [0, 360] as [number, number];
  const lightnessRange = [60, 77] as [number, number];
  const saturationRange = [50, 70] as [number, number];

  const h = mapValueToRange(strSumValue, hueRange);
  const l = mapValueToRange(strSumValue, lightnessRange);
  const s = mapValueToRange(strSumValue, saturationRange);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

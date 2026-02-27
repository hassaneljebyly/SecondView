export function getYouTubeId(url: string) {
  const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
export function getVideoLength() {
  const videoLength = document.querySelector('video')?.duration;
  return Math.floor(videoLength as number);
}

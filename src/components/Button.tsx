export default function Button() {
  function handleNoteClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    console.log(getVideoDetails(), e);
  }

  return (
    <button id="sv-button" onClick={handleNoteClick}>
      Add Note
    </button>
  );
}

function getVideoDetails() {
  const author = document.getElementById("channel-name")?.innerText || null;
  const url =
    document?.querySelector("[href*='/channel/']")?.getAttribute("href") ||
    null;
  const regex = /channel\/([A-Za-z0-9_-]+)(?:\/|$)/;
  const match = url?.match(regex) || null;
  const channelId = match ? match[1] : null;

  const lengthSeconds = document.querySelector("video")?.duration || null;
  const t = document.querySelector("#title h1") as HTMLHeadingElement;
  const title = t?.innerText || null;
  const params = new URLSearchParams(window.location.search);
  const videoId =
    params.get("v") ||
    document.querySelector("[video-id]")?.getAttribute("video-id");

  return { author, channelId, lengthSeconds, title, videoId };
}

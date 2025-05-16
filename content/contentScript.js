const btn = createButton();
const popup = createPopup();

const video = document.querySelector(
  "video[src*='blob:https://www.youtube.com/']"
);
video.addEventListener("seeking", (event) => {
  const popUpMenu = document.getElementById("secondView-popup");
  const startTimeInput = popUpMenu.querySelector("#start");
  startTimeInput.value = formatTime(video.currentTime);
});

function createButton() {
  const btn = document.createElement("button");
  btn.setAttribute("id", "youtube-btn");
  btn.innerText = "+ Add Note";

  btn.addEventListener("click", () => {
    const popUpMenu = document.getElementById("secondView-popup");
    const startTimeInput = popUpMenu.querySelector("#start");
    if (popUpMenu) {
      popUpMenu.classList.toggle("open");
      const currentTime = pauseVideo();
      startTimeInput.value = formatTime(currentTime);
    } else {
      insertPopup();
    }
  });

  return btn;
}

function insertButton(container) {
  const buttonInserted = document.getElementById("youtube-btn");
  if (!buttonInserted) {
    container.appendChild(btn);
  } else {
    setTimeout(insertButton, 100);
  }
}
function insertPopup(container) {
  const popUpInserted = document.getElementById("secondView-popup");
  if (
    !popUpInserted ||
    !document.querySelector("ytd-player#ytd-player #container")
  ) {
    container.appendChild(popup);
  } else {
    setTimeout(insertPopup, 100);
  }
}

function main() {
  const container = document.getElementById("actions");
  const videoPlayerContainer = document.querySelector(
    "ytd-player#ytd-player #container"
  );

  if (container) {
    if (window.location.href.includes("://www.youtube.com/watch")) {
      insertPopup(videoPlayerContainer);
      insertButton(container);

      chrome.storage.local.get([getVideoDetails().videoId], function (result) {
        console.log("fetched from chrome.storage", result);
      });
    }
  } else {
    setTimeout(main, 100);
  }
}

main();

function createPopup() {
  const popUpContainer = document.createElement("div");
  popUpContainer.setAttribute("id", "secondView-popup");
  popUpContainer.innerHTML = `<h2>Add Note</h2>
  <form id="noteForm">
    <label for="start">Start</label>
    <input type="text" id="start" name="start" placeholder="e.g. 00:01:23" required>
    <label for="end">End</label>
    <input type="text" id="end" name="end" placeholder="e.g. 00:01:45" value="00:03:49" required>
    <label for="note">Note</label>
    <textarea id="note" name="note" rows="4" placeholder="Write your note here..." value="hello world" required></textarea>
    <button type="submit">Submit</button>
  </form>`;

  popUpContainer.addEventListener("keydown", (e) => e.stopPropagation());

  popUpContainer
    .querySelector("#noteForm")
    .addEventListener("submit", handleSubmit);

  return popUpContainer;
}

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const payload = {
    ...getVideoDetails(),
  };
  const noteData = {};
  for (let [key, value] of formData.entries()) {
    if (key === "start" || key === "end") {
      const [hours, minutes, seconds] = value.split(":");
      noteData[`${key}`] = +hours * 3600 + +minutes * 60 + +seconds;
    } else {
      noteData[`${key}`] = value;
    }
  }

  chrome.storage.local.get([payload.videoId], function (result) {
    const video_data = result[payload.videoId];
    if (video_data) {
      const newVideoData = JSON.parse(
        JSON.stringify({
          ...video_data,
          notes: [...video_data.notes, noteData],
        })
      );

      chrome.storage.local.set(
        { [payload.videoId]: newVideoData },
        function () {}
      );
    } else {
      payload["notes"] = [noteData];
      chrome.storage.local.set({ [payload.videoId]: payload }, function () {});
    }
  });

  chrome.storage.local.get([getVideoDetails().videoId], function (result) {
    console.log(result);
  });
}

function pauseVideo() {
  const video = document.querySelector(
    "video[src*='blob:https://www.youtube.com/']"
  );
  video.pause();
  return video.currentTime;
}

function formatTime(time) {
  let remainingSeconds;
  const hours = Math.floor(time / 3600);
  remainingSeconds = time - hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds - minutes * 60;

  return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(
    remainingSeconds.toFixed()
  )}`;
}

function leftPad(number) {
  return String(number).padStart(2, "0");
}

function getVideoDetails() {
  const author = document.getElementById("channel-name")?.innerText || null;
  const url = document
    .querySelector("[href*='/channel/']")
    .getAttribute("href");
  const regex = /channel\/([A-Za-z0-9_-]+)(?:\/|$)/;
  const match = url.match(regex);
  const channelId = match ? match[1] : null;

  const lengthSeconds = document.querySelector("video")?.duration || null;
  const title = document.querySelector("#title h1")?.innerText || null;
  const params = new URLSearchParams(window.location.search);
  const videoId =
    params.get("v") ||
    document.querySelector("[video-id]")?.getAttribute("video-id");

  return { author, channelId, lengthSeconds, title, videoId };
}

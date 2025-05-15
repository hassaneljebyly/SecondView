const btn = createButton();
const popup = createPopup();

function createButton() {
  const btn = document.createElement("button");
  btn.setAttribute("id", "youtube-btn");
  btn.innerText = "+ Add Note";

  btn.addEventListener("click", () => {
    const popUpMenu = document.getElementById("secondView-popup");
    if (popUpMenu) {
      popUpMenu.classList.toggle("open");
      pauseVideo();
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
  console.log(container);
  if (!popUpInserted) {
    container.appendChild(popup);
  } else {
    setTimeout(insertPopup, 100);
  }
}

function main() {
  const container = document.getElementById("actions");
  const videoPlayerContainer = document.querySelector(
    "#container .html5-video-player"
  );

  if (container) {
    if (window.location.href.includes("://www.youtube.com/watch")) {
      insertPopup(videoPlayerContainer);
      insertButton(container);
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
  <form id="noteForm" onsubmit="handleSubmit(event)">
    <label for="start">Start</label>
    <input type="text" id="start" name="start" placeholder="e.g. 00:01:23" required>
    <label for="end">End</label>
    <input type="text" id="end" name="end" placeholder="e.g. 00:01:45" required>
    <label for="note">Note</label>
    <textarea id="note" name="note" rows="4" placeholder="Write your note here..." required></textarea>
    <button type="submit">Submit</button>
  </form>`;

  popUpContainer.addEventListener("keydown", (e) => {
    console.log(e);
    e.stopPropagation();
  });

  return popUpContainer;
}

function pauseVideo() {
  const video = document.querySelector(
    "video[src*='blob:https://www.youtube.com/']"
  );

  video.pause();
}

function formatTime(time) {
  let remainingSeconds;
  const hours = Math.floor(time / 3600);
  remainingSeconds = time - hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds - minutes * 60;

  return `${leftPad(hours)}:${leftPad(minutes)}:${remainingSeconds.toFixed()}`;
}

function leftPad(number) {
  return String(number).padStart(2, "0");
}

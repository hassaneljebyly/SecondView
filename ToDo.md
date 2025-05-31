Here's a `TODO.md` or `README.md`-style checklist that outlines the clean, minimal setup for your YouTube extension logic:

---

# 🧩 YouTube Extension Injection – TODO & Architecture

This extension waits for a specific container on YouTube video pages, inserts a custom element once, and mounts a React component into it. It also handles page/video changes on YouTube’s SPA structure.

---

## ✅ Overview

- ✅ Wait for YouTube video page (`/watch`) to load
- ✅ Poll for the target DOM container (e.g., `.ytp-chrome-bottom`)
- ✅ Insert extension container **only if not already inserted**
- ✅ Mount React component
- ✅ Handle new video loads by repeating the flow

---

## 📋 TODO: Setup Logic Flow

### 1. Listen for YouTube SPA Navigation

- ✅ Use `yt-navigate-finish` event (fires on every video/page change)
- ✅ On event fire:

  - ✅ Reset extension state if needed (e.g. `hasInjected = false`)
  - ✅ Call the element polling function

---

### 2. Wait for Target DOM Container

- ✅ Define a polling function (`waitForElement`) using `setTimeout` or `requestAnimationFrame`
- ✅ Query `document.querySelector(".your-target-selector")`
- ✅ If element found:

  - ✅ Proceed to inject

- ✅ Else:

  - ✅ Retry every 100ms
  - ✅ Stop after max attempts (e.g. 50 = 5 seconds)

---

### 3. Inject Extension Container

- ✅ Before injecting, check if your container already exists using an `#id` or `[data-extension]` attribute
- ✅ If not present:

  - ✅ Create and insert a new `<div id="my-extension-container" />` into the target container
  - ✅ Set a flag (`hasInjected = true`) to prevent duplication

---

### 4. Mount React Component

- ✅ Use `ReactDOM.createRoot()` or `ReactDOM.render()` to mount your component into the injected container

---

### 5. Handle Cleanup / Repeat

- ✅ Repeat this process every time `yt-navigate-finish` fires
- ✅ Optional: Unmount React and clean up container before reinjecting on new video

---

## 🧪 Optional Enhancements

- [ ] Add a fallback console warning if polling times out
- [ ] Use a small debounce for polling start to wait for YouTube’s layout to settle
- [ ] Add metrics or logs to monitor how often the extension injects or fails to inject

---

## 📌 Example Target Selectors

- `.html5-video-player`
- `.ytp-chrome-bottom`
- `.player-container`
- `.watch-flexy`

Make sure your selector is stable and doesn’t rely on frequently changing class names.

---

## 🧠 Reminder

No don’t need `MutationObserver` unless reacting to **ongoing mutations**. For waiting for a one-time load of a known container, **polling is simpler and more reliable** in the YouTube SPA environment.

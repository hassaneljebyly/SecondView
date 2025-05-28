# # SecondView – See What Others See

**SecondView** is a community-powered browser extension that brings context, clarity, and alternative perspectives to YouTube videos. By crowd sourcing viewer notes, SecondView lets you see what others are saying about key moments — whether it’s fact-checks, added insight, or just a second opinion. Cut through noise, bias, and hype. With SecondView, you don’t just watch — you watch smarter.

---

## ✨ Features (Basic Concept)

- 🕒 Add notes to any video, targeting specific time segments (start & end).
- ✍️ Notes are stored locally and tied to the video's URL or ID.
- 🎯 Visual indicators on the video progress bar to highlight annotated segments.
- 🛑 Automatically pauses video when creating a new note.
- 💬 View notes during playback for added context.

---

## 🛠 Folder Structure

```
secondview/
├── manifest.json
├── background.js
├── content/
│   └── content.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/
│   └── icon128.png
├── storage/
│   └── notes.js
└── styles/
    └── noteMarkers.css
```

---

## 🧪 How It Works

1. Injects a subtle **“Add Context”** button near videos.
2. Clicking it pauses the video and opens a pop-up to:
   - Set **start** and **end** time
   - Write a note for that segment
3. Stored notes are shown as markers on the progress bar.
4. Hovering/clicking a marker reveals the context.

---

## 📌 Scope

This version focuses only on:

- Adding and displaying notes locally.
- Non-intrusive UI experience.
- Core time-based functionality.

Future features (not included yet):

- Sync/share notes
- Community rating or flagging
- TypeScript migration
- Multi-platform support

---

## 🤝 License

MIT — use, modify, and share freely.

---

## 💡 Philosophy

SecondView isn’t about “fact-checking” for one side — it’s about **media literacy for everyone**. Whether you’re calling out misinformation or simply adding clarity, SecondView helps build a more informed, nuanced, and transparent video ecosystem.

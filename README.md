<p align="center">
  <img src="public/icons/logo_256px.png" alt="Logo"></img>
</p>

# 🎥 SecondView – Community Driven Fact Checking for YouTube

**SecondView** is a Chrome extension that brings **community-driven fact-checking** to YouTube videos. Inspired by Twitter’s Community Notes, it enables viewers to **flag misinformation** and provide **contextual corrections** at the exact moment misleading content appears in a video.



## 🌐 Vision

SecondView aims to empower **digital media literacy** by giving everyday viewers tools to collaboratively correct or contextualize content. We believe open dialogue and collective input are key to a more informed internet.

## ✨ Features

- ⏱️ **Timestamped Notes**: Viewers can add notes tied to specific moments in a video.
- 🧠 **Misinformation Categories**: Notes can be categorized (check [config/categories.json](config/categories.json)).
- 🗣️ **Crowdsourced Explanations**: Contributors explain why the content is misleading or what important context is missing.
- 💬 **Live Note Popups**: Viewers see notes right after the questionable claim is made, Important the note pops up at the end of the video, that way the content gets a chance to make its case.
- 👍👎 **Community Ratings**: Notes can be rated as “Helpful” or “Not Helpful” based on set criteria, ensuring quality over time (check [config/ratings.json](config/ratings.json)).



## 🛠️ How It Works

1. **Watch a Video**  
   When watching YouTube, if you hear a claim that seems misleading or lacking context...

2. **Click "Add Note"**  
   Use the SecondView button to open a form that includes:
   - Start Time (in seconds)
   - End Time (when the claim ends)
   - Category of misinformation
   - Explanation or context

3. **Submit Note**  
   Your note is now linked to that exact video moment.

4. **Other Viewers See It**  
   When another user watches the same video, the note appears shortly after the claim is made.

5. **Rate Notes**  
   Viewers can mark notes as “Helpful” or “Not Helpful” based on:
   - Clarity and objectivity
   - Verifiable sources or logic
   - Relevance and accuracy




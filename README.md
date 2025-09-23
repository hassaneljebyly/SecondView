<p align="center">
  <img src="./extension/public/icons/logo_256px.png" alt="Logo"></img>
</p>

# 🎥 SecondView – Community Driven Fact Checking for YouTube

**SecondView** is a Chrome extension that brings **community-driven fact-checking** to YouTube videos. Inspired by Twitter’s Community Notes, it enables viewers to **flag misinformation** and provide **contextual corrections** at the exact moment misleading content appears in a video.



## 🌐 Vision

SecondView aims to empower **digital media literacy** by giving everyday viewers tools to collaboratively correct or contextualize content. We believe open dialogue and collective input are key to a more informed internet.

## ✨ Features

- ⏱️ **Timestamped Notes**: Viewers can add notes tied to specific moments in a video.
- 🧠 **Misinformation Categories**: Notes can be categorized (check [Misinformation Categories](##Misinformation-Categories)).
- 🗣️ **Crowdsourced Explanations**: Contributors explain why the content is misleading or what important context is missing.
- 💬 **Live Note Popups**: Viewers see notes right after the questionable claim is made, Important the note pops up at the end of the video, that way the content gets a chance to make its case.
- 👍👎 **Community Ratings**: Notes can be rated as “Helpful” or “Not Helpful” based on set criteria, ensuring quality over time (check [Note Ratings](##Note-Ratings)).



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


## Misinformation Categories  

### <span style="background-color: #F1C40F; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Temporal Misrepresentation 
<p style="max-width: 60ch;width: 100%;">
Video content where timing is misrepresented, such as old footage presented as current events or clips from different time periods combined misleadingly.  
</p>
---

### <span style="background-color: #E74C3C; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Unsubstantiated Advice 
<p style="max-width: 60ch;width: 100%;">
Medical, legal, financial, or safety advice given in videos without proper credentials or evidence, particularly dangerous in health and wellness content.  
</p>
---

### <span style="background-color: #D35400; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Manipulated Content 
<p style="max-width: 60ch;width: 100%;">
Genuine video or audio that has been edited or distorted, such as selective editing to change meaning, deepfakes, voice cloning, or misleading thumbnails and titles.  
</p>
---

### <span style="background-color: #8E44AD; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Fabricated Content 
<p style="max-width: 60ch;width: 100%;">
Completely false video content, including staged events presented as real, fake interviews, or entirely synthetic footage created to deceive viewers.  
</p>
---

### <span style="background-color: #F39C12; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Misleading Content 
<p style="max-width: 60ch;width: 100%;">
Video content that presents opinions, speculation, or unverified claims as established facts, common in commentary and podcast-style content.  
</p>
---

### <span style="background-color: #95A5A6; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Satire and Parody 
<p style="max-width: 60ch;width: 100%;">
Humorous video content that could be mistaken for real news or information, including sketch comedy or satirical news shows without clear disclaimers.  
</p>
---

### <span style="background-color: #E67E22; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> False Connections 
<p style="max-width: 60ch;width: 100%;">
When unrelated footage, images, or audio clips are used to support or illustrate claims they don't actually relate to.  
</p>
---

### <span style="background-color: #3498DB; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Sponsored Content 
<p style="max-width: 60ch;width: 100%;">
Paid promotions, product placements, or sponsored segments disguised as genuine reviews or editorial content without proper disclosure.  
</p>
---

### <span style="background-color: #2980B9; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Imposter Content 
<p style="max-width: 60ch;width: 100%;">
Videos impersonating genuine sources, such as fake news channels, deepfake videos of real people, or channels using established media branding without authorization.  
</p>
---

### <span style="background-color: #16A085; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> False Context 
<p style="max-width: 60ch;width: 100%;">
Factually accurate footage or audio combined with false contextual information, such as old footage presented as recent events or real clips with misleading narration.  
</p>
---

### <span style="background-color: #9B59B6; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Propaganda 
<p style="max-width: 60ch;width: 100%;">
Video content systematically designed to influence viewer attitudes, values, or political beliefs through biased presentation or selective information.  
</p>
---

### <span style="background-color: #BDC3C7; display: inline-block; width: 18px; aspect-ratio: 1; border-radius: 2px;"></span> Error 
<p style="max-width: 60ch;width: 100%;">
Mistakes made by established news channels, educational content creators, or other credible sources in their video reporting or explanations.  
</p>
---

## Note Ratings  

These define the **rating options** for evaluating the quality and accuracy of a note.  
They are grouped into **Accurate Ratings** and **Inaccurate Ratings**

---

## ✅ Accurate Ratings (`ACCURATE_RATINGS_ARRAY`)

Used when a note is high-quality, reliable, and helpful.  

- **Reliable Sources** (`reliable-sources`) – high-quality, credible sources  
- **Well Documented** (`well-documented`) – claims backed by evidence  
- **Contextually Relevant** (`contextually-relevant`) – directly addresses the claim  
- **Clear Explanation** (`clear-explanation`) – easy to understand  
- **Neutral Tone** (`neutral-tone`) – objective, professional language  
- **Current Information** (`current-information`) – up-to-date sources/facts  
- **Comprehensive Coverage** (`comprehensive-coverage`) – addresses the full claim  
- **Actionable Helpful** (`actionable-helpful`) – gives viewers useful info  

---

## ❌ Inaccurate Ratings (`INACCURATE_RATINGS_ARRAY`)

Used when a note is misleading, low-quality, or unhelpful.  

- **Unreliable Sources** (`unreliable-sources`) – poor quality or biased sources  
- **Unsupported Claims** (`unsupported-claims`) – no evidence provided  
- **Off Topic** (`off-topic`) – doesn’t match the flagged content  
- **Confusing Unclear** (`confusing-unclear`) – hard to follow or vague  
- **Biased Language** (`biased-language`) – inflammatory or one-sided  
- **Outdated Information** (`outdated-information`) – old or superseded info  
- **Incomplete Shallow** (`incomplete-shallow`) – doesn’t fully address the issue  
- **Spam Unhelpful** (`spam-unhelpful`) – low effort or irrelevant  

---

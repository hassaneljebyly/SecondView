# SecondView Privacy Policy

**Last Updated:** February 27, 2026

SecondView is a browser extension designed to provide community-driven fact-checking context for YouTube videos by allowing users to attach notes to specific timestamps.

SecondView is operated by **Hassan Jebyly, an independent developer**.

This Privacy Policy explains what information is collected, how it is used, and how it is protected when you use the SecondView browser extension.

---

# 1. Information We Collect

SecondView is designed to minimize data collection and does not require traditional user accounts or personal identity information.

## 1.1 Pseudonymous Profile Information

Users may generate a pseudonymous profile within the extension to submit notes or rate existing notes.

Users may also continue to view notes without a profile but cannot submit or rate them.

When a profile is generated, the following information may be created and stored:

* ID (a unique user identifier UUID)
* Pseudonymous username (randomly generated)
    - A cryptographically random unique username composed of an adjective, a noun, and a 6-character hex code.
    - The final format looks like: `AdjectiveNoun_ABC123`
* Access key, This key acts like a password for frictionless pairing:
    - 128 bits of entropy
    - 32-character hex string
    - example `a3f92c8d91e4b7aa0d6f4e219c8b55f0`
* Signing key, This key is used to sign requests
    - 256 bits of entropy (32 bytes)
    - 64-character hexadecimal string
    - Must be kept secret on the client
* Account creation timestamp
* User reputation score
* Account status indicators (such as deleted or banned)

Some of this information is stored locally in the browser using Chrome extension storage and partially on the backend to support service functionality.

Profiles do **not require email addresses, passwords, or third-party authentication.**

### Why We Collect Profile Information:
**User profiles exist solely to:**

- Associate notes and ratings with unique contributors (prevents anonymous spam)
- Calculate reputation based on contribution quality
- Enable users to access their own submissions across devices (via profile import)
- Maintain the integrity of the scoring system (prevents vote manipulation through multiple accounts)

**Without user identifiers, we couldn't distinguish between:**

- A helpful contributor vs. a spam account
- Genuine community consensus vs. coordinated manipulation
- Established users vs. new accounts

**We do not use profiles to track your activity, build behavioral profiles**

---

## 1.2 User-Generated Content

If a user submits a note or rating, the following information may be stored:

* Note text content
* Sources (list of sources extracted from Note text)
* Timestamp range within the video (where target claim start and where it ends)
* Video identifier (video id)
* Type of misinformation
* Ratings and verdicts associated with notes
* Reasons for ratings
* User identifier associated with the action (user id)

Notes must include at least one source link.

Submitted notes may be visible to other users of the extension.

---

## 1.3 Video Metadata

When viewing YouTube videos, the extension reads limited publicly available metadata from the page:

* Video ID
* Video length (used only for validation)

Video length is **not stored**.

The video ID is stored with associated with submitted notes.

---

## 1.4 Technical Data for Security and Rate Limiting

To protect the service from abuse, limited technical data may be temporarily processed:

* Hashed IP address
* Failed authentication attempts
* Rate-limit counters

IP addresses are **hashed before storage** and are used only for rate limiting and abuse prevention.

This information is automatically deleted after the applicable rate-limit window plus a short grace period.

Rate Limit entries and with it IP hashes are deleted after the rate-limit window expires OR immediately after a successful authentication (whichever comes first). 

---

# 2. How Information Is Used

Collected data is used solely to operate and maintain the functionality of the SecondView service.

This includes:

* Associating notes with YouTube videos
* Displaying community fact-checking notes
* Preventing spam and abuse
* Enforcing rate limits
* Verifying request authenticity using cryptographic signatures
* Maintaining reputation and rating systems

SecondView does **not use data for advertising or behavioral tracking.**
Only video id is stored, **Only when action of submitting note is made**

Data may be used for academic research on misinformation patterns. Research use is anonymized usernames are disassociated from content, and individual users are never identified in published studies.

SecondView does not sell, rent, or trade your data. We do not share data with advertisers, data brokers, or marketing companies.

---

# 3. Data Storage

Data may be stored in two places:

### Local Browser Storage

Certain profile information is stored locally using the Chrome extension `storage` permission.

### Backend Infrastructure

Service data such as notes, ratings, and reputation information are stored in a backend database hosted using **Supabase infrastructure.

Backend services include:

* PostgreSQL database
* Edge functions used for API operations

Server infrastructure may be hosted in regions managed by [Supabase](https://supabase.com/).

---

# 4. Public Data

The following information may be visible to other users of the extension:

* Note content
* Associated video timestamp
* Pseudonymous username
* Community ratings and verdicts

If a user profile is deleted or banned, the username may be replaced with labels such as **"[deleted]"** or **"[banned]"**.

---

# 5. User Controls

Users can control certain data locally.

Available actions include:

* Logging out of the extension
* Clearing locally stored profile data

Logging out removes locally stored profile information from the browser.

### What Happens to Your Content:
Notes and ratings are 'soft deleted' marked as deleted in the database but preserved for two reasons:

- **Research Integrity:** Maintaining a complete historical record of community evaluations
- **System Integrity:** Preventing manipulation (e.g deleting a note after it receives negative ratings, then resubmitting)

### When you delete your account:

- Your username is preserved internally to prevent reuse (stops impersonation)
- Your username is masked publicly as [deleted] or [banned] when displayed on notes
- Your notes and ratings remain visible (attributed to [deleted]/[banned])
- You cannot reclaim or transfer your username

### Why preserve content from banned accounts?
Even users who violate Terms may have made valuable contributions in the past. The community's dimensional ratings determine note quality not the author's current account status. Hiding all notes from a banned user would erase legitimate context and reward bad actors who contributed quality work before breaking rules.

---

# 6. Security Measures

SecondView uses several security mechanisms to protect the service, including:

* HTTPS encrypted network communication
* HMAC request signing
* Rate limiting on sensitive endpoints
* Hashed storage of access keys
* Temporary hashed IP tracking for abuse prevention

These measures are intended to reduce unauthorized use or automated abuse of the service.

---

# 7. Third-Party Services

SecondView relies on infrastructure services provided by **[Supabase](https://supabase.com/)** to operate backend databases and API endpoints.

These services may process limited technical information necessary to provide hosting and infrastructure functionality.

SecondView does not integrate advertising networks or third-party tracking systems.

---

# 8. Children's Privacy

SecondView is intended for users **13 years of age or older**.

The service is not designed for children under the age of 13 and does not knowingly collect personal information from children.

---

# 9. Data Retention

Data retention depends on the type of information:

* Notes and ratings may be stored indefinitely to maintain the integrity of the community fact-checking system.
* Temporary abuse-prevention data (such as hashed IP rate-limit records) is automatically deleted after the applicable rate-limit window and grace period.

---

# 10. Changes to This Privacy Policy

This Privacy Policy may be updated from time to time.

Updates may be communicated through:

* Updates to this policy document
* Updates to the browser extension listing

Continued use of the extension after changes indicates acceptance of the updated policy.

---

# 11. Contact

For privacy-related questions or requests, you may contact:

**Hassan Jebyly** - SecondView Developer

[hassanjebyly@gmail.com](mailto:hassanjebyly@gmail.com)

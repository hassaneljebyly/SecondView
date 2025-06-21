# ✅ comments Guide

This file defines the standard tags and categories used in inline TODOs, code comments, and task boards for this project.

## 📂 Categories

| Tag                | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `🐞 BUG`           | Broken or incorrect functionality.                           |
| `🧹 CLEANUP`       | General code tidying: dead code, renames, or formatting.     |
| `🧱 REFACTOR`      | Reorganizing logic, structure, or abstractions.              |
| `🎨 UI/UX`         | Spacing, font sizes, layout improvements, hover states, etc. |
| `🚀 FEATURE`       | New features or enhancements.                                |
| `⚙️ TECH DEBT`     | Large utils, duplicated logic, or un-scalable patterns.      |
| `🧪 TEST`          | Missing unit or integration tests.                           |
| `📐 ARCHITECTURE`  | File structure, form flow, context state, etc.               |
| `🔒 ACCESSIBILITY` | Keyboard navigation, ARIA roles, contrast ratios, etc.       |
| `📋 COPY`          | Text, labels, or placeholder wording changes.                |
| `🧠 IDEA`          | Optional enhancements or unscoped thoughts.                  |
| `🛑 BLOCKER`       | Must-fix blockers before proceeding with other tasks.        |

## 📂 Categories & Examples

### 🐞 BUG

Broken behavior, incorrect logic, unexpected UI issues.

```ts
// [🐞 BUG]: Clicking submit with empty time crashes the form
// [🐞 BUG]: Hover state sticks when form is disabled
```

### 🧹 CLEANUP

Trivial refactors, removing unused code, renaming variables for clarity.

```ts
// [🧹 CLEANUP]: Remove unused `formatDate` function
// [🧹 CLEANUP]: Rename `input1` to `segmentStartTime`
```

### 🧱 REFACTOR

Bigger code reorganization — moving logic to hooks, splitting large files, better abstraction.

```ts
// [🧱 REFACTOR]: Move form validation logic into useFormValidation hook
// [🧱 REFACTOR]: Simplify event dispatch logic for reusability
```

### 🎨 UI/UX

Visual design, responsiveness, spacing, layout bugs, interactivity.

```ts
// [🎨 UI/UX]: Adjust vertical spacing between time inputs
// [🎨 UI/UX]: Fix inconsistent font size on category dropdown
```

### 🚀 FEATURE

Planned features you haven’t built yet.

```js
// [🚀 FEATURE]: Add a “Now” button to auto-fill current time
// [🚀 FEATURE]: Support recurring time segments
```

### ⚙️ TECH DEBT

Growing utilities, duplicated logic, shortcuts taken that need rework later.

```js
// [⚙️ TECH DEBT]: Don't let `utils.ts` get too large
// [⚙️ TECH DEBT]: Consolidate form constants into a single config file
```

### 🧪 TEST

Missing tests, flaky tests, or test coverage concerns.

```js
// [🧪 TEST]: Add unit test for `getTimeDifference` util
// [🧪 TEST]: Snapshot test failing in dark mode
```

### 📐 ARCHITECTURE

System-level concerns: state management, file layout, context setup, etc.

```js
// [📐 ARCHITECTURE]: Centralize form state in context provider
// [📐 ARCHITECTURE]: Use layout components instead of raw div nesting
```

### 🔒 ACCESSIBILITY

ARIA roles, keyboard navigation, focus traps, color contrast.

```js
// [🔒 ACCESSIBILITY]: Add ARIA labels to input groups
// [🔒 ACCESSIBILITY]: Ensure keyboard focus trap in modal
```

### 📋 COPY

Any notes about button labels, placeholder text, or microcopy.

```js
// [📋 COPY]: Revise placeholder for duration field
// [📋 COPY]: “Save Segment” might be unclear — reconsider wording
```

### 🧠 IDEA

Brainstorming, experiments, or fun extras you might want to build.

```js
// [🧠 IDEA]: Animate form success alert with slide-in motion
// [🧠 IDEA]: Badges or icon for categories consistency?
```

### 🛑 BLOCKER

Critical issue you must fix before other progress can continue.

```js
// [🛑 BLOCKER]: Form state not persisting — blocks test implementation
```

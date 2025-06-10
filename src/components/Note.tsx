import type React from "react";
import { validateNoteFormData } from "../utils/validation";
import { useState } from "react";
import {
  cleanUpErrors,
  getVideoDetails,
  showErrors,
  type VideoDetails,
} from "../utils/dom";
import { timeStringToSeconds } from "../utils/timestamp";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  REGEX,
  TIME_STAMP_MAX_LENGTH,
} from "../utils/constant";

// TODO: fix timeStamp regex, for now 01:70:90 is valid when it shouldn't
// TODO: input validation compare start and end, end must be bigger than start, also consider min and max segment length
// TODO: input validation must be shown in html https://www.w3.org/WAI/tutorials/forms/notifications/#inline:~:text=for%20such%20feedback.-,Binary%20messages,-In%20the%20following
// TODO: make form accessible
// TODO: make form pretty, basic styling
// TODO change name of component
// TODO: remove noValidate from form
// TODO: better error messages
// TODO: timeStringToSeconds function feels too hacky

export type FormDataType = {
  start: string;
  end: string;
  category: string;
  note: string;
};

export type NoteSubmissionData = VideoDetails & {
  // form data (converted)
  startSeconds: number;
  endSeconds: number;
  category: string;
  note: string;
  // submission metadata
  userId: string; // generated ID
  timestamp: number; // Date.now()
};

export default function Note() {
  const [noteLength, setNoteLength] = useState(0);
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(e.currentTarget instanceof HTMLFormElement)) {
      console.error("Form submit event missing a valid form target");
      return;
    }
    const formEntries = new FormData(e.currentTarget).entries();
    // defaults in case something goes wrong
    const formData = {
      start: "",
      end: "",
      category: "",
      note: "",
      ...Object.fromEntries(formEntries),
    } as FormDataType;
    cleanUpErrors(); // clean up previous errors if they exist
    const error = validateNoteFormData(formData);
    if (error.length) {
      showErrors(error);
    } else {
      const { start, end, category, note } = formData;
      const submissionData: NoteSubmissionData = {
        startSeconds: timeStringToSeconds(start),
        endSeconds: timeStringToSeconds(end),
        category,
        note,
        ...getVideoDetails(),
        userId: "",
        timestamp: Date.now(),
      };
      console.log("Success, process form", submissionData);
    }
  }
  return (
    <div className="sv-note" id="sv-note">
      <form
        className="sv-note__form"
        id="sv-note__form"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <fieldset className="sv-note__fieldset" id="sv-note__fieldset">
          <legend className="sv-note__legend" id="sv-note__legend">
            Add Context Note
          </legend>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-start">
              start
            </label>
            <input
              className="sv-note__input"
              id="sv-start"
              name="start"
              maxLength={TIME_STAMP_MAX_LENGTH}
              pattern={`${REGEX.TIME_STAMP_PATTERN}`}
              required
            />
            <span></span>
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-end">
              end
            </label>
            <input
              className="sv-note__input"
              id="sv-end"
              name="end"
              maxLength={TIME_STAMP_MAX_LENGTH}
              pattern={`${REGEX.TIME_STAMP_PATTERN}`}
              required
            />
            <span></span>
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-category">
              Category
            </label>
            <select
              className="sv-note__select"
              id="sv-category"
              name="category"
              required
            >
              <option className="sv-note__option" value="">
                {NOTE_FORM_PLACEHOLDERS.CATEGORY_SELECT}
              </option>
              {NOTE_FORM_PLACEHOLDERS.CATEGORIES.map((cat) => {
                const category = (cat as string).replaceAll("_", " ");
                return (
                  <option key={cat} className="sv-note__option" value={cat}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                );
              })}
            </select>
            <span></span>
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-note-textarea">
              Your Note
            </label>
            <textarea
              className="sv-note__textarea"
              id="sv-note-textarea"
              name="note"
              placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
              maxLength={NOTE_LIMITS.MAX_LENGTH}
              minLength={NOTE_LIMITS.MIN_LENGTH}
              required
              onChange={(e) => setNoteLength(e.currentTarget.value.length)}
            />
            <span></span>
            <p>
              {noteLength}/{NOTE_LIMITS.MAX_LENGTH}
            </p>
          </div>
          <div className="sv-note__actions">
            <button
              className="sv-note__button sv-note__button--cancel"
              id="sv-cancel"
              type="button"
            >
              Cancel
            </button>
            <button
              className="sv-note__button sv-note__button--submit"
              id="sv-submit"
              type="submit"
            >
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

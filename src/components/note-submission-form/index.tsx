// TODO: make all errors and console customized for clarity in the console
import {
  cleanUpErrors,
  getVideoDetails,
  showErrors,
  type VideoDetails,
} from "../../utils/dom";

import { timeStringToSeconds } from "../../utils/timestamp";
import {
  CUSTOM_EVENTS,
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  REGEX,
  TIME_STAMP_MAX_LENGTH,
} from "../../utils/constant";
import { validateNoteFormData } from "../../utils/validation";
import { SegmentBoundInput } from "./SegmentBoundInput";
import { CategorySelectOptions } from "./CategorySelectOptions";
import { NoteTextArea } from "./NoteTextArea";
import { useEffect, useState } from "react";
import SubmissionSuccessful from "./SubmissionSuccessful";

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

export default function NoteSubmissionForm() {
  const [formIsValid, setFormIsValid] = useState(false);
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

    // validate and show errors if any
    cleanUpErrors(); // clean up previous errors if they exist
    const error = validateNoteFormData(formData);
    if (error.length) {
      showErrors(error);
    } else {
      // transform data to submit format
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
      setFormIsValid(true);
      console.log("Success, process form", submissionData);
    }
  }

  useEffect(() => {
    function handleFormToggle() {
      const noteForm = document.getElementById("sv-note__form");
      if (!noteForm) {
        console.error("noteForm was not found");
        return;
      }
      noteForm.classList.toggle("show-form");
    }
    window.addEventListener(CUSTOM_EVENTS.TOGGLE_NOTE_FORM, handleFormToggle);
    return () =>
      window.removeEventListener(
        CUSTOM_EVENTS.TOGGLE_NOTE_FORM,
        handleFormToggle
      );
  }, []);

  return (
    <div className="sv-note" id="sv-note">
      {formIsValid ? (
        <SubmissionSuccessful />
      ) : (
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
            <SegmentBoundInput
              name={"start"}
              maxLength={TIME_STAMP_MAX_LENGTH}
              pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            />
            <SegmentBoundInput
              name={"end"}
              maxLength={TIME_STAMP_MAX_LENGTH}
              pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            />
            <CategorySelectOptions
              name={"category"}
              defaultSelect={NOTE_FORM_PLACEHOLDERS.CATEGORY_SELECT}
              categoriesList={
                NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string[]
              }
            />
            <NoteTextArea
              name={"note"}
              placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
              maxLength={NOTE_LIMITS.MAX_LENGTH}
              minLength={NOTE_LIMITS.MIN_LENGTH}
            />
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
      )}
    </div>
  );
}

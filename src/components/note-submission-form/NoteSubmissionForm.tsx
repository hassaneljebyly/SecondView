// TODO: make all errors and console customized for clarity in the console
import { useState, useEffect } from "react";
import {
  CUSTOM_EVENTS,
  TIME_STAMP_MAX_LENGTH,
  REGEX,
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
} from "../../utils/constant";
import {
  cleanUpErrors,
  showErrors,
  getVideoDetails,
  handleFormToggle,
} from "../../utils/dom";
import { timeStringToSeconds } from "../../utils/timestamp";
import { validateNoteFormData } from "../../utils/validation";
import { CategorySelectOptions } from "./CategorySelectOptions";
import { NoteTextArea } from "./NoteTextArea";
import { SegmentBoundInput } from "./SegmentBoundInput";
import SubmissionSuccessful from "./SubmissionSuccessful";
import type { FormDataType, NoteSubmissionData } from "../../types/components";

export function NoteSubmissionForm() {
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

  function handleReset() {
    const toggleNoteFormEvent = new CustomEvent(CUSTOM_EVENTS.CLOSE_NOTE_FORM);
    window.dispatchEvent(toggleNoteFormEvent);
    setFormIsValid(false);
  }

  useEffect(() => {
    window.addEventListener(CUSTOM_EVENTS.TOGGLE_NOTE_FORM, handleFormToggle);
    window.addEventListener(CUSTOM_EVENTS.CLOSE_NOTE_FORM, handleFormToggle);
    return () => {
      window.removeEventListener(
        CUSTOM_EVENTS.TOGGLE_NOTE_FORM,
        handleFormToggle
      );
      window.removeEventListener(
        CUSTOM_EVENTS.CLOSE_NOTE_FORM,
        handleFormToggle
      );
    };
  }, []);

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
          {/* // TODO: Trim input from wite space then */}
          <SegmentBoundInput
            name={"start"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
          />
          {/* // TODO: Trim input from wite space then */}
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
          {/* // TODO: Trim input from wite space then */}
          <NoteTextArea
            name={"note"}
            placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
            maxLength={NOTE_LIMITS.MAX_LENGTH}
            minLength={NOTE_LIMITS.MIN_LENGTH}
          />
          <div className="sv-note__actions">
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
      {formIsValid && <SubmissionSuccessful restHandler={handleReset} />}
    </div>
  );
}

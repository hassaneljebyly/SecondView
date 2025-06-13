// import { useState } from "react";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  PREFIX,
  SEGMENT_LIMITS,
} from "../../utils/constant";
import { timeStringIsValid, timeStringToSeconds } from "../../utils/timestamp";

type FormDataType = {
  start: string;
  end: string;
  category: string;
  note: string;
};

type ValidationError = {
  focus: boolean; // used to focus first error field
  field: keyof FormDataType;
  message: string;
};

function withPrefix(...classNames: string[]) {
  // no white space
  return classNames.map((className) => PREFIX + className).join(" ");
}

function normalizeFormData(formDataObject: {
  [k: string]: FormDataEntryValue;
}) {
  const dataDefault: FormDataType = {
    start: "",
    end: "",
    category: "",
    note: "",
  };

  for (const [key, value] of Object.entries(formDataObject)) {
    const keyWithRemovedPrefix = key.replace(PREFIX, "") as keyof FormDataType; // remove prefix
    if (
      keyWithRemovedPrefix in dataDefault &&
      typeof value === "string" // solves (Type 'File' is not assignable to type 'string') error
    ) {
      dataDefault[keyWithRemovedPrefix] = value;
    } else {
      console.error(`Invalid data entry`);
    }
  }

  return dataDefault;
}

export default function Form() {
  // const [isSubmitting, setIsSubmitting] = useState();

  function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // check if form in dom
    if (!(form instanceof HTMLFormElement)) {
      console.error("Form submit event missing a valid form target");
      return;
    }
    const formEntries = new FormData(form).entries();
    const formDataObject = Object.fromEntries(formEntries);
    // normalize form data to desired format
    const formData = normalizeFormData(formDataObject);
    // validate data
    const errors = validateFormData(formData);
    console.log(errors);
  }
  return (
    <div
      id={withPrefix("form-wrapper")}
      className={withPrefix("form-wrapper", "form-wrapper-grid")}
    >
      <form
        className={withPrefix("form", "form-wrapper-grid__item")}
        onSubmit={handelSubmit}
        noValidate
      >
        <fieldset className={withPrefix("form__fieldset", "form-grid")}>
          <legend className={withPrefix("form__legend", "form-grid-span-2")}>
            Add Context Note
          </legend>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <div className={withPrefix("form__group")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("start")}
            >
              Start
            </label>
            <input
              id={withPrefix("start")}
              className={withPrefix("form__input", "form__field")}
              name={withPrefix("start")}
              placeholder="(e.g. 1:05:30)"
              aria-errormessage={withPrefix("start-error")}
              aria-invalid="false"
              autoComplete="off"
              maxLength={8}
              pattern="^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$"
              required
            />
            <em
              id={withPrefix("start-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("end")}
            >
              End
            </label>
            <input
              id={withPrefix("end")}
              className={withPrefix("form__input", "form__field")}
              name={withPrefix("end")}
              placeholder="(e.g. 1:05:30)"
              aria-errormessage={withPrefix("end-error")}
              aria-invalid="false"
              autoComplete="off"
              maxLength={8}
              pattern="^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$"
              required
            />
            <em
              id={withPrefix("end-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group", "form-grid-span-2")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("category")}
            >
              Category
            </label>
            <select
              id={withPrefix("category")}
              className={withPrefix("form__select", "form__field")}
              name={withPrefix("category")}
              aria-errormessage={withPrefix("category-error")}
              aria-invalid="false"
              required
            >
              <option value="">Select note category</option>
              <option value="FABRICATED_CONTENT">Fabricated content</option>
              <option value="MANIPULATED_CONTENT">Manipulated content</option>
              <option value="IMPOSTER_CONTENT">Imposter content</option>
              <option value="MISLEADING_CONTENT">Misleading content</option>
              <option value="FALSE_CONTEXT">False context</option>
              <option value="SATIRE_AND_PARODY">Satire and parody</option>
              <option value="FALSE_CONNECTIONS">False connections</option>
              <option value="SPONSORED_CONTENT">Sponsored content</option>
              <option value="PROPAGANDA">Propaganda</option>
              <option value="ERROR">Error</option>
            </select>
            <em
              id={withPrefix("category-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group", "form-grid-span-2")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("note")}
            >
              Your note
            </label>
            <textarea
              id={withPrefix("note")}
              className={withPrefix("form__textarea", "form__field")}
              name={withPrefix("note")}
              placeholder="Explain what's incorrect or provide additional context..."
              aria-errormessage={withPrefix("note-error")}
              aria-invalid="false"
              maxLength={50}
              minLength={10}
              required
            ></textarea>
            <em
              id={withPrefix("note-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
            <p className={withPrefix("form__char-counter")} aria-live="polite">
              0/500
            </p>
          </div>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <div className={withPrefix("form__action", "form-grid-span-2")}>
            <button
              className={withPrefix(
                "form__submit-btn",
                "button",
                "button--primary"
              )}
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

// FIXME: case of end bound is bigger than video length is not covered yet
function validateFormData(formData: FormDataType) {
  const { start, end, category, note } = formData;
  const errors: ValidationError[] = [];
  // validate time bounds
  const startBoundIsValid = timeStringIsValid(start);
  const endBoundIsValid = timeStringIsValid(end);
  if (!startBoundIsValid) {
    errors.push({
      focus: false,
      field: "start",
      message: start ? "Invalid Input (e.g. 02:40)" : "Required Field",
    });
  }
  if (!endBoundIsValid) {
    errors.push({
      focus: false,
      field: "end",
      message: end ? "Invalid Input (e.g. 02:40)" : "Required Field",
    });
  }

  if (startBoundIsValid && endBoundIsValid) {
    const startBoundToSeconds = timeStringToSeconds(start);
    const endBoundToSeconds = timeStringToSeconds(end);
    const segmentLength = endBoundToSeconds - startBoundToSeconds;
    let error: ValidationError | undefined;
    if (segmentLength >= 0 && segmentLength < SEGMENT_LIMITS.MIN_SECONDS) {
      error = {
        focus: false,
        field: "end",
        message: `Segment must be ≥${SEGMENT_LIMITS.MIN_SECONDS}s. Adjust start/end.`,
      };
    }
    // too long
    if (segmentLength > SEGMENT_LIMITS.MAX_SECONDS) {
      error = {
        focus: false,
        field: "end",
        message: `Segment must be ≤${SEGMENT_LIMITS.MAX_SECONDS}s. Adjust start/end.`,
      };
    }
    // end bound bigger than start bound
    if (segmentLength < 0) {
      error = {
        focus: false,
        field: "end",
        message: `End must come after start`,
      };
    }

    if (error) errors.push(error);
  }

  // validate category
  if (
    !(NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string).includes(category)
  ) {
    errors.push({
      focus: false,
      field: "category",
      message: category ? "Invalid input" : "Required Field",
    });
  }

  // validate note
  if (note.length < NOTE_LIMITS.MIN_LENGTH) {
    errors.push({
      focus: false,
      field: "note",
      message: note
        ? `Note must be at least ${NOTE_LIMITS.MIN_LENGTH} characters long.`
        : "Required Field",
    });
  }

  if (note.length > NOTE_LIMITS.MAX_LENGTH) {
    errors.push({
      focus: false,
      field: "note",
      message: note
        ? `Note must be no more than ${NOTE_LIMITS.MAX_LENGTH} characters long.`
        : "Required Field",
    });
  }
  // set element in focus(first input in error list)
  return errors.map((error, index) => ({ ...error, focus: !index }));
}

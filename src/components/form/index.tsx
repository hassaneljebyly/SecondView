import { useEffect, useState } from "react";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  PREFIX,
  REGEX,
  SEGMENT_LIMITS,
  TIME_STAMP_MAX_LENGTH,
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
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // check if form in dom
    // in a SPA environments(YouTube in this case) the form may be dynamically removed or replaced
    if (!(form instanceof HTMLFormElement)) {
      console.error("Form submit event missing a valid form target");
      return;
    }
    const formEntries = new FormData(form).entries();
    const formDataObject = Object.fromEntries(formEntries);
    // normalize form data to desired format
    const formData = normalizeFormData(formDataObject);
    // validate data
    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);
    if (!validationErrors.length) {
      console.log("process data", formData);
    }
  }

  // focus first element
  useEffect(() => {
    const [targetField] = errors.filter((error) => error.focus);
    const elementToFocus = document.querySelector(
      `[name=${withPrefix(targetField?.field)}]`
    ) as HTMLInputElement;
    if (elementToFocus) elementToFocus.focus();
  }, [errors]);
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
          <FormSegmentTimeInput
            name={"start"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            errors={errors}
          />
          <FormSegmentTimeInput
            name={"end"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            errors={errors}
          />
          <CategorySelect
            name={"category"}
            defaultSelect={NOTE_FORM_PLACEHOLDERS.CATEGORY_SELECT}
            categoriesList={
              NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string[]
            }
            errors={errors}
          />

          <FormTextArea
            name={"note"}
            placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
            maxLength={NOTE_LIMITS.MAX_LENGTH}
            minLength={NOTE_LIMITS.MIN_LENGTH}
            errors={errors}
          />

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

type FormInputProp = {
  name: keyof FormDataType;
  maxLength: number;
  pattern: RegExp;
  errors: ValidationError[];
};

function FormSegmentTimeInput(prop: FormInputProp) {
  const { name, maxLength, pattern, errors } = prop;
  const error = errors.filter((error) => error.field === name)[0];
  return (
    <div className={withPrefix("form__group")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        {name}
      </label>
      <input
        id={withPrefix(`${name}`)}
        className={withPrefix("form__input", "form__field")}
        name={withPrefix(`${name}`)}
        placeholder="(e.g. 1:05:30)"
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={!!error}
        autoComplete="off"
        maxLength={maxLength}
        pattern={`${pattern}`}
        required
      />
      <em
        id={withPrefix(`${name}-error`)}
        className={withPrefix("form__error-message")}
        aria-live="polite"
      >
        {error ? error.message : ""}
      </em>
    </div>
  );
}

type SelectInputProp = {
  name: keyof FormDataType;
  defaultSelect: string;
  categoriesList: string[];
  errors: ValidationError[];
};

function CategorySelect(prop: SelectInputProp) {
  const { name, defaultSelect, categoriesList, errors } = prop;
  const error = errors.filter((error) => error.field === name)[0];
  return (
    <div className={withPrefix("form__group", "form-grid-span-2")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        Category
      </label>
      <select
        id={withPrefix(`${name}`)}
        className={withPrefix("form__select", "form__field")}
        name={withPrefix(`${name}`)}
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={!!error}
        required
      >
        <option value="">{defaultSelect}</option>
        {categoriesList.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <em
        id={withPrefix(`${name}-error`)}
        className={withPrefix("form__error-message")}
        aria-live="polite"
      >
        {error ? error.message : ""}
      </em>
    </div>
  );
}

type FormTextAreaProp = {
  name: keyof FormDataType;
  placeholder: string;
  maxLength: number;
  minLength: number;
  errors: ValidationError[];
};

function FormTextArea(prop: FormTextAreaProp) {
  const [noteLength, setNoteLength] = useState(0);
  const { name, placeholder, maxLength, minLength, errors } = prop;
  const error = errors.filter((error) => error.field === name)[0];
  return (
    <div className={withPrefix("form__group", "form-grid-span-2")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        Your note
      </label>
      <textarea
        id={withPrefix(`${name}`)}
        className={withPrefix("form__textarea", "form__field")}
        name={withPrefix(`${name}`)}
        placeholder={placeholder}
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={!!error}
        maxLength={maxLength}
        minLength={minLength}
        required
        onChange={(e) => setNoteLength(e.currentTarget.value.length)}
      ></textarea>
      <em
        id={withPrefix(`${name}-error`)}
        className={withPrefix("form__error-message")}
        aria-live="polite"
      >
        {error ? error.message : ""}
      </em>
      <p className={withPrefix("form__char-counter")} aria-live="polite">
        {`${noteLength}/${maxLength}`}
      </p>
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

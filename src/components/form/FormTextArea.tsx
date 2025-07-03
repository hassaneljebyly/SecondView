import { useState } from "react";
import type { ValidationErrorPayload } from "../../utils";
import type { NoteData } from "../../types";
import { withPrefix } from "../../utils";

type FormTextAreaProp = {
  labelDisplayName: string;
  name: keyof NoteData;
  placeholder: string;
  maxLength: number;
  minLength: number;
  error: ValidationErrorPayload[keyof ValidationErrorPayload];
};

export default function FormTextArea(prop: FormTextAreaProp) {
  const [noteLength, setNoteLength] = useState(0);
  const { labelDisplayName, name, placeholder, maxLength, minLength, error } =
    prop;
  return (
    <div className={withPrefix("form__group", "form-grid-span-2")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        {labelDisplayName}
      </label>
      <textarea
        id={withPrefix(`${name}`)}
        className={withPrefix("form__textarea", "form__field")}
        name={name}
        placeholder={placeholder}
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={Boolean(error)}
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
        {error?.message || ""}
      </em>
      <p className={withPrefix("form__char-counter")} aria-live="polite">
        {`${noteLength}/${maxLength}`}
      </p>
    </div>
  );
}

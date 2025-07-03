import type { NoteData } from "../../types";
import type { ValidationErrorPayload } from "../../utils";
import { withPrefix } from "../../utils";

type FormInputProp = {
  labelDisplayName: string;
  name: keyof NoteData;
  maxLength: number;
  pattern: RegExp;
  error: ValidationErrorPayload[keyof ValidationErrorPayload];
};
// [🚀 FEATURE]: add a "now" button to automatically insert current time
export default function FormSegmentTimeInput(prop: FormInputProp) {
  const { labelDisplayName, name, maxLength, pattern, error } = prop;
  return (
    <div className={withPrefix("form__group")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        {labelDisplayName}
      </label>
      <input
        id={withPrefix(`${name}`)}
        className={withPrefix("form__input", "form__field")}
        name={name}
        placeholder="(e.g. 1:05:30)"
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={Boolean(error)}
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
        {error?.message || ""}
      </em>
    </div>
  );
}

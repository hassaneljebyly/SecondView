import { withPrefix } from "../../utils/class-names";
import type { FormData } from "../../utils/data";
import type { ValidationErrorPayload } from "../../utils/error";

type FormInputProp = {
  name: keyof FormData;
  maxLength: number;
  pattern: RegExp;
  error: ValidationErrorPayload[keyof ValidationErrorPayload];
};
// [🚀 FEATURE]: add a "now" button to automatically insert current time
export default function FormSegmentTimeInput(prop: FormInputProp) {
  const { name, maxLength, pattern, error } = prop;
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

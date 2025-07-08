import { useState } from "react";
import type { NoteData } from "../../types";
import type { ValidationErrorPayload } from "../../utils";
import { secondsToTimeString, withPrefix } from "../../utils";

type FormInputProp = {
  labelDisplayName: string;
  name: keyof NoteData;
  maxLength: number;
  pattern: RegExp;
  error: ValidationErrorPayload[keyof ValidationErrorPayload];
};
export default function FormSegmentTimeInput(prop: FormInputProp) {
  const { labelDisplayName, name, maxLength, pattern, error } = prop;
  const [timeValue, setTimeValue] = useState("");
  function handleTimeInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTimeValue(e.currentTarget.value);
  }

  function setCurrentTime() {
    const video = document.querySelector("video");
    if (video) {
      const currentTime = Math.floor(video.currentTime);
      const currentTimeStringFormat = secondsToTimeString(currentTime);
      setTimeValue(currentTimeStringFormat);
    }
  }
  return (
    <div className={withPrefix("form__group")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        {labelDisplayName}
        <button
          className={withPrefix("form__current-time-btn")}
          type="button"
          onClick={setCurrentTime}
        >
          (now)
        </button>
      </label>
      <input
        id={withPrefix(`${name}`)}
        className={withPrefix("form__input", "form__field")}
        name={name}
        placeholder="(e.g. 1:05:30)"
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={Boolean(error)}
        autoComplete="off"
        onChange={handleTimeInputValueChange}
        value={timeValue}
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

import { useEffect } from "react";
import {
  CUSTOM_EVENTS,
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  REGEX,
  TIME_STAMP_MAX_LENGTH,
} from "../../utils/constant";
import { withPrefix } from "../../utils/class-names";
import FormSegmentTimeInput from "./FormSegmentTimeInput";
import CategorySelect from "./CategorySelect";
import FormTextArea from "./FormTextArea";
import FormSuccessAlert from "./FormSuccessAlert";
import useForm from "../../hooks/useForm";
import { resetForm } from "../../utils/dom";
import type { Categories } from "../../api";
// [🚀 FEATURE]: add soft close when Esc button clicked
export default function Form() {
  const {
    globalErrors,
    setGlobalErrors,
    setErrors,
    errors,
    formState,
    setFormState,
    handelSubmit,
  } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length) {
      const firstErrorField = document.querySelector(
        `.${withPrefix("form__field")}[aria-invalid="true"]`
      ) as HTMLInputElement;
      firstErrorField?.focus();
    }

    function toggleForm() {
      if (formState === "idle") {
        resetForm();
        setGlobalErrors({});
        setErrors({});
      }
      setFormState(formState === "idle" ? "hidden" : "idle");
    }

    window.addEventListener(CUSTOM_EVENTS.TOGGLE_FORM, toggleForm);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.TOGGLE_FORM, toggleForm);
    };
  }, [errors, setGlobalErrors, setErrors, formState, setFormState]);

  return (
    <div
      id={withPrefix("form-wrapper")}
      className={withPrefix("form-wrapper", "form-wrapper-grid")}
    >
      <form
        id={withPrefix("form")}
        className={withPrefix("form", "form-wrapper-grid__item")}
        onSubmit={handelSubmit}
        aria-hidden={formState === "hidden" || formState === "success"}
        aria-errormessage={withPrefix(`form-global-error`)}
        aria-invalid={Boolean(globalErrors.global?.target)}
        noValidate
      >
        <fieldset
          className={withPrefix("form__fieldset", "form-grid")}
          disabled={formState === "submitting"}
        >
          <legend className={withPrefix("form__legend", "form-grid-span-2")}>
            Add Context Note
          </legend>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <FormSegmentTimeInput
            name={"startTime"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            error={errors["start"]}
          />
          <FormSegmentTimeInput
            name={"endTime"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            error={errors["end"]}
          />
          <CategorySelect
            name={"category"}
            defaultSelect={NOTE_FORM_PLACEHOLDERS.CATEGORY_SELECT}
            categoriesList={
              NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as Categories[]
            }
            error={errors["category"]}
          />

          <FormTextArea
            name={"noteContent"}
            placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
            maxLength={NOTE_LIMITS.MAX_LENGTH}
            minLength={NOTE_LIMITS.MIN_LENGTH}
            error={errors["note"]}
          />
          <em
            id={withPrefix(`form-global-error`)}
            className={withPrefix(
              "global-error",
              "form__error-message",
              "form-grid-span-2"
            )}
            aria-live="polite"
          >
            {globalErrors.global?.message || ""}
          </em>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <div className={withPrefix("form__action", "form-grid-span-2")}>
            <button
              className={withPrefix(
                "form__submit-btn",
                "button",
                "button--primary",
                `${formState === "submitting" ? "button--waiting" : ""}`
              )}
              type="submit"
            >
              {/* {formState === "submitting" ? "Submitting" : "Submit"} */}
              <span className={withPrefix("button__text")}>Submit</span>
              <span
                aria-label="submitting"
                className={withPrefix("button__loader")}
              ></span>
            </button>
          </div>
        </fieldset>
      </form>

      <FormSuccessAlert {...{ formState, setFormState }} />
    </div>
  );
}

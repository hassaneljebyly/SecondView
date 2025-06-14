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

export default function Form() {
  const { errors, formState, setFormState, handelSubmit } = useForm();
  console.log(errors, formState);
  useEffect(() => {
    // focus first field with an error
    if (Object.keys(errors).length) {
      const firstErrorField = document.querySelector(
        `.${withPrefix("form__field")}[aria-invalid="true"]`
      ) as HTMLInputElement;
      firstErrorField?.focus();
    }

    function toggleForm() {
      setFormState(formState === "idle" ? "hidden" : "idle");
    }

    window.addEventListener(CUSTOM_EVENTS.TOGGLE_FORM, toggleForm);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.TOGGLE_FORM, toggleForm);
    };
  }, [errors, formState, setFormState]);

  return (
    <div
      id={withPrefix("form-wrapper")}
      className={withPrefix("form-wrapper", "form-wrapper-grid")}
    >
      <form
        style={{
          display:
            formState === "hidden" || formState === "success"
              ? "none"
              : "block",
        }}
        className={withPrefix("form", "form-wrapper-grid__item")}
        onSubmit={handelSubmit}
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
            name={"start"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            error={errors["start"]}
          />
          <FormSegmentTimeInput
            name={"end"}
            maxLength={TIME_STAMP_MAX_LENGTH}
            pattern={REGEX.TIME_STAMP_PATTERN as unknown as RegExp}
            error={errors["end"]}
          />
          <CategorySelect
            name={"category"}
            defaultSelect={NOTE_FORM_PLACEHOLDERS.CATEGORY_SELECT}
            categoriesList={
              NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string[]
            }
            error={errors["category"]}
          />

          <FormTextArea
            name={"note"}
            placeholder={NOTE_FORM_PLACEHOLDERS.TEXTAREA}
            maxLength={NOTE_LIMITS.MAX_LENGTH}
            minLength={NOTE_LIMITS.MIN_LENGTH}
            error={errors["note"]}
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
              {formState === "submitting" ? "Submitting" : "Submit"}
            </button>
          </div>
        </fieldset>
      </form>

      <FormSuccessAlert {...{ formState, setFormState }} />
    </div>
  );
}

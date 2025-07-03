import { resetForm } from "../../utils";
import { CUSTOM_EVENTS, SUCCESS_MESSAGE_DURATION } from "../../utils";
import { useEffect } from "react";
import type { FormState } from "../../hooks/useForm";
import { withPrefix } from "../../utils";

type FormSuccessAlertProp = {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

// [📋 COPY]:  make input place constants instead of hard code
export default function FormSuccessAlert(prop: FormSuccessAlertProp) {
  const { formState, setFormState } = prop;
  useEffect(() => {
    const setTimeoutID = setTimeout(() => {
      if (formState === "success") {
        // reset form fields
        resetForm();
        setFormState("hidden");
        // reset button state
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.CLOSE_FORM));
      }
    }, SUCCESS_MESSAGE_DURATION);
    return () => clearTimeout(setTimeoutID);
  });
  return (
    <div
      className={withPrefix("success", "form-wrapper-grid__item")}
      aria-hidden={formState !== "success"}
    >
      <div className={withPrefix("success__icon-wrapper")}>
        <span className={withPrefix("success__icon")}>✅</span>
      </div>
      <div className={withPrefix("success__content")}>
        <h4 className={withPrefix("success__header")}>Success!</h4>
        <p className={withPrefix("success__body")}>
          Your changes have been saved successfully.
        </p>
      </div>
    </div>
  );
}

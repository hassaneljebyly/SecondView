import { withPrefix } from "../../utils/class-names";
import { resetForm } from "../../utils/dom";
import { CUSTOM_EVENTS, SUCCESS_MESSAGE_DURATION } from "../../utils/constant";
import { useEffect } from "react";
import type { FormState } from "../../hooks/useForm";

type FormSuccessAlertProp = {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

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
      style={{ display: formState === "success" ? "block" : "none" }}
      className={withPrefix("success", "form-wrapper-grid__item")}
    >
      {/* placeholder for the icon  */}
      <div className={withPrefix("success__icon-wrapper")}>
        <span className={withPrefix("success__icon")}>✅</span>
      </div>
      <div className={withPrefix("success__content")}>
        <h4 className={withPrefix("success__header")}>Success!</h4>
        <p className={withPrefix("success__body")}>
          {/* placeholder for actual message  */}
          Your changes have been saved successfully.
        </p>
      </div>
    </div>
  );
}

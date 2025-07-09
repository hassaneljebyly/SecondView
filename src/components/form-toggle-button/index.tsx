import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "../../utils";
import { focusFirstElement } from "../../utils";
import { withPrefix } from "../../utils";

export default function FormToggleButton() {
  const [formOpen, setFormOpen] = useState(false);
  const btnText = formOpen ? "Cancel" : "Add Note";
  function handleButtonClick() {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.TOGGLE_FORM));
    setFormOpen(!formOpen);
    focusFirstElement(formOpen);
  }

  function handleCloseForm() {
    setFormOpen(false);
  }
  useEffect(() => {
    window.addEventListener(CUSTOM_EVENTS.CLOSE_FORM, handleCloseForm);
    return () =>
      window.removeEventListener(CUSTOM_EVENTS.CLOSE_FORM, handleCloseForm);
  });
  return (
    <button
      id={withPrefix("add-note-btn")}
      className={withPrefix("button", "button--secondary")}
      type="button"
      aria-controls={withPrefix("form")}
      aria-expanded={formOpen}
      onClick={handleButtonClick}
    >
      <span className={withPrefix("button__text")}>{btnText}</span>
      <span
        aria-label="submitting"
        className={withPrefix("button__loader")}
      ></span>
    </button>
  );
}

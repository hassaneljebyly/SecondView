import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "../../utils/constant";
import { withPrefix } from "../../utils/class-names";
import { focusFirstElement } from "../../utils/dom";

export default function Button() {
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
  // TODO stack button text variations using grid
  return (
    <button
      id={withPrefix("add-note-btn")}
      className={withPrefix("button", "button--secondary")}
      type="button"
      onClick={handleButtonClick}
    >
      {btnText}
    </button>
  );
}

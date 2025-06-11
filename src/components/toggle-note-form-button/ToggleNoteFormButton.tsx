import { useState, useEffect } from "react";
import { CUSTOM_EVENTS } from "../../utils/constant";

export function ToggleNoteFormButton() {
  const [formOpen, setFormOpen] = useState(false);
  function handleFormToggle() {
    const toggleNoteFormEvent = new CustomEvent(CUSTOM_EVENTS.TOGGLE_NOTE_FORM);
    setFormOpen(!formOpen);
    window.dispatchEvent(toggleNoteFormEvent);
  }

  useEffect(() => {
    function handleClose() {
      setFormOpen(false);
    }
    window.addEventListener(CUSTOM_EVENTS.CLOSE_NOTE_FORM, handleClose);
    return () =>
      window.removeEventListener(CUSTOM_EVENTS.CLOSE_NOTE_FORM, handleClose);
  });
  return (
    <div>
      <button id="sv-button" onClick={handleFormToggle}>
        {formOpen ? "Cancel" : "Add Note"}
      </button>
    </div>
  );
}

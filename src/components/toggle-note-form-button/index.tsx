import { useState } from "react";
import { CUSTOM_EVENTS } from "../../utils/constant";

export default function ToggleNoteFormButton() {
  const [formOpen, setFormOpen] = useState(false);
  function handleFormToggle() {
    const toggleNoteFormEvent = new CustomEvent(CUSTOM_EVENTS.TOGGLE_NOTE_FORM);
    setFormOpen(!formOpen);
    window.dispatchEvent(toggleNoteFormEvent);
  }
  return (
    <div>
      <button id="sv-button" onClick={handleFormToggle}>
        {formOpen ? "Cancel" : "Add Note"}
      </button>
    </div>
  );
}

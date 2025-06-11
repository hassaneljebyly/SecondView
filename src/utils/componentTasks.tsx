import { NoteSubmissionForm } from "../components/note-submission-form";
import { ToggleNoteFormButton } from "../components/toggle-note-form-button/";
import type { InjectTask } from "../types/utils";

export const tasks: InjectTask[] = [
  {
    domTargetSelector: "#actions",
    rootWrapperId: "sv-button-container",
    componentId: "sv-button",
    component: <ToggleNoteFormButton />,
  },
  {
    domTargetSelector: "ytd-player#ytd-player #container",
    rootWrapperId: "sv-note-container",
    componentId: "sv-note",
    component: <NoteSubmissionForm />,
  },
];

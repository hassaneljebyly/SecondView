import Form from "../components/form";
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
    // TODO: use withPrefix
    domTargetSelector: "#container",
    // domTargetSelector: "ytd-player#ytd-player #container", // TODO: remove comments later
    rootWrapperId: "sv-form-root",
    componentId: "sv-form-wrapper",
    component: <Form />,
  },
];

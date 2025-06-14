import Button from "../components/button";
import Form from "../components/form";
import type { InjectTask } from "./injector";

export const tasks: InjectTask[] = [
  {
    // TODO: use withPrefix
    domTargetSelector: "#actions",
    rootWrapperId: "sv-add-note-btn-container",
    componentId: "sv-add-note-btn",
    component: <Button />,
  },
  {
    // TODO: use withPrefix
    domTargetSelector: "ytd-player#ytd-player #container",
    rootWrapperId: "sv-form-root",
    componentId: "sv-form-wrapper",
    component: <Form />,
  },
];

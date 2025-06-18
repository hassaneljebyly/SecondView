import Button from "../components/button";
import Form from "../components/form";
import NoteDisplay from "../components/note-display";
import { withPrefix } from "./class-names";
import type { InjectTask } from "./injector";

export const tasks: InjectTask[] = [
  {
    domTargetSelector: "#actions",
    rootWrapperId: withPrefix("add-note-btn-container"),
    componentId: withPrefix("add-note-btn"),
    component: <Button />,
  },
  {
    domTargetSelector: "ytd-player#ytd-player #container",
    rootWrapperId: withPrefix("form-root"),
    componentId: withPrefix("form-wrapper"),
    component: <Form />,
  },
  {
    domTargetSelector: ".ytp-progress-bar-container",
    rootWrapperId: withPrefix("note-display-root"),
    componentId: withPrefix("note-display"),
    component: <NoteDisplay />,
  },
];

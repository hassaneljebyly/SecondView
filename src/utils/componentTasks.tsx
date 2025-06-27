import Button from "../components/button";
import Form from "../components/form";
import NoteSegmentsList from "../components/segments-list";
import NoteQueuePopUp from "../components/note-queue-popup";
import { withPrefix } from "./class-names";
import type { InjectTask } from "./injector";
import StrictModeWrapper from "./StrictModeWrapper";

export const tasks: InjectTask[] = [
  {
    domTargetSelector: "#actions",
    rootWrapperId: withPrefix("add-note-btn-container"),
    componentId: withPrefix("add-note-btn"),
    component: (
      <StrictModeWrapper>
        <Button />
      </StrictModeWrapper>
    ),
  },
  {
    domTargetSelector: "ytd-player#ytd-player #container",
    rootWrapperId: withPrefix("form-root"),
    componentId: withPrefix("form-wrapper"),
    component: (
      <StrictModeWrapper>
        <Form />
      </StrictModeWrapper>
    ),
  },
  {
    domTargetSelector: ".ytp-progress-bar-container",
    rootWrapperId: withPrefix("note-display-root"),
    componentId: withPrefix("segments-list"),
    component: (
      <StrictModeWrapper>
        <NoteSegmentsList />
      </StrictModeWrapper>
    ),
  },
  {
    domTargetSelector: "#player-container:has(#ytd-player)",
    rootWrapperId: withPrefix("note-popup-root"),
    componentId: withPrefix("note-popup"),
    component: (
      <StrictModeWrapper>
        <NoteQueuePopUp />
      </StrictModeWrapper>
    ),
  },
];

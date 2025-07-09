import FormToggleButton from "../components/form-toggle-button";
import Form from "../components/form";
import NoteSegmentsList from "../components/segments-list";
import NoteQueuePopUp from "../components/note-queue-popup";
import type { InjectTask } from "./injectComponent";
import StrictModeWrapper from "./StrictModeWrapper";
import { withPrefix } from "./helpers";

export const tasks: InjectTask[] = [
  {
    domTargetSelector: "#actions",
    rootWrapperId: withPrefix("add-note-btn-container"),
    componentId: withPrefix("add-note-btn"),
    component: (
      <StrictModeWrapper>
        <FormToggleButton />
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

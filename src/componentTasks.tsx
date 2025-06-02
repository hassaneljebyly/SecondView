import Button from "./components/Button";
import Note from "./components/Note";

export type InjectTask = {
  domTargetSelector: string; // Where to inject it in the DOM
  rootWrapperId: string; // ID for the root wrapper
  componentId: string; // Unique ID for the injected component
  component: React.ReactElement; // The React component itself
};

export const tasks: InjectTask[] = [
  {
    domTargetSelector: "#actions",
    rootWrapperId: "sv-button-container",
    componentId: "sv-button",
    component: <Button />,
  },
  {
    domTargetSelector: "#container",
    rootWrapperId: "sv-note-container",
    componentId: "sv-note",
    component: <Note />,
  },
];

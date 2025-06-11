export type InjectTask = {
  domTargetSelector: string; // Where to inject it in the DOM
  rootWrapperId: string; // ID for the root wrapper
  componentId: string; // Unique ID for the injected component
  component: React.ReactElement; // The React component itself
};

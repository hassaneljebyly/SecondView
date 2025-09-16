import type React from 'react';

export type InjectTask = {
  domTargetSelector: string; // Where to inject it in the DOM
  rootWrapperId: string; // ID for the root wrapper
  componentId: string; // Unique ID for the injected component
  component: React.ReactElement; // The React component itself
};

export type Retries = { task: InjectTask; attempts: number };

export type InjectComponentResult =
  | {
      maxAttemptsReached?: never;
      success: true;
      retryTask?: never;
      attempts?: never;
    }
  | {
      maxAttemptsReached?: never;
      success: false;
      retryTask: InjectTask;
      attempts: number;
    }
  | {
      maxAttemptsReached: true;
      success?: never;
      retryTask?: never;
      attempts?: never;
    };

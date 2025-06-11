import type { InjectTask } from "./componentTask";

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

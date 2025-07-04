import type { FormInputData } from "../types";

export type GlobalErrorPayload = {
  global?: {
    target: string;
    message: string;
  };
};
export type ValidationErrorPayload = {
  [K in keyof FormInputData]?: {
    message: string;
  };
};

export class InputValidationError extends Error {
  payload: ValidationErrorPayload;
  constructor(payload: ValidationErrorPayload) {
    super();
    this.name = "ValidationError";
    this.payload = payload;
  }
}
export class GlobalError extends Error {
  payload: GlobalErrorPayload;
  constructor(payload: GlobalErrorPayload) {
    super();
    this.name = "GlobalError";
    this.payload = payload;
  }
}

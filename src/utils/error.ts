import type { FormData } from "./data";

export type ValidationErrorPayload = {
  [K in keyof FormData]?: {
    focus: boolean; // used to focus first error field
    message: string;
  };
};

export class ValidationError extends Error {
  payload: ValidationErrorPayload;
  constructor(payload: ValidationErrorPayload) {
    super();
    this.name = "ValidationError";
    this.payload = payload;
  }
}

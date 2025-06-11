import type { FormDataType } from "../components";

export type ValidationError = {
  field: keyof FormDataType;
  message: string;
};

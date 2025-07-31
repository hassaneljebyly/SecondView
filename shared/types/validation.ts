import { FormInputData } from "./schemas";

export type FormInputDataFields = keyof FormInputData;
export type NoteFormErrorObjectTarget = FormInputDataFields | "form";

export type HandlerResult = string | null;
export type Validator = (formData: Record<string, string>) => HandlerResult;
export interface ValidatorHandler {
  setNext(validator: ValidatorHandler): ValidatorHandler;
  validate(formData: FormInputData | unknown): HandlerResult;
}

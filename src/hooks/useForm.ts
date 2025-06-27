import { useState } from "react";
import {
  normalizeFormData,
  prepareSubmissionPayload,
  submitNotePayload,
} from "../utils/data";
import { validateFormData } from "../utils/validation";
import {
  GlobalError,
  ValidationError,
  type GlobalErrorPayload,
  type ValidationErrorPayload,
} from "../utils/error";

export type FormState = "hidden" | "idle" | "submitting" | "success" | "error";

export default function useForm() {
  const [errors, setErrors] = useState<ValidationErrorPayload>({});
  const [globalErrors, setGlobalErrors] = useState<GlobalErrorPayload>({});
  // [🧱 REFACTOR]:  control form state styles via css class
  const [formState, setFormState] = useState<FormState>("hidden");

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // check if form in dom
    // in a SPA environments(YouTube in this case)
    // the form may be dynamically removed or replaced
    if (!(form instanceof HTMLFormElement)) {
      console.error("Form submit event missing a valid form target");
      return;
    }
    try {
      setFormState("submitting");
      const formEntries = new FormData(form).entries();
      const formDataObject = Object.fromEntries(formEntries);
      // normalize form data to desired format
      const formData = normalizeFormData(formDataObject);
      // validate data
      const dataValid = validateFormData(formData);
      // reset error
      if (dataValid) {
        setErrors({});
        setGlobalErrors({});
      }
      const submissionPayload = prepareSubmissionPayload(formData);
      const data = await submitNotePayload(submissionPayload);
      if (data) {
        console.log(data);
        setFormState("success");
      }
    } catch (error) {
      setFormState("idle");
      if (error instanceof ValidationError) {
        setErrors(error.payload);
      } else if (error instanceof GlobalError) {
        setGlobalErrors(error.payload);
      } else {
        console.error(error);
        setFormState("error");
      }
    }
  }
  return {
    globalErrors,
    errors,
    formState,
    setErrors,
    setFormState,
    handelSubmit,
  };
}

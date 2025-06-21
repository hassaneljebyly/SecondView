import { useState } from "react";
import {
  normalizeFormData,
  prepareSubmissionPayload,
  submitNotePayload,
} from "../utils/data";
import { validateFormData } from "../utils/validation";
import { ValidationError, type ValidationErrorPayload } from "../utils/error";

export type FormState = "hidden" | "idle" | "submitting" | "success" | "error";

export default function useForm() {
  const [errors, setErrors] = useState<ValidationErrorPayload>({});
  // [🧱 REFACTOR]:  control form state styles via css class
  const [formState, setFormState] = useState<FormState>("hidden");

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // check if form in dom
    // in a SPA environments(YouTube in this case)
    //  the form may be dynamically removed or replaced
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
      const submissionPayload = prepareSubmissionPayload(formData);
      const dataValid = validateFormData(formData);
      // reset error
      console.log(dataValid);
      if (dataValid) setErrors({});
      const data = await submitNotePayload(submissionPayload);
      if (data) {
        console.log(data);
        setFormState("success");
      }
    } catch (error) {
      setFormState("idle");
      if (error instanceof ValidationError) {
        setErrors(error.payload);
      } else {
        console.error(error);
        setFormState("error");
      }
    }
  }
  return {
    errors,
    formState,
    setErrors,
    setFormState,
    handelSubmit,
  };
}

import { useState } from "react";
import { validateFormData } from "../utils/validation";
import {
  GlobalError,
  ValidationError,
  type GlobalErrorPayload,
  type ValidationErrorPayload,
} from "../utils/error";
import { getVideoDetails_better } from "../utils/youtube";
import type { FormInputData } from "../types";
import { timeStringToSeconds } from "../utils/timestamp";
import type { Categories } from "../api";
import { useNotes } from "./useNotes";

export type FormState = "hidden" | "idle" | "submitting" | "success" | "error";

export default function useForm() {
  const { updateNotes, noteMap } = useNotes();
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
      const formDataObject = Object.fromEntries(formEntries) as FormInputData;
      // validate data
      const notesList = Array.from(noteMap.notesMap.values());
      validateFormData(formDataObject, notesList);
      // Validation passed
      setErrors({});
      setGlobalErrors({});
      await updateNotes({
        ...getVideoDetails_better(),
        startTime: timeStringToSeconds(formDataObject.startTime),
        endTime: timeStringToSeconds(formDataObject.endTime),
        category: formDataObject.category as Categories,
        noteContent: formDataObject.noteContent,
        // [🧱 REFACTOR]: get current user ID
        submittedBy: Math.random().toString(36),
      });

      setFormState("success");
    } catch (error) {
      setFormState("idle");
      if (error instanceof ValidationError) {
        setErrors(error.payload);
      } else if (error instanceof GlobalError) {
        setGlobalErrors(error.payload);
        // by now from  inputs are valid but
        // global error is the last one
        setErrors({});
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
    setGlobalErrors,
    setErrors,
    setFormState,
    handelSubmit,
  };
}

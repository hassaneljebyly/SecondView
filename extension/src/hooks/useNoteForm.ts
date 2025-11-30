import React, { useEffect, useState } from 'react';

import { noteFormId } from '@/components/content/NoteForm';
import type { FormState, NoteFormButtonConfigMap } from '@/types/components';
import { BUTTON_STATES_MAP } from '@/utils/config/componentsConfig';
import { autoFocusFirstInput, autoFocusFirstInputWithError } from '@/utils/dom/autoFocus';
import { resetForm } from '@/utils/dom/formReset';
import { getVideoDetails } from '@/utils/dom/youtube';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';
import { mockNotesDataResponse } from '@shared/mocks/mockDataConfig';
import type { NoteCategoryKeys } from '@shared/types/noteConstrains';
import type { FormInputData, NoteSubmissionPayload } from '@shared/types/schemas';
import type { ValidationConfig, ValidationErrors } from '@shared/types/validation';
import { validationConstants } from '@shared/utils/config/noteConstrainsConfig';
import { ACCEPTED_LINKS_FORMAT, TIME_STAMP_REGEX } from '@shared/utils/config/regexConfig';
import { baseNoteFormFields } from '@shared/utils/config/schemasConfig';
import { extractSourcesFromNote } from '@shared/utils/format/sourceParsing';
import { timeStringToSeconds } from '@shared/utils/validation/helpers';
import { validateForm } from '@shared/utils/validation/validationChainClient';

import useProfile from './useProfile';

/**
 * Custom hook for managing the lifecycle of a "Note Form".
 *
 * Encapsulates:
 * - Open/close state of the form via form:toggle event
 * - Submission state (`idle`, `submitting`, `success`, `error`)
 * - Global error handling
 * - Event subscriptions for toggling & closing (e.g. Escape key)
 * - Utility values for rendering
 *
 * @returns {UseNoteFormReturn} Exposes state values, setters, event handlers,
 *                   and UI configuration for form rendering.
 */
export function useNoteForm(): UseNoteFormReturn {
  const [openForm, setOpenForm] = useState(false);
  const [formSubmissionState, setFormSubmissionState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const {
    profile: { userName },
  } = useProfile();

  function handleFormToggle() {
    setOpenForm(prev => !prev);
    autoFocusFirstInput();
  }

  function handleFormClose() {
    setOpenForm(false);
  }

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      // check if form in dom
      // in a SPA environments(YouTube in this case)
      // the form may be dynamically removed or replaced
      if (!(form instanceof HTMLFormElement)) {
        console.error('Form submit event missing a valid form target');
        return;
      }
      const videoMetaData = getVideoDetails();
      const { videoLength } = videoMetaData;
      const rawFormData = Object.fromEntries(new FormData(e.currentTarget).entries());
      const noteFormValidationOptions: ValidationConfig = {
        formData: rawFormData as FormInputData,
        existingNotes: mockNotesDataResponse['noteList'],
        videoLength,
        baseNoteFormFields,
        ...validationConstants,
      };
      const validationResult = validateForm(noteFormValidationOptions);
      if (validationResult.formIsValid) {
        setFormSubmissionState('submitting');
        setTimeout(() => {
          setFormSubmissionState('success');

          setTimeout(() => {
            setFormSubmissionState('idle');
            // since form.reset() will only rest uncontrolled inputs
            // It was decided to use an event to reset the uncontrolled and
            // controlled inputs at the same time
            globalEventSingleton.emit('form:reset');
            // to toggle button state
            globalEventSingleton.emit('form:close');
            // to close form
            globalEventSingleton.emit('form:toggle');
          }, 1000);
        }, 5000);
        setErrors({});
        const { startTime, endTime, category, noteContent } = validationResult['formData'];
        const payload: NoteSubmissionPayload = {
          videoMetaData,
          note: {
            userId: userName,
            startTimeSeconds: timeStringToSeconds(startTime, TIME_STAMP_REGEX) as number,
            endTimeSeconds: timeStringToSeconds(endTime, TIME_STAMP_REGEX) as number,
            category: category as NoteCategoryKeys,
            noteContent,
            sources: extractSourcesFromNote(noteContent, ACCEPTED_LINKS_FORMAT),
          },
        };
        logger.info(payload);
      } else {
        autoFocusFirstInputWithError();
        setErrors(validationResult.errors);
      }
    } catch (error) {
      setFormSubmissionState('error');
      const errorText =
        'Oops! Something went wrong while submitting. Please try again in a moment.';
      logger.error(errorText, error);
      setErrors({
        form: errorText,
      });
    }
  }

  useEffect(() => {
    const resetFormEvent = globalEventSingleton.on('form:reset', () => resetForm(noteFormId));
    const toggleFormEvent = globalEventSingleton.on('form:toggle', handleFormToggle);
    const escapeKeyEvent = globalEventSingleton.on('keydown', e => {
      if ((e as KeyboardEvent).key === 'Escape' && openForm) {
        globalEventSingleton.emit('form:close');
        handleFormClose();
      }
    });

    return () => {
      resetFormEvent.disconnectEvent();
      toggleFormEvent.disconnectEvent();
      escapeKeyEvent.disconnectEvent();
    };
  }, [openForm]);

  const formClassName = `sv-form sv-popup-panel sv-animation--panel ${
    openForm ? 'sv-animation--panel-show' : 'sv-animation--panel-hide'
  }`;

  const formErrorId = 'sv-form-global-error';

  const buttonConfig = BUTTON_STATES_MAP;

  return {
    handelSubmit,
    openForm,
    setOpenForm,
    formSubmissionState,
    setFormSubmissionState,
    errors,
    setErrors,
    handleFormToggle,
    handleFormClose,
    formClassName,
    formErrorId,
    buttonConfig,
  };
}

export type UseNoteFormReturn = {
  handelSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  formSubmissionState: FormState;
  setFormSubmissionState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: ValidationErrors;
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  handleFormToggle: () => void;
  handleFormClose: () => void;
  formClassName: string;
  formErrorId: string;
  buttonConfig: NoteFormButtonConfigMap;
};

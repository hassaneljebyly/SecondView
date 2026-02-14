import React, { useEffect, useRef, useState } from 'react';

import { submitNote } from '@/api/apiHandlers/notes';
import type { NoteResponse, NoteSubmissionPayload } from '@/api/types/notes';
import { noteFormId } from '@/components/content/NoteForm';
import type { FormState, NoteFormButtonConfigMap } from '@/types/components';
import { BUTTON_STATES_MAP } from '@/utils/config/componentsConfig';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { IS_DEV } from '@/utils/config/loggerConfig';
import { autoFocusFirstInput, autoFocusFirstInputWithError } from '@/utils/dom/autoFocus';
import { resetForm } from '@/utils/dom/formReset';
import { getVideoLength, getYouTubeId } from '@/utils/dom/youtube';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';
import { tempVideoId } from '@shared/mocks/youtube';
import type { NoteCategoryKeys } from '@shared/types/noteConstrains';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationConfig, ValidationErrors } from '@shared/types/validation';
import { validationConstants } from '@shared/utils/config/noteConstrainsConfig';
import { ACCEPTED_LINKS_FORMAT, TIME_STAMP_REGEX } from '@shared/utils/config/regexConfig';
import { baseNoteFormFields } from '@shared/utils/config/schemasConfig';
import { extractSourcesFromNote } from '@shared/utils/format/sourceParsing';
import { isoStringToLocalTimeString } from '@shared/utils/format/timeStamp';
import { timeStringToSeconds } from '@shared/utils/validation/helpers';
import { validateForm } from '@shared/utils/validation/validationChainClient';

import useNotes from './useNotes';
import useProfile from './useProfile';
import useRequest from './useRequest';

export const optimisticIdPrefix = 'optimistic_id_';

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
  const { profile } = useProfile();
  const currentYoutubeVideoId: string | null =
    (IS_DEV ? tempVideoId : getYouTubeId(window.location.href)) || null;
  const { notes, dispatchNewNotes, dispatchRemoveNote, dispatchReplaceNote } =
    useNotes(currentYoutubeVideoId);
  const { run, data: newCreatedNoteData, isError, isLoading } = useRequest(submitNote);
  const optimisticNoteIdRef = useRef<null | string>(null);
  if (!optimisticNoteIdRef.current) {
    optimisticNoteIdRef.current = `${optimisticIdPrefix}${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
  const optimisticNoteId = optimisticNoteIdRef.current;

  const {
    user: { id: userId, signingKey, username },
  } = profile;

  function handleFormToggle() {
    setErrors({});
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
        globalEventSingleton.emit('snackBar:show', window, {
          detail: { text: 'Something went wrong, try again', status: 'error' } as ShowSnackBarEvent,
        });
        logger.error('Form submit event missing a valid form target');
        return;
      }

      if (!userId || !signingKey || !currentYoutubeVideoId) {
        globalEventSingleton.emit('snackBar:show', window, {
          detail: {
            text: 'Need a valid profile to continue, please click the extension icon to generate a profile or import one',
            status: 'error',
          } as ShowSnackBarEvent,
        });
        return;
      }

      const videoLength = getVideoLength();
      const rawFormData = Object.fromEntries(new FormData(form).entries());
      const noteFormValidationOptions: ValidationConfig = {
        formData: rawFormData as FormInputData,
        existingNotes: notes,
        videoLength,
        baseNoteFormFields,
        ...validationConstants,
      };
      const validationResult = validateForm(noteFormValidationOptions);
      if (validationResult.formIsValid) {
        const { startTime, endTime, category, noteContent } = validationResult['formData'];
        const sources = extractSourcesFromNote(noteContent, ACCEPTED_LINKS_FORMAT);
        const startTimeSeconds = timeStringToSeconds(startTime, TIME_STAMP_REGEX) as number;
        const endTimeSeconds = timeStringToSeconds(endTime, TIME_STAMP_REGEX) as number;
        const payload: NoteSubmissionPayload = {
          videoMetaData: { videoId: currentYoutubeVideoId, videoLength },
          noteData: {
            startTimeSeconds,
            endTimeSeconds,
            category: category as NoteCategoryKeys,
            noteContent,
            sources,
          },
        };
        setErrors({});
        dispatchNewNotes([
          {
            id: optimisticNoteId,
            videoId: currentYoutubeVideoId,
            startTime: startTimeSeconds,
            endTime: endTimeSeconds,
            misinfoType: category as NoteCategoryKeys,
            noteText: noteContent,
            sources,
            status: 'pending',
            createdAt: null,
            createdBy: username!,
            alreadyRated: true,
            isOwn: true,
          },
        ]);
        run(userId, signingKey, payload);
      } else {
        autoFocusFirstInputWithError();
        setErrors(validationResult.errors);
      }
    } catch (error) {
      dispatchRemoveNote(optimisticNoteId);
      optimisticNoteIdRef.current = null;
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
    let closeFormTimeOut: ReturnType<typeof setTimeout> | null = null;
    if (isLoading) {
      setFormSubmissionState('submitting');
    } else if (isError) {
      const { message, code, meta } = isError;
      dispatchRemoveNote(optimisticNoteId);
      setFormSubmissionState('error');
      if (code === 'BAD_REQUEST_VALIDATION_FAILED' && meta && meta['validationResult']) {
        setErrors(meta['validationResult']);
      } else if (code === 'RATE_LIMIT_EXCEEDED' && meta && meta['tryAgainAfter']) {
        setErrors({
          form: `${message}. Try again at:\n${isoStringToLocalTimeString(meta['tryAgainAfter'] as string)}`,
        });
      } else if (code === 'RESOURCE_CONFLICT' && meta && meta['overlappingNotes']) {
        if ((meta['overlappingNotes'] as NoteResponse[]).length) {
          dispatchNewNotes(meta['overlappingNotes'] as NoteResponse[]);
        }
        setErrors({
          form: message,
        });
      } else {
        setErrors({
          form: message,
        });
      }
    } else if (newCreatedNoteData) {
      setFormSubmissionState('success');
      dispatchReplaceNote({
        optimisticId: optimisticNoteId,
        realNote: newCreatedNoteData['data']['note'],
      });
      optimisticNoteIdRef.current = null;
      closeFormTimeOut = setTimeout(() => {
        setFormSubmissionState('idle');
      }, 2000); // 2s then close the form
    }

    return () => {
      if (closeFormTimeOut !== null) clearTimeout(closeFormTimeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, newCreatedNoteData, isError]);

  useEffect(() => {
    const resetFormEvent = globalEventSingleton.on('form:reset', () => {
      resetForm(noteFormId);
    });
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

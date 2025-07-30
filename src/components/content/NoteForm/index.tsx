import { useEffect, useState } from 'react';

import type { FormInputData } from '@shared/types/schemas';
import type {
  FormInputDataFields,
  HandlerResult,
  ValidatorHandler,
} from '@shared/types/validation';
import { FormDataEntryKeysHandler } from '@shared/utils/validation/formDataEntryKeysHandler';
import { RequiredFieldHandler } from '@shared/utils/validation/requiredFieldHandler';

import { autoFocusFirstInput } from '@/utils/dom/autoFocus';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';

export const noteFormId = 'sv-form';
export default function NoteForm() {
  const [openForm, setOpenForm] = useState(false);
  function handleFormToggle() {
    setOpenForm(!openForm);
    autoFocusFirstInput();
  }
  function handleFormClose() {
    setOpenForm(false);
  }
  useEffect(() => {
    const toggleFormEvent = globalEventSingleton.on('form:toggle', handleFormToggle);
    const escapeKeyEvent = globalEventSingleton.on('keydown', e => {
      if ((e as KeyboardEvent).key === 'Escape' && openForm) {
        globalEventSingleton.emit('form:close');
        handleFormClose();
      }
    });
    return () => {
      toggleFormEvent.disconnectEvent();
      escapeKeyEvent.disconnectEvent();
    };
  });
  const formClassName = `sv-form sv-popup-panel sv-animation--panel ${openForm ? 'sv-animation--panel-show' : 'sv-animation--panel-hide'}`;
  return (
    <form
      id={noteFormId}
      className={formClassName}
      aria-errormessage='sv-form-global-error'
      aria-invalid='false'
      noValidate
      inert={!openForm}
      onSubmit={e => {
        e.preventDefault();
        const rawFormData = Object.fromEntries(new FormData(e.currentTarget).entries());
        const baseNoteFormFields: FormInputData = {
          startTime: '',
          endTime: '',
          category: '',
          noteContent: '',
        };
        const formValidatorChain: ValidatorHandler = new FormDataEntryKeysHandler(
          baseNoteFormFields,
          'Invalid data entry'
        );
        // const a: FormInputDataFields = ""
        formValidatorChain.setNext(new RequiredFieldHandler('', 'Required Field'));
        // const formValidatorChainResult: HandlerResult = formValidatorChain.validate(
        //   rawFormData
        // ) as HandlerResult;

        // const b = (formValidatorChain as ValidatorHandler).validate(rawFormData);

        // const formValidatorChainResult = formValidatorChain.handle(rawFormData);
        // validatorChain
        //   .setNext(new RequiredFieldsHandler())
        //   .setNext(new TimeStampValidationHandler('startTime'))
        //   .setNext(new TimeStampValidationHandler('endTime'));

        // logger.debug(formValidatorChainResult, rawFormData);
      }}
    >
      <fieldset className='sv-form__fieldset sv-form-fieldset-grid'>
        <legend className='sv-form__legend sv-divider sv-divider--bottom'>
          Explain the Context
        </legend>
        <div className='sv-form__group'>
          <label className='sv-form__label' htmlFor='sv-startTime'>
            start
            <button type='button' className='sv-button sv-button--text'>
              <span
                className='sv-button__icon sv-icon sv-icon--dark sv-icon--sm sv-icon--time'
                aria-hidden='true'
              />
              <span className='sv-button__text'>now</span>
            </button>
          </label>
          <input
            id='sv-startTime'
            className='sv-form__time-input sv-input'
            placeholder='(e.g. 1:05:30)'
            aria-errormessage='sv-startTime-error'
            aria-invalid='false'
            autoComplete='off'
            maxLength={8}
            pattern='^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$'
            required
            name='startTime'
          />
          <div className='sv-form__error-message-wrapper'>
            <span className='sv-fom__icon sv-icon sv-icon--sm sv-icon--error' />
            <em id='sv-startTime-error' className='sv-form__error-message' aria-live='polite' />
          </div>
        </div>
        <div className='sv-form__group'>
          <label className='sv-form__label' htmlFor='sv-endTime'>
            end
            <button type='button' className='sv-button sv-button--text'>
              <span
                className='sv-button__icon sv-icon sv-icon--dark sv-icon--sm sv-icon--time'
                aria-hidden='true'
              />
              <span className='sv-button__text'>now</span>
            </button>
          </label>
          <input
            id='sv-endTime'
            className='sv-form__time-input sv-input'
            placeholder='(e.g. 1:05:30)'
            aria-errormessage='sv-endTime-error'
            aria-invalid='false'
            autoComplete='off'
            maxLength={8}
            pattern='^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$'
            required
            name='endTime'
          />
          <div className='sv-form__error-message-wrapper'>
            <span className='sv-fom__icon sv-icon sv-icon--sm sv-icon--error' />
            <em id='sv-endTime-error' className='sv-form__error-message' aria-live='polite' />
          </div>
        </div>
        <div className='sv-form__group sv-form-fieldset-grid__item--full'>
          <label className='sv-form__label' htmlFor='sv-category'>
            category
          </label>
          <select
            id='sv-category'
            className='sv-form__select sv-input'
            name='category'
            aria-errormessage='sv-category-error'
            aria-invalid='false'
            required
          >
            <option value=''>Select note category</option>
            <option value='TEMPORAL_MISREPRESENTATION'>Temporal Misrepresentation</option>
            <option value='UNSUBSTANTIATED_ADVICE'>Unsubstantiated Advice</option>
            <option value='MANIPULATED_CONTENT'>Manipulated Content</option>
            <option value='FABRICATED_CONTENT'>Fabricated Content</option>
            <option value='MISLEADING_CONTENT'>Misleading Content</option>
            <option value='SATIRE_AND_PARODY'>Satire and Parody</option>
            <option value='FALSE_CONNECTIONS'>False Connections</option>
            <option value='SPONSORED_CONTENT'>Sponsored Content</option>
            <option value='IMPOSTER_CONTENT'>Imposter Content</option>
            <option value='FALSE_CONTEXT'>False Context</option>
            <option value='PROPAGANDA'>Propaganda</option>
            <option value='ERROR'>Error</option>
          </select>
          <div className='sv-form__error-message-wrapper'>
            <span className='sv-fom__icon sv-icon sv-icon--sm sv-icon--error' />
            <em id='sv-category-error' className='sv-form__error-message' aria-live='polite' />
          </div>
        </div>
        <div className='sv-form__group sv-form-fieldset-grid__item--full'>
          <label className='sv-form__label' htmlFor='sv-noteContent'>
            your note
          </label>
          <div className='sv-form__textarea-wrapper'>
            <textarea
              id='sv-noteContent'
              className='sv-form__textarea sv-input'
              name='noteContent'
              placeholder='Explain what’s incorrect or unclear, or add relevant context to support the content...'
              aria-errormessage='sv-noteContent-error'
              aria-invalid='false'
              maxLength={500}
              minLength={10}
              required
            />
            <p className='sv-form__char-counter' aria-live='polite'>
              0/500
            </p>
          </div>
          <div className='sv-form__error-message-wrapper'>
            <span className='sv-fom__icon sv-icon sv-icon--sm sv-icon--error' />
            <em id='sv-noteContent-error' className='sv-form__error-message' aria-live='polite' />
          </div>
        </div>
        <div className='sv-form__action sv-form-fieldset-grid__item--full sv-divider sv-divider--top'>
          <button className='sv-button sv-button--accent'>
            <span
              className='sv-button__icon sv-icon sv-icon--md sv-icon--submit'
              aria-hidden='true'
            />
            <span className='sv-button__text'>Submit</span>
          </button>
        </div>
      </fieldset>
    </form>
  );
}

// class RequiredFieldsHandler extends BaseValidationHandler {
//   override handle(formData: FormInputData[]): HandlerResult {
//     const formDataValues = Object.values(formData);
//     const formDataEntries = Object.entries(formData) as [keyof FormInputData, string][];
//     if (formDataValues.some(field => field.trim().length)) {
//       super.handle(formData as FormInputData, errors);
//     } else {
//       for (const [field, value] of formDataEntries) {
//         if (value.length) continue;
//         errors.push({
//           target: field,
//           message: 'Required Field',
//         });
//       }
//     }
//   }
// }

// class TimeStampValidationHandler extends BaseValidationHandler {
//   constructor(public targetTimeInput: 'startTime' | 'endTime') {
//     super();
//     this.targetTimeInput = targetTimeInput;
//   }
//   override handle(formData: FormInputData[]): HandlerResult {
//     const timeValue = formData[this.targetTimeInput].trim();
//     const timeValueIsValid = timeValue.length !== 0 && timeStringIsValid(timeValue, timeStampRegex);
//     timeStringIsValid(timeValue, timeStampRegex);
//     if (timeValueIsValid) {
//       super.handle(formData as FormInputData, errors);
//     } else {
//       errors.push({
//         target: this.targetTimeInput,
//         message:
//           timeValue.length === 0
//             ? 'Required Field'
//             : 'Invalid Input, use MM:SS format (e.g. 02:40)',
//       });
//     }
//   }
// }

// function checkFormCompletion(params:type) {

// }

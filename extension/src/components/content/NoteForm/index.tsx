import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useNoteForm } from '@/hooks/useNoteForm';
import {
  MAX_NOTE_LENGTH,
  MIN_NOTE_LENGTH,
  NOTE_CATEGORIES,
} from '@shared/utils/config/noteConstrainsConfig';
import { TIME_STAMP_REGEX } from '@shared/utils/config/regexConfig';

import MisInfoSelect from './MisInfoSelect';
import NoteTextArea from './NoteTextArea';
import TimeStampInput from './TimeStampInput';

export const noteFormId = 'sv-form';
export default function NoteForm() {
  const {
    handelSubmit,
    openForm,
    formSubmissionState,
    errors,
    formClassName,
    formErrorId,
    buttonConfig,
  } = useNoteForm();
  return (
    <form
      id={noteFormId}
      className={formClassName}
      aria-errormessage={formErrorId}
      aria-invalid={Boolean(Object.keys(errors).length)}
      noValidate
      inert={!openForm}
      onSubmit={handelSubmit}
    >
      <fieldset
        className='sv-form__fieldset sv-form-fieldset-grid'
        disabled={formSubmissionState === 'submitting'}
      >
        <legend className='sv-form__legend sv-divider sv-divider--bottom'>
          Explain the Context
        </legend>
        <TimeStampInput
          labelDisplayName='Start'
          name='startTime'
          maxLength={8} // hh:mm:ss => max length = 8
          timeStampPattern={TIME_STAMP_REGEX}
          errors={errors}
        />
        <TimeStampInput
          labelDisplayName='End'
          name='endTime'
          maxLength={8}
          timeStampPattern={TIME_STAMP_REGEX}
          errors={errors}
        />
        <MisInfoSelect
          labelDisplayName='Category'
          name='category'
          placeHolder='Select misinformation category'
          categoriesObject={NOTE_CATEGORIES}
          errors={errors}
        />
        <NoteTextArea
          labelDisplayName='Your Note'
          name='noteContent'
          placeholder='Explain what’s incorrect or unclear, or add relevant context to support the content...'
          maxNoteLength={MAX_NOTE_LENGTH}
          minNoteLength={MIN_NOTE_LENGTH}
          errors={errors}
        />
        <div className='sv-form__global-error-wrapper'>
          {errors['form'] && (
            <ErrorMessage id={formErrorId} errorMessage={errors['form'] ?? ''} global />
          )}
        </div>
        <div className='sv-form__action sv-form-fieldset-grid__item--full sv-divider sv-divider--top'>
          <Button
            disabled={formSubmissionState === 'submitting'}
            type='submit'
            text={buttonConfig[formSubmissionState]['text']}
            theme='blue'
            icon={{
              variant: buttonConfig[formSubmissionState]['icon'],
            }}
          />
        </div>
      </fieldset>
    </form>
  );
}

import React, { useRef, useState } from 'react';

import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import RemainingTimeDisplay from '@/components/ui/RemainingTimeDisplay';
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
  const [formHasValue, setFormHasValue] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [textAreaPlaceHolder, setTextAreaPlaceHolder] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const placeHolder =
      NOTE_CATEGORIES.find(({ value }) => value === e.target.value)?.notePlaceholder ||
      'Explain what’s incorrect or unclear, or add relevant context to support the content...';
    setTextAreaPlaceHolder(placeHolder);
  }

  return (
    <form
      ref={formRef}
      onInput={e => {
        const inputs = Object.fromEntries(new FormData(e.currentTarget).entries());
        const hasValue = Object.values(inputs).every(v => (v as string).trim() !== '');

        setFormHasValue(hasValue);
      }}
      id={noteFormId}
      className={formClassName}
      aria-errormessage={formErrorId}
      aria-invalid={Boolean(Object.keys(errors).length)}
      noValidate
      inert={!openForm}
      onKeyDown={e => {
        if (e.code === 'Enter' && e.ctrlKey) {
          const { current: form } = formRef;
          if (form) {
            const submitButton = form.querySelector<HTMLButtonElement>('button[type=submit]');
            if (submitButton && !submitButton.disabled) submitButton.click();
          }
        }
      }}
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
          onSelect={handleSelect}
          labelDisplayName='Category'
          name='category'
          placeHolder='Select misinformation category'
          categoriesObject={Object.groupBy(NOTE_CATEGORIES, ({ category }) => category)}
          errors={errors}
        />
        <NoteTextArea
          labelDisplayName='Your Note'
          name='noteContent'
          placeholder={textAreaPlaceHolder}
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
          <RemainingTimeDisplay
            rateLimitKey='rateLimits.notes.retryAt'
            label='Next submission in:'
            onTimesUp={() => setRateLimited(false)}
            runIfTimeRemainingOnce={() => setRateLimited(true)}
          />
          <Button
            disabled={rateLimited || formSubmissionState === 'submitting' || !formHasValue}
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

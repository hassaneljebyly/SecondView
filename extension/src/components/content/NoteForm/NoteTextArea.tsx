import { useState } from 'react';

import ErrorMessage from '@/components/ui/ErrorMessage';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationErrors } from '@shared/types/validation';

type NoteTextAreaProp = {
  labelDisplayName: string;
  name: keyof Pick<FormInputData, 'noteContent'>;
  placeholder: string;
  maxNoteLength: number;
  minNoteLength: number;
  errors: ValidationErrors;
};

export default function NoteTextArea({
  labelDisplayName,
  name,
  placeholder,
  maxNoteLength,
  minNoteLength,
  errors,
}: NoteTextAreaProp) {
  const [noteContentLength, setNoteContentLength] = useState(0);
  return (
    <div className='sv-form__group sv-form-fieldset-grid__item--full'>
      <label className='sv-form__label' htmlFor={`sv-${name}`}>
        {labelDisplayName}
      </label>
      <div className='sv-form__textarea-wrapper'>
        <textarea
          id={`sv-${name}`}
          className='sv-form__textarea sv-input'
          name={`${name}`}
          placeholder={placeholder}
          aria-errormessage={`sv-${name}-error`}
          aria-invalid={errors[`${name}`] !== undefined}
          maxLength={maxNoteLength}
          minLength={minNoteLength}
          required
          onChange={e => setNoteContentLength(e.target.value.length)}
        />
        <p className='sv-form__char-counter' aria-live='polite'>
          {`${noteContentLength}/${maxNoteLength}`}
        </p>
      </div>
      <ErrorMessage id={`sv-${name}-error`} errorMessage={errors[`${name}`] ?? ''} />
    </div>
  );
}

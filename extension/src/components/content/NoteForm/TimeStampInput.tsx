import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getCurrentTime } from '@/utils/dom/extractData';
import { globalEventSingleton } from '@/utils/lib/events';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationErrors } from '@shared/types/validation';

export default function TimeStampInput({
  labelDisplayName,
  name,
  maxLength,
  timeStampPattern,
  errors,
}: FormInputProp) {
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const resetFormEvent = globalEventSingleton.on('form:reset', () => setCurrentTime(''));
    return () => {
      resetFormEvent.disconnectEvent();
    };
  });
  return (
    <div className='sv-form__group'>
      <label className='sv-form__label' htmlFor={`sv-${name}`}>
        {labelDisplayName}
        <Button
          size='xs'
          icon={{
            variant: 'clock',
          }}
          text='now'
          actions={{
            onClick: () => {
              setCurrentTime(getCurrentTime() || '');
            },
          }}
        />
      </label>
      <input
        id={`sv-${name}`}
        className='sv-form__time-input sv-input'
        placeholder='(e.g. 1:05:30)'
        aria-errormessage={`sv-${name}-error`}
        aria-invalid={errors[`${name}`] !== undefined}
        autoComplete='off'
        maxLength={maxLength}
        pattern={timeStampPattern.source}
        value={currentTime}
        required
        name={`${name}`}
        onChange={e => {
          setCurrentTime(e.currentTarget.value);
        }}
      />
      <ErrorMessage id={`sv-${name}-error`} errorMessage={errors[`${name}`] ?? ''} />
    </div>
  );
}

type FormInputProp = {
  labelDisplayName: string;
  name: keyof Pick<FormInputData, 'endTime'> | keyof Pick<FormInputData, 'startTime'>;
  maxLength: number;
  timeStampPattern: RegExp;
  errors: ValidationErrors;
};

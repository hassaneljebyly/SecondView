import ErrorMessage from '@/components/ui/ErrorMessage';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationErrors } from '@shared/types/validation';

export default function TimeStampInput({
  labelDisplayName,
  name,
  maxLength,
  timeStampPattern,
  errors,
}: FormInputProp) {
  return (
    <div className='sv-form__group'>
      <label className='sv-form__label' htmlFor={`sv-${name}`}>
        {labelDisplayName}
        <button type='button' className='sv-button sv-button--text'>
          <span
            className='sv-button__icon sv-icon sv-icon--dark sv-icon--sm sv-icon--time'
            aria-hidden='true'
          />
          <span className='sv-button__text'>now</span>
        </button>
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
        required
        name={`${name}`}
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

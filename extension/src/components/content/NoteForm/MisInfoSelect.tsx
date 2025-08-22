import ErrorMessage from '@/components/ui/ErrorMessage';
import type { NoteMisInfoCategories } from '@shared/types/noteConstrains';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationErrors } from '@shared/types/validation';

type SelectInputProp = {
  labelDisplayName: string;
  name: keyof Pick<FormInputData, 'category'>;
  placeHolder: string;
  categoriesObject: NoteMisInfoCategories;
  errors: ValidationErrors;
};

export default function MisInfoSelect({
  labelDisplayName,
  name,
  placeHolder,
  categoriesObject,
  errors,
}: SelectInputProp) {
  return (
    <div className='sv-form__group sv-form-fieldset-grid__item--full'>
      <label className='sv-form__label' htmlFor={`sv-${name}`}>
        {labelDisplayName}
      </label>
      <select
        id={`sv-${name}`}
        className='sv-form__select sv-input'
        name={`${name}`}
        aria-errormessage={`sv-${name}-error`}
        aria-invalid={errors[`${name}`] !== undefined}
        required
      >
        <option value=''>{placeHolder}</option>
        {Object.entries(categoriesObject).map(([category, { displayName }]) => {
          return (
            <option key={category} value={category}>
              {displayName}
            </option>
          );
        })}
      </select>
      <ErrorMessage id={`sv-${name}-error`} errorMessage={errors[`${name}`] ?? ''} />
    </div>
  );
}

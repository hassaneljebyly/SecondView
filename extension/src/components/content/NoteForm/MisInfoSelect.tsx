import React, { useState } from 'react';

import ErrorMessage from '@/components/ui/ErrorMessage';
import type { MisinfoCategory, MisinfoType } from '@shared/types/noteConstrains';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationErrors } from '@shared/types/validation';
import { MISINFO_CATEGORIES, MISINFO_COLORS } from '@shared/utils/config/noteConstrainsConfig';

type SelectInputProp = {
  labelDisplayName: string;
  name: keyof Pick<FormInputData, 'category'>;
  placeHolder: string;
  errors: ValidationErrors;
  categoriesObject: Partial<Record<MisinfoCategory, MisinfoType[]>>;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function MisInfoSelect({
  labelDisplayName,
  name,
  placeHolder,
  categoriesObject,
  errors,
  onSelect,
}: SelectInputProp) {
  const [selectedText, setSelectedText] = useState('');

  return (
    <div className='sv-form__group sv-form-fieldset-grid__item--full'>
      <label className='sv-form__label' htmlFor={`sv-${name}`}>
        {labelDisplayName}
        <span className='sv-form__select-option-description'>{selectedText}</span>
      </label>
      <select
        id={`sv-${name}`}
        className='sv-form__select sv-input'
        name={`${name}`}
        aria-errormessage={`sv-${name}-error`}
        aria-invalid={errors[`${name}`] !== undefined}
        onChange={onSelect}
        required
      >
        <option disabled defaultValue='' hidden>
          {placeHolder}
        </option>
        {Object.entries(categoriesObject).map(([category, misinfoType]) => {
          return (
            <optgroup key={category} label={MISINFO_CATEGORIES[category as MisinfoCategory]}>
              {misinfoType.map(({ displayName, value, description }) => (
                <option
                  key={value}
                  value={value}
                  onMouseEnter={() => setSelectedText(description)}
                  onFocus={() => setSelectedText(description)}
                >
                  {/*
                  // TECHDEBT(me): ⚙️ Note: Using a <span> inside <option> 
                  // is invalid HTML and triggers a React hydration warning. 
                  // Safe to ignore in this client-side-only Chrome extension.
                   */}
                  <span
                    className='sv-form__select-dot'
                    style={{ backgroundColor: MISINFO_COLORS[value] }}
                  />
                  {displayName}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <ErrorMessage id={`sv-${name}-error`} errorMessage={errors[`${name}`] ?? ''} />
    </div>
  );
}

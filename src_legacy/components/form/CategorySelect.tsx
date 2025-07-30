import type {
  MisinformationCategories,
  MisinformationType,
  NoteData,
} from "../../types";
import type { ValidationErrorPayload } from "../../utils";
import { withPrefix } from "../../utils";

type SelectInputProp = {
  labelDisplayName: string;
  name: keyof NoteData;
  defaultSelect: string;
  categoriesList: MisinformationCategories[MisinformationType][];
  error: ValidationErrorPayload[keyof ValidationErrorPayload];
};

export default function CategorySelect(prop: SelectInputProp) {
  const {
    labelDisplayName: displayName,
    name,
    defaultSelect,
    categoriesList,
    error,
  } = prop;
  return (
    <div className={withPrefix("form__group", "form-grid-span-2")}>
      <label
        className={withPrefix("form__label")}
        htmlFor={withPrefix(`${name}`)}
      >
        {displayName}
      </label>
      <select
        id={withPrefix(`${name}`)}
        className={withPrefix("form__select", "form__field")}
        name={name}
        aria-errormessage={withPrefix(`${name}-error`)}
        aria-invalid={Boolean(error)}
        required
      >
        <option value="">{defaultSelect}</option>
        {categoriesList.map(({ value, displayName }) => {
          return (
            <option key={value} value={value}>
              {displayName}
            </option>
          );
        })}
      </select>
      <em
        id={withPrefix(`${name}-error`)}
        className={withPrefix("form__error-message")}
        aria-live="polite"
      >
        {error?.message || ""}
      </em>
    </div>
  );
}

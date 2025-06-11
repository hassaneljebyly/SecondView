import type { CategorySelectOptionsProp } from "../../types/components";

export function CategorySelectOptions(
  prop: CategorySelectOptionsProp
): React.JSX.Element {
  const { name, defaultSelect, categoriesList } = prop;
  return (
    <div className="sv-note__field">
      <label className="sv-note__label" htmlFor={`sv-${name}`}>
        {name}
      </label>
      <select
        className="sv-note__select"
        id={`sv-${name}`}
        name={`${name}`}
        aria-errormessage=""
        required
      >
        <option className="sv-note__option" value="">
          {defaultSelect}
        </option>
        {categoriesList.map((cat) => {
          const category = (cat as string).replaceAll("_", " ");
          return (
            <option key={cat} className="sv-note__option" value={cat}>
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </option>
          );
        })}
      </select>
      <span id={`sv-${name}-error-message`} aria-live="polite"></span>
    </div>
  );
}

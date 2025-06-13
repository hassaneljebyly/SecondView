import { PREFIX } from "../../utils/constant";

function withPrefix(...classNames: string[]) {
  // no white space
  return classNames.map((className) => PREFIX + className).join(" ");
}

export default function Form() {
  return (
    <div
      id={withPrefix("form-wrapper")}
      className={withPrefix("form-wrapper", "form-wrapper-grid")}
    >
      <form
        className={withPrefix("form", "form-wrapper-grid__item")}
        noValidate
      >
        <fieldset className={withPrefix("form__fieldset", "form-grid")}>
          <legend className={withPrefix("form__legend", "form-grid-span-2")}>
            Add Context Note
          </legend>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <div className={withPrefix("form__group")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("start")}
            >
              Start
            </label>
            <input
              id={withPrefix("start")}
              className={withPrefix("form__input", "form__field")}
              name={withPrefix("start")}
              placeholder="(e.g. 1:05:30)"
              aria-errormessage={withPrefix("start-error")}
              aria-invalid="false"
              autoComplete="off"
              maxLength={8}
              pattern="^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$"
              required
            />
            <em
              id={withPrefix("start-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("end")}
            >
              End
            </label>
            <input
              id={withPrefix("end")}
              className={withPrefix("form__input", "form__field")}
              name={withPrefix("end")}
              placeholder="(e.g. 1:05:30)"
              aria-errormessage={withPrefix("end-error")}
              aria-invalid="false"
              autoComplete="off"
              maxLength={8}
              pattern="^(\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$"
              required
            />
            <em
              id={withPrefix("end-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group", "form-grid-span-2")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("category")}
            >
              Category
            </label>
            <select
              id={withPrefix("category")}
              className={withPrefix("form__select", "form__field")}
              name={withPrefix("category")}
              aria-errormessage={withPrefix("category-error")}
              aria-invalid="false"
              required
            >
              <option value="">Select note category</option>
              <option value="FABRICATED_CONTENT">Fabricated content</option>
              <option value="MANIPULATED_CONTENT">Manipulated content</option>
              <option value="IMPOSTER_CONTENT">Imposter content</option>
              <option value="MISLEADING_CONTENT">Misleading content</option>
              <option value="FALSE_CONTEXT">False context</option>
              <option value="SATIRE_AND_PARODY">Satire and parody</option>
              <option value="FALSE_CONNECTIONS">False connections</option>
              <option value="SPONSORED_CONTENT">Sponsored content</option>
              <option value="PROPAGANDA">Propaganda</option>
              <option value="ERROR">Error</option>
            </select>
            <em
              id={withPrefix("category-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
          </div>
          <div className={withPrefix("form__group", "form-grid-span-2")}>
            <label
              className={withPrefix("form__label")}
              htmlFor={withPrefix("note")}
            >
              Your note
            </label>
            <textarea
              id={withPrefix("note")}
              className={withPrefix("form__textarea", "form__field")}
              name={withPrefix("note")}
              placeholder="Explain what's incorrect or provide additional context..."
              aria-errormessage={withPrefix("note-error")}
              aria-invalid="false"
              maxLength={50}
              minLength={10}
              required
            ></textarea>
            <em
              id={withPrefix("note-error")}
              className={withPrefix("form__error-message")}
              aria-live="polite"
            ></em>
            <p className={withPrefix("form__char-counter")} aria-live="polite">
              0/500
            </p>
          </div>
          <hr className={withPrefix("form__divider", "form-grid-span-2")} />
          <div className={withPrefix("form__action", "form-grid-span-2")}>
            <button
              className={withPrefix(
                "form__submit-btn",
                "button",
                "button--primary"
              )}
              type="submit"
            >
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

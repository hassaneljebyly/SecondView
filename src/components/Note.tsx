import type React from "react";

// TODO: input functionality
// TODO: make form accessible
// TODO: input validation
// TODO: make form pretty, basic styling
// TODO change name of component

type FormDataType = {
  start: string;
  end: string;
  category: string;
  note: string;
};

// function formDataValidator(formData: FormDataType) {}

export default function Note() {
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEntries = new FormData(e.currentTarget).entries();
    const formData = Object.fromEntries(formEntries) as FormDataType;
    console.log(formData);
    console.log(e.currentTarget.checkValidity());
  }
  return (
    <div className="sv-note" id="sv-note">
      <form
        className="sv-note__form"
        id="sv-note__form"
        onSubmit={handleFormSubmit}
      >
        <fieldset className="sv-note__fieldset" id="sv-note__fieldset">
          <legend className="sv-note__legend" id="sv-note__legend">
            Add Context Note
          </legend>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-start">
              start
            </label>
            <input
              className="sv-note__input"
              id="sv-start"
              name="start"
              maxLength={8}
              pattern="^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?$"
              required
            />
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-end">
              end
            </label>
            <input
              className="sv-note__input"
              id="sv-end"
              name="end"
              maxLength={8}
              pattern="^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?$"
              required
            />
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-category">
              Category
            </label>
            <select
              className="sv-note__select"
              id="sv-category"
              name="category"
              required
            >
              <option className="sv-note__option" value="">
                Select note category
              </option>
              <option className="sv-note__option" value="fabricated-content">
                Fabricated content
              </option>
              <option className="sv-note__option" value="manipulated-content">
                Manipulated content
              </option>
              <option className="sv-note__option" value="imposter-content">
                Imposter content
              </option>
              <option className="sv-note__option" value="misleading-content">
                Misleading content
              </option>
              <option className="sv-note__option" value="false-context">
                False context
              </option>
              <option className="sv-note__option" value="satire-and-parody">
                Satire and parody
              </option>
              <option className="sv-note__option" value="false-connections">
                False connections
              </option>
              <option className="sv-note__option" value="sponsored-content">
                Sponsored content
              </option>
              <option className="sv-note__option" value="propaganda">
                Propaganda
              </option>
              <option className="sv-note__option" value="error">
                Error
              </option>
            </select>
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-note-textarea">
              Your Note
            </label>
            <textarea
              className="sv-note__textarea"
              id="sv-note-textarea"
              name="note"
              placeholder="Explain what's incorrect or provide additional context..."
              maxLength={500}
              minLength={5}
              required
            />
          </div>
          <div className="sv-note__actions">
            <button
              className="sv-note__button sv-note__button--cancel"
              id="sv-cancel"
            >
              Cancel
            </button>
            <button
              className="sv-note__button sv-note__button--submit"
              id="sv-submit"
            >
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

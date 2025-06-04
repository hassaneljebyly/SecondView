// TODO: input functionality
// TODO: make form accessible
// TODO: input validation
// TODO: make form pretty, basic styling
// TODO change name of component

export default function Note() {
  return (
    <div className="sv-note" id="sv-note">
      <form className="sv-note__form" id="sv-note__form">
        <fieldset className="sv-note__fieldset" id="sv-note__fieldset">
          <legend className="sv-note__legend" id="sv-note__legend">
            Add Context Note
          </legend>

          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-start">
              start
            </label>
            <input className="sv-note__input" id="sv-start" />
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-end">
              end
            </label>
            <input className="sv-note__input" id="sv-end" />
          </div>
          <div className="sv-note__field">
            <label className="sv-note__label" htmlFor="sv-category">
              Note Category
            </label>
            <select className="sv-note__select" id="sv-category">
              <option className="sv-note__option" value="" disabled selected>
                Select misinformation type
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
              placeholder="Explain what's incorrect or provide additional context..."
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

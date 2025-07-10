export default function NoteRating({
  ref,
  notePanelRef,
  openRatingPanel,
  setOpenRatingPanel,
  setActivePanel,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  notePanelRef: React.RefObject<HTMLDivElement | null>;
  openRatingPanel: boolean;
  setOpenRatingPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePanel: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}) {
  return (
    <div className="note-rating" aria-hidden={!openRatingPanel} ref={ref}>
      <form className="note-rating__form">
        <fieldset className="note-rating__fieldset">
          <legend id="sv-tablist-1" className="note-rating__legend">
            How Accurate was this note?
          </legend>

          <div
            role="tablist"
            aria-labelledby="sv-tablist-1"
            className="note-rating__tablist"
          >
            <button
              id="sv-tab-ACCURATE"
              className="note-rating__tab note-rating__tab--selected"
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="sv-tabpanel-ACCURATE"
              tabIndex={0}
            >
              <span className="note-rating__tab-text">accurate</span>
            </button>

            <button
              id="sv-tab-INACCURATE"
              className="note-rating__tab"
              type="button"
              role="tab"
              aria-selected="false"
              aria-controls="sv-tabpanel-INACCURATE"
              tabIndex={-1}
            >
              <span className="note-rating__tab-text">inaccurate</span>
            </button>
          </div>

          <div
            id="sv-tabpanel-ACCURATE"
            className="note-rating__tabpanel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby="sv-tab-ACCURATE"
          >
            <h3 className="note-rating__heading">Why was this note helpful?</h3>

            <label
              className="note-rating__checkbox-label"
              htmlFor="high-quality-sources"
            >
              High quality sources
              <input
                id="high-quality-sources"
                type="checkbox"
                name="high-quality-sources"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="specific-clear"
            >
              Specific and clear
              <input
                id="specific-clear"
                type="checkbox"
                name="specific-clear"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="contextually-relevant"
            >
              Contextually relevant
              <input
                id="contextually-relevant"
                type="checkbox"
                name="contextually-relevant"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="actionable-information"
            >
              Actionable information
              <input
                id="actionable-information"
                type="checkbox"
                name="actionable-information"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="balanced-tone"
            >
              Balanced tone
              <input
                id="balanced-tone"
                type="checkbox"
                name="balanced-tone"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="recent-current"
            >
              Recent and current
              <input
                id="recent-current"
                type="checkbox"
                name="recent-current"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="expert-perspective"
            >
              Expert perspective
              <input
                id="expert-perspective"
                type="checkbox"
                name="expert-perspective"
                className="note-rating__checkbox"
              />
            </label>

            <label
              className="note-rating__checkbox-label"
              htmlFor="comprehensive"
            >
              Comprehensive
              <input
                id="comprehensive"
                type="checkbox"
                name="comprehensive"
                className="note-rating__checkbox"
              />
            </label>
          </div>

          <div className="note-rating__submit-wrapper">
            <button
              type="button"
              className="note-rating__cancel-button"
              onClick={() => {
                setActivePanel(notePanelRef.current);
                setOpenRatingPanel(false);
              }}
            >
              Cancel
            </button>
            <button type="button" className="note-rating__submit-button">
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

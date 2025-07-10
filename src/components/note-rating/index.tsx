import { useState } from "react";
import {
  focusActiveTabButton,
  NOTE_FORM_PLACEHOLDERS,
  withPrefix,
} from "../../utils";

export type Tabs = "accurate" | "inaccurate";
let currentTabIndex = 0; // accurate opened by default
export default function NoteRating({
  defaultTabButtonRef,
  rateItButtonRef,
  ref,
  notePanelRef,
  openRatingPanel,
  setOpenRatingPanel,
  setActivePanel,
}: {
  defaultTabButtonRef: React.RefObject<HTMLButtonElement | null>;
  rateItButtonRef: React.RefObject<HTMLButtonElement | null>;
  ref: React.RefObject<HTMLDivElement | null>;
  notePanelRef: React.RefObject<HTMLDivElement | null>;
  openRatingPanel: boolean;
  setOpenRatingPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePanel: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}) {
  const [activeTab, setActiveTab] = useState<Tabs>("accurate");
  function handleTabClick(tab: Tabs) {
    setActiveTab(tab);
  }
  function handleTabKeyDow(e: React.KeyboardEvent<HTMLButtonElement>) {
    // reference https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
    const tabsArray: Tabs[] = ["accurate", "inaccurate"];
    if (e.code === "ArrowRight") {
      currentTabIndex = (currentTabIndex + 1) % tabsArray.length;
    }
    if (e.code === "ArrowLeft") {
      currentTabIndex =
        (((currentTabIndex - 1) % tabsArray.length) + tabsArray.length) %
        tabsArray.length;
    }
    if (e.code === "Home") {
      currentTabIndex = 0;
    }
    if (e.code === "End") {
      currentTabIndex = tabsArray.length - 1;
    }
    const currentActiveTab = tabsArray[currentTabIndex];
    setActiveTab(currentActiveTab);
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.code)) {
      // without this It gets stuck on tab buttons when clicking "Tab" key
      // which supposed to navigate to the tab panels
      focusActiveTabButton(currentActiveTab);
    }
  }
  function handleCancel(e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    /* e?.currentTarget.blur() solves:
     * Blocked aria-hidden on an element because its descendant retained focus.
     * The focus must not be hidden from assistive technology users
     * */
    e?.currentTarget.blur();
    requestAnimationFrame(() => {
      // return focus to where It was before rating panel opened (Rate It button)
      rateItButtonRef.current?.focus();
    });
    setActiveTab("accurate");
    setActivePanel(notePanelRef.current);
    setOpenRatingPanel(false);
  }
  const tabs = Object.keys(NOTE_FORM_PLACEHOLDERS.RATING);
  // [🧱 REFACTOR]: fix tabs naming and add type
  const currentTabInputs =
    NOTE_FORM_PLACEHOLDERS.RATING[activeTab.toUpperCase() as "ACCURATE"];
  return (
    <div
      className="note-rating"
      aria-hidden={!openRatingPanel}
      ref={ref}
      inert={!openRatingPanel}
      onKeyDown={(e) => {
        if (e.code === "Escape") {
          handleCancel();
        }
      }}
    >
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
            {tabs.map((tab, index) => {
              return (
                <button
                  key={tab}
                  ref={index === 0 ? defaultTabButtonRef : null}
                  id={withPrefix(`tab-${tab}`)}
                  className="note-rating__tab"
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.toLowerCase()}
                  aria-controls={withPrefix(`tabpanel-${tab.toLowerCase()}`)}
                  tabIndex={activeTab !== tab.toLowerCase() ? -1 : 0}
                  onClick={() => handleTabClick(tab.toLowerCase() as Tabs)}
                  onKeyDown={handleTabKeyDow}
                >
                  <span className="note-rating__tab-text">
                    {tab.toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`sv-tabpanel-${activeTab.toUpperCase()}`}
            className="note-rating__tabpanel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`sv-tab-${activeTab.toUpperCase()}`}
          >
            <h3 className="note-rating__heading">Why was this note helpful?</h3>
            {currentTabInputs.map(({ name, displayName }) => {
              return (
                <label
                  key={name}
                  className="note-rating__checkbox-label"
                  htmlFor={name}
                >
                  {displayName}
                  <input
                    id={name}
                    type="checkbox"
                    name={name}
                    className="note-rating__checkbox"
                  />
                </label>
              );
            })}
          </div>

          <div className="note-rating__action">
            <button
              type="button"
              className="note-rating__cancel-btn sv-button sv-button--secondary sv-button--sm"
              onClick={handleCancel}
            >
              <span className="sv-button__text">Cancel</span>
            </button>
            <button
              type="button"
              className="note-rating__submit-btn sv-button sv-button--primary sv-button--sm"
            >
              <span className="sv-button__text">Submit</span>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

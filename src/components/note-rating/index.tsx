import { useState } from "react";
import { NOTE_FORM_PLACEHOLDERS } from "../../utils";
import NoteRatingCheckboxes from "./NoteRatingCheckboxes";
import NoteRatingTabs from "./NoteRatingTabs";

export type Tabs = "accurate" | "inaccurate";
// [🧱 REFACTOR]: see where this is needed
export type RatingItem = {
  name: string;
  displayName: string;
};

export type Rating = {
  accurate: RatingItem[];
  inaccurate: RatingItem[];
};
function focusActiveTabButton(tab: Tabs) {
  const currentSelectedTabButton = document.getElementById(
    `sv-tab-${tab}`
  ) as HTMLButtonElement | null;

  if (currentSelectedTabButton) {
    requestAnimationFrame(() => {
      currentSelectedTabButton.focus();
    });
  }
}
let currentTabIndex = 0; // first tab is opened by default

export default function NoteRating({
  notePanelIsOpen,
  defaultTabButtonRef,
  rateItButtonRef,
  noteRatingPanelRef,
  notePanelRef,
  setActivePanel,
}: {
  notePanelIsOpen: boolean;
  defaultTabButtonRef: React.RefObject<HTMLButtonElement | null>;
  rateItButtonRef: React.RefObject<HTMLButtonElement | null>;
  noteRatingPanelRef: React.RefObject<HTMLDivElement | null>;
  notePanelRef: React.RefObject<HTMLDivElement | null>;
  setActivePanel: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}) {
  const [activeTab, setActiveTab] = useState<Tabs>("accurate");
  function handleTabClick(tab: Tabs) {
    setActiveTab(tab);
  }
  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const tabsArray: Tabs[] = ["accurate", "inaccurate"];

    switch (e.code) {
      case "ArrowRight":
        currentTabIndex = (currentTabIndex + 1) % tabsArray.length;
        break;
      case "ArrowLeft":
        currentTabIndex =
          (currentTabIndex - 1 + tabsArray.length) % tabsArray.length;
        break;
      case "Home":
        currentTabIndex = 0;
        break;
      case "End":
        currentTabIndex = tabsArray.length - 1;
        break;
      default:
        return;
    }

    const currentActiveTab = tabsArray[currentTabIndex];
    setActiveTab(currentActiveTab);
    focusActiveTabButton(currentActiveTab);
  }

  function handleCancel(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) {
    const isEscape =
      (e as React.KeyboardEvent<HTMLDivElement>).code === "Escape";
    const isClick = e.type === "click";

    if (!isEscape && !isClick) return;

    /* e?.currentTarget.blur() solves:
     * Blocked aria-hidden on an element because its descendant retained focus.
     * The focus must not be hidden from assistive technology users
     * */
    e.currentTarget.blur();
    requestAnimationFrame(() => {
      // return focus to where It was before rating panel opened (Rate It button)
      rateItButtonRef.current?.focus();
    });
    // reset default tab
    setActiveTab("accurate");
    setActivePanel(notePanelRef.current);
  }
  const tabs = Object.keys(NOTE_FORM_PLACEHOLDERS.RATING) as Tabs[];
  // [🧱 REFACTOR]: add type to constants and get that file sorted
  return (
    <div
      className="note-rating"
      aria-hidden={notePanelIsOpen}
      ref={noteRatingPanelRef}
      inert={notePanelIsOpen}
      onKeyDown={handleCancel}
    >
      <form className="note-rating__form">
        <fieldset className="note-rating__fieldset">
          <legend id="sv-tablist-1" className="note-rating__legend">
            How Accurate was this note?
          </legend>
          <NoteRatingTabs
            handleTabClick={handleTabClick}
            activeTab={activeTab}
            handleTabKeyDown={handleTabKeyDown}
            tabs={tabs}
            defaultTabButtonRef={defaultTabButtonRef}
          />
          <NoteRatingCheckboxes
            activeTab={activeTab}
            activeTabCheckboxes={
              NOTE_FORM_PLACEHOLDERS.RATING[
                activeTab
              ] as unknown as RatingItem[]
            }
          />
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

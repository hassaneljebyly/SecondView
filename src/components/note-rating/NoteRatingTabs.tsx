import type { Tabs } from ".";
import { withPrefix } from "../../utils";

export default function NoteRatingTabs({
  handleTabClick,
  handleTabKeyDown,
  activeTab,
  tabs,
  defaultTabButtonRef,
}: {
  handleTabClick: (tab: Tabs) => void;
  activeTab: Tabs;
  handleTabKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  tabs: Tabs[];
  defaultTabButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
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
            aria-selected={activeTab === tab}
            aria-controls={withPrefix(`tabpanel-${tab}`)}
            tabIndex={activeTab !== tab ? -1 : 0}
            onClick={() => handleTabClick(tab)}
            onKeyDown={handleTabKeyDown}
          >
            <span className="note-rating__tab-text">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}

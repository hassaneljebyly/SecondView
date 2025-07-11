import type { RatingItem, Tabs } from ".";

export default function NoteRatingCheckboxes({
  activeTabCheckboxes,
  activeTab,
}: {
  activeTab: Tabs;
  activeTabCheckboxes: RatingItem[];
}) {
  const heading =
    activeTab === "accurate"
      ? "Why was this note helpful?"
      : "Why was this note not helpful?";
  return (
    <div
      id={`sv-tabpanel-${activeTab}`}
      className="note-rating__tabpanel"
      role="tabpanel"
      aria-labelledby={`sv-tab-${activeTab}`}
    >
      <h3 className="note-rating__heading">{heading}</h3>
      {activeTabCheckboxes.map(({ name, displayName }) => {
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
  );
}

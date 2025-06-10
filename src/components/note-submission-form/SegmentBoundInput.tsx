export type SegmentBoundInputProp = {
  name: string;
  maxLength: number;
  pattern: RegExp;
};

export function SegmentBoundInput(
  prop: SegmentBoundInputProp
): React.JSX.Element {
  const { name, maxLength, pattern } = prop;
  return (
    <div className="sv-note__field">
      <label className="sv-note__label" htmlFor={`sv-${name}`}>
        {name}
      </label>
      <input
        className="sv-note__input"
        id={`sv-${name}`}
        aria-errormessage={`sv-${name}-error-message`}
        name={`${name}`}
        maxLength={maxLength}
        pattern={`${pattern}`}
        required
      />
      <span id={`sv-${name}-error-message`} aria-live="polite"></span>
    </div>
  );
}

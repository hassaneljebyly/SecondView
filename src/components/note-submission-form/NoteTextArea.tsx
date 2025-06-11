import { useState } from "react";
import type { NoteTextAreaProp } from "../../types/components";

export function NoteTextArea(prop: NoteTextAreaProp): React.JSX.Element {
  const [noteLength, setNoteLength] = useState(0);
  const { minLength, maxLength, placeholder, name } = prop;
  return (
    <div className={`sv-${name}__field`}>
      <label className={`sv-${name}__label`} htmlFor={`sv-${name}-textarea`}>
        Your Note
      </label>
      <textarea
        className={`sv-${name}__textarea`}
        id={`sv-${name}-textarea`}
        name={`${name}`}
        aria-errormessage={`sv-${name}-error-message`}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        required
        onChange={(e) => setNoteLength(e.currentTarget.value.length)}
      />
      <span id={`sv-${name}-error-message`} aria-live="polite"></span>
      <p>
        {noteLength}/{maxLength}
      </p>
    </div>
  );
}

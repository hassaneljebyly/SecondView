import type { NoteResponse } from '@/api/types/notes';
import { StackedNavigationProvider } from '@/context/StackedNavigationContext';

import Note from './Note';
import NoteDetails from './NoteDetails';
import NoteRatingTabs from './NoteRatingTabs';
import { StackedNavigation } from './StackedNavigation';

export const noteBlockId = 'sv-note-wrapper';
export default function NoteBlock({ note }: { note: NoteResponse }) {
  return (
    <StackedNavigationProvider>
      <StackedNavigation
        {...{
          note: <Note {...note} />,
          'note-details': <NoteDetails {...note} />,
          'note-rating': <NoteRatingTabs noteId={note.id} />,
        }}
      />
    </StackedNavigationProvider>
  );
}

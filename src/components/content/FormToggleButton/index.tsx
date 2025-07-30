import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import { globalEventSingleton } from '@/utils/lib/events';

import { noteFormId } from '../NoteForm';

export const formToggleButtonId = 'sv-add-note-btn';
export default function FormToggleButton() {
  //
  const [openForm, setOpenForm] = useState(false);

  function handleFormToggle() {
    globalEventSingleton.emit('form:toggle');
    setOpenForm(!openForm);
  }
  function handleCloseToggle() {
    setOpenForm(false);
  }

  useEffect(() => {
    const closeFormEvent = globalEventSingleton.on('form:close', handleCloseToggle);
    return () => {
      closeFormEvent.disconnectEvent();
    };
  });

  return (
    <Button
      id={formToggleButtonId}
      buttonType='button'
      IconSize='md'
      IconVariant={openForm ? 'cancel' : 'add'}
      buttonTheme='neutral'
      buttonText={openForm ? 'Cancel' : 'Add Note'}
      type='button'
      ariaProps={{
        'aria-controls': noteFormId,
        'aria-expanded': openForm,
      }}
      onClick={handleFormToggle}
    />
  );
}

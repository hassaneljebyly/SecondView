import { RATINGS_CHECKBOXES_TABS } from '@/utils/config/notRatingConfig';

import Button from './Button';

export default function NoteRatingTabs() {
  return (
    <div className='note-rating' aria-hidden='true'>
      <form className='note-rating__form'>
        <fieldset className='note-rating__fieldset'>
          <legend id='sv-tablist-1' className='note-rating__legend sv-divider sv-divider--bottom'>
            How Accurate was this note?
          </legend>

          <div className='note-rating__tabs sv-divider sv-divider--bottom' role='tablist'>
            <Button text='Accurate' shape='rounded' theme='light' role='tab' />
            <Button text='Inaccurate' shape='rounded' theme='dark' role='tab' />
          </div>

          <div className='note-rating__reasons sv-divider sv-divider--bottom'>
            <h3 className='note-rating__checkbox-heading'>Why was this note helpful?</h3>
            {RATINGS_CHECKBOXES_TABS['accurate'].map(({ value, label }) => {
              return (
                <label key={value} className='note-rating__checkbox-label' htmlFor={value}>
                  {label}
                  <input
                    id={value}
                    type='checkbox'
                    name='accurate'
                    value={value}
                    className='sv-checkbox'
                  />
                </label>
              );
            })}
          </div>

          <div className='note-rating__action'>
            <Button text='Cancel' shape='pill' role='tab' />
            <Button
              text='Submit'
              shape='pill'
              theme='blue'
              role='tab'
              icon={{ variant: 'upload' }}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
}

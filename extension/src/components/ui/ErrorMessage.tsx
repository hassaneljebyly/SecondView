import Icon from './Icon';

export default function ErrorMessage({
  id,
  errorMessage,
  global = false,
}: {
  id: string;
  errorMessage: string;
  global?: boolean;
}) {
  // REFACTOR(me/#1): 🧱 create better error component
  // Issue: https://github.com/hassaneljebyly/SecondView/issues/1
  return (
    <div className={`sv-form__error-message-wrapper${global ? ' sv-error--global' : ''}`}>
      <Icon size='sm' variant='error' />
      <em id={id} className='sv-form__error-message' aria-live='polite'>
        {errorMessage}
      </em>
    </div>
  );
}

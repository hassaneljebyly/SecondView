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
  // [🎨 UI/UX]: create better error component
  return (
    <div className={`sv-form__error-message-wrapper${global ? ' sv-error--global' : ''}`}>
      <Icon size='sm' variant='error' />
      <em id={id} className='sv-form__error-message' aria-live='polite'>
        {errorMessage}
      </em>
    </div>
  );
}

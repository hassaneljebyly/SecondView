import type { ButtonProps } from '@/types';

import Icon from './Icon';

export default function Button(props: ButtonProps) {
  const {
    id,
    type,
    IconTheme = 'dark',
    IconVariant,
    IconSize,
    buttonType,
    IconAnimation = '',
    ariaProps,
    onClick,
  } = props;

  if (buttonType === 'icon-button') {
    return (
      <button
        {...ariaProps}
        id={id}
        className='sv-icon-button'
        aria-label={props.ariaLabel}
        type={type}
        onClick={onClick}
      >
        <Icon size={IconSize} variant={IconVariant} theme={IconTheme} animation={IconAnimation} />
      </button>
    );
  }

  if (buttonType === 'link-button') {
    return (
      <a {...ariaProps} id={id} className='icon-button' href={props.href} onClick={onClick}>
        <Icon size={IconSize} variant={IconVariant} theme={IconTheme} animation={IconAnimation} />
        <span className='sv-sr-only'>{props.srOnlyText}</span>
      </a>
    );
  }

  return (
    <button
      {...ariaProps}
      id={id}
      className={`sv-button sv-button--${props.buttonTheme}`}
      type={type}
      onClick={onClick}
    >
      <Icon size={IconSize} variant={IconVariant} theme={IconTheme} animation={IconAnimation} />
      <span className='sv-button__text'>{props.buttonText}</span>
    </button>
  );
}

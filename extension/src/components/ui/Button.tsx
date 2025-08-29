import type React from 'react';

import Icon, { type IconProps } from './Icon';

export default function Button({
  id,
  icon,
  iconOnly = false,
  theme = 'light',
  size = 'sm',
  shape = 'pill',
  disabled = false,
  type = 'button',
  aria,
  actions,
  text,
}: ButtonProps) {
  const classes = [
    'sv-button',
    theme ? `sv-button--${theme}` : '',
    size ? `sv-button--${size}` : '',
    shape ? `sv-button--${shape}` : '',
  ].join(' ');
  return (
    <button
      id={id}
      disabled={disabled}
      className={classes}
      aria-label={iconOnly ? text : undefined}
      type={type}
      {...aria}
      {...actions}
    >
      <span className='sv-button__icon' aria-hidden='true'>
        {icon && <Icon {...icon} />}
      </span>
      <span className='sv-button__text'>{iconOnly ? '' : text}</span>
    </button>
  );
}

type ButtonProps = {
  id?: string;
  icon?: IconProps;
  iconOnly?: boolean;
  theme?: 'light' | 'dark' | 'blue';
  size?: 'xs' | 'sm';
  shape?: 'pill' | 'rounded';
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  aria?: React.AriaAttributes;
  actions?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  text: string;
};

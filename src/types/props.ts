export type IconProps = {
  theme?: 'dark';
  size: 'xs' | 'sm' | 'md' | 'lg';
  variant: 'cancel' | 'add' | 'submit' | 'loading' | 'check' | 'settings' | 'time' | 'error';
  animation?: string;
};

export type AriaProps = {
  [T in keyof React.AriaAttributes]: React.AriaAttributes[T];
};

export type CommonIconProps = {
  [K in keyof IconProps as `Icon${Capitalize<K>}`]: IconProps[K];
};

export type ButtonProps =
  | ({
      buttonType: 'button';
      buttonTheme: 'neutral' | 'accent' | 'dark';
      buttonText: string;
      type?: 'button' | 'submit' | 'reset';
      id?: string;
      ariaProps?: AriaProps;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    } & CommonIconProps)
  | ({
      buttonType: 'icon-button';
      ariaLabel: string;
      type?: 'button' | 'submit' | 'reset';
      id?: string;
      ariaProps?: AriaProps;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    } & CommonIconProps)
  | ({
      buttonType: 'link-button';
      href: string;
      srOnlyText: string;
      type?: never;
      id?: string;
      ariaProps?: AriaProps;
      onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    } & CommonIconProps);

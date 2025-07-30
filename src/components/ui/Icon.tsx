import type { IconProps } from '@/types';

export default function Icon({ theme, size, variant, animation }: IconProps) {
  return (
    <span
      className={`sv-button__icon sv-icon sv-icon--${theme} sv-icon--${size} sv-icon--${variant} ${animation ?? ''}`}
      aria-hidden='true'
    />
  );
}

// DOCS(me): 📘 create events map to infer custom events instead of type casting
export const CUSTOM_EVENTS = [
  'form:toggle',
  'form:open',
  'form:close',
  'form:reset',
  'note:show',
  'snackBar:show',
  'LocalStorage:changed',
] as const;

export type ShowSnackBarEvent = {
  status?: 'default' | 'success' | 'error' | 'warning' | 'info';
  text: string;
  actionLabel?: string;
  action?: () => void;
};

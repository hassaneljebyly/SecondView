import { logger } from '../lib/logger';

/**
 * Resets the form with the given ID, if it exists and is a valid `<form>` element.
 *
 * @param {string} formId - The ID of the form element to reset.
 * @returns {void}
 *
 * @example
 * // Resets the form with ID "loginForm"
 * resetForm("loginForm");
 *
 * @remarks
 * - If the element is not found or is not a `<form>`, the function does nothing.
 * - Errors during reset are caught and logged via `logger.error`.
 */
export function resetForm(formId: string): void {
  try {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (form && form.tagName === 'FORM' && form instanceof HTMLFormElement) {
      form.reset();
    }
  } catch (error) {
    logger.error('Failed to reset form: ', error);
  }
}

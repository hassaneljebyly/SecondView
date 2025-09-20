export function autoFocusFirstInput() {
  requestAnimationFrame(() => {
    (document.querySelector('#sv-form .sv-input') as HTMLInputElement).focus({
      preventScroll: true,
    });
  });
}
export function autoFocusFirstInputWithError() {
  requestAnimationFrame(() => {
    (document.querySelector('#sv-form .sv-input[aria-invalid="true"]') as HTMLInputElement)?.focus({
      preventScroll: true,
    });
  });
}

export function autoFocusActiveTab(tabId: string) {
  requestAnimationFrame(() => {
    const tabButton = document.getElementById(tabId) as HTMLButtonElement | null;
    if (tabButton) tabButton.focus({ preventScroll: true });
  });
}
export function autoFocusFirstTab() {
  requestAnimationFrame(() => {
    const tabButton = document.querySelector(
      '.sv-note-rating__tabs button'
    ) as HTMLButtonElement | null;
    if (tabButton) tabButton.focus({ preventScroll: true });
  });
}
export function autoFocusRateItButton() {
  requestAnimationFrame(() => {
    const tabButton = document.querySelector('.sv-note__footer button') as HTMLButtonElement | null;
    if (tabButton) tabButton.focus({ preventScroll: true });
  });
}

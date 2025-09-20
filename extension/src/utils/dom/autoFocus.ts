export function autoFocusFirstInput() {
  requestAnimationFrame(() => {
    (document.querySelector('#sv-form .sv-input') as HTMLInputElement).focus();
  });
}
export function autoFocusFirstInputWithError() {
  requestAnimationFrame(() => {
    (
      document.querySelector('#sv-form .sv-input[aria-invalid="true"]') as HTMLInputElement
    )?.focus();
  });
}

export function autoFocusActiveTab(tabId: string) {
  requestAnimationFrame(() => {
    const tabButton = document.getElementById(tabId) as HTMLButtonElement | null;
    if (tabButton) tabButton.focus();
  });
}

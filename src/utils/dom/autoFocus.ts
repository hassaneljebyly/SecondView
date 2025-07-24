export function autoFocusFirstInput() {
  requestAnimationFrame(() => {
    (document.querySelector('#sv-form .sv-input') as HTMLInputElement).focus();
  });
}

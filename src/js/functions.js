export function validateNumInputs(event) {
  if (
    !/[0-9]/.test(event.key) &&
    ![
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      ".",
      "Enter",
    ].includes(event.key)
  ) {
    event.preventDefault();
  }
}

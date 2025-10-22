export function validateNumInputs(event) {
  if (event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
    return;
  }

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
      "Ctrl" + "a",
    ].includes(event.key)
  ) {
    event.preventDefault();
  }
}

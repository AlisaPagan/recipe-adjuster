export function validateNumInputs(event) {
  if (event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
    return;
  }

  if (event.key === "-" && event.target.id === "degrees") {
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

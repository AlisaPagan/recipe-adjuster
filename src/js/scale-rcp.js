const baseQty = document.querySelector("#base");
const desiredQty = document.querySelector("#desired");

const ingredientInput = document.querySelector(".ingredient-group");
const inputContainer = document.querySelector(".ingredient-input-wrapper");

const addIngredient = document.querySelector(".add-new-btn");
const scaleRecipeButton = document.querySelector(".result-btn");
const clearAll = document.querySelector(".clear-btn");
const delButton = document.querySelector(".del-btn");

const numInputs = document.querySelectorAll('input[type="number"]');
const textInput = document.querySelector('input[type="text"]');

const placeholderText = document.querySelector(".empty-card-message");
const updatedRecipeList = document.querySelector(".updated-recipe-list");

numInputs.forEach((input) =>
  input.addEventListener("keydown", validateNumInputs)
);
textInput.addEventListener("input", validateTextInput);

updateDeleteButtons();

// =====ADD NEW INGREDIENT LINE======

addIngredient.addEventListener("click", addNewIngredient);
delButton.addEventListener("click", removeIngredient);

function addNewIngredient(event) {
  event.preventDefault();

  // =====clone inputs======
  let newIngredientInput = ingredientInput.cloneNode(true);

  // =====reset inputs======
  const inputs = newIngredientInput.querySelectorAll("input, select");

  inputs.forEach((input) => {
    if (input.tagName === "INPUT") {
      input.value = "";
    } else if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    }
  });
  // =====validate inputs======
  const numInputs = newIngredientInput.querySelectorAll('input[type="number"]');
  const textInput = newIngredientInput.querySelector('input[type="text"]');

  numInputs.forEach((input) =>
    input.addEventListener("keydown", validateNumInputs)
  );
  textInput.addEventListener("input", validateTextInput);

  // =====delete button======
  const deleteButton = newIngredientInput.querySelector(".del-btn");
  deleteButton.addEventListener("click", removeIngredient);

  addIngredient.insertAdjacentElement("beforebegin", newIngredientInput);

  updateDeleteButtons();
  updateIngredientLabels();
}

// =====clear all inputs======

clearAll.addEventListener("click", clearAllInputs);
function clearAllInputs() {
  const inputs = document.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.value = "";
    if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    }
  });

  const updatedListItem = document.querySelectorAll(".updated-ingredient");
  updatedListItem.forEach((listItem) => listItem.remove());
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
  updatedRecipeList.append(placeholderText);
}

// =====REMOVE INGREDIENT LINE======
function removeIngredient(event) {
  event.preventDefault();
  const ingrInputs = event.target.closest(".ingredient-group");
  ingrInputs.remove();
  updateDeleteButtons();
  updateIngredientLabels();
}

// =====UPDATE DEL BUTTON======
function updateDeleteButtons() {
  const ingrInputs = document.querySelectorAll(".ingredient-group");
  const deleteButtons = document.querySelectorAll(".del-btn");

  if (ingrInputs.length === 1) {
    deleteButtons.forEach((button) => (button.disabled = true));
  } else if (ingrInputs.length >= 2) {
    deleteButtons.forEach((button) => (button.disabled = false));
  }
}

// =====INPUTS VALIDATION======
function validateTextInput(event) {
  const input = event.target;

  if (input.type === "text") {
    input.value = input.value.replace(/[0-9]/g, "");
  }
}

function validateNumInputs(event) {
  if (
    !/[0-9]/.test(event.key) &&
    event.key !== "Backspace" &&
    event.key !== "Delete" &&
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight" &&
    event.key !== "Tab" &&
    event.key !== "." &&
    event.key !== "Enter"
  ) {
    event.preventDefault();
  }
}

// =====INGREDIENT LABEL NUMBER======

function updateIngredientLabels() {
  const ingredientGroups = document.querySelectorAll(".ingredient-group");

  ingredientGroups.forEach((group, index) => {
    const label = group.querySelector(".ingr-label");
    label.textContent = "Ingredient " + (index + 1);
  });
}

// =====RECIPE SCALING======

scaleRecipeButton.addEventListener("click", scaleRecipe);

function scaleRecipe(event) {
  event.preventDefault();
  const updatedListItem = document.querySelectorAll(".updated-ingredient");
  updatedListItem.forEach((ingredient) => ingredient.remove());

  document.querySelectorAll(".error-message").forEach((msg) => msg.remove());

  const name = document.querySelector(".ingr-name").value;
  const qty = document.querySelector(".ingr-qty").value;

  if (!baseQty.value || !desiredQty.value) {
    placeholderText.remove();
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Please input your base and desired yield!";
    updatedRecipeList.append(errorMessage);
    return;
  } else if (!name || !qty) {
    placeholderText.remove();
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Please input names and quantity of ingredients";
    updatedRecipeList.append(errorMessage);
    return;
  }

  const ingredientGroups = document.querySelectorAll(".ingredient-group");
  let scaleFactor = Number(desiredQty.value) / Number(baseQty.value);

  placeholderText.remove();
  ingredientGroups.forEach((group) => {
    const name = group.querySelector(".ingr-name").value;
    const qty = group.querySelector(".ingr-qty").value;
    const unit = group.querySelector(".select").value;

    if (!name || !qty) {
      return;
    }

    const scaledQty = Number(qty) * scaleFactor;
    const roundedQty = Math.round(scaledQty * 100) / 100;

    const updatedListItem = document.createElement("li");
    updatedListItem.classList.add("updated-ingredient");
    updatedListItem.textContent = `${name}: ${roundedQty} ${unit}`;

    updatedRecipeList.append(updatedListItem);
  });
}

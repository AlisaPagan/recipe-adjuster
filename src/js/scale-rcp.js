const baseQty = document.querySelector("#base");
const desiredQty = document.querySelector("#desired");

const ingredientInput = document.querySelector(".ingredient-group");
const inputContainer = document.querySelector(".ingredient-input-wrapper");

const addIngredient = document.querySelector(".add-new-btn");
const scaleRecipe = document.querySelector(".result-btn");
const clearAll = document.querySelector(".clear-btn");
const delButton = document.querySelector(".del-btn");

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

  // =====delete button======
  const deleteButton = newIngredientInput.querySelector(".del-btn");
  deleteButton.addEventListener("click", removeIngredient);

  addIngredient.insertAdjacentElement("beforebegin", newIngredientInput);

  updateDeleteButtons();
}

// =====clear all inputs======

clearAll.addEventListener("click", clearAllInputs);
function clearAllInputs() {
  const inputs = document.querySelectorAll("input, select");

  inputs.forEach((input) => {
    if (input.tagName === "INPUT") {
      input.value = "";
    } else if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    }
  });
}
// =====REMOVE INGREDIENT LINE======
function removeIngredient(event) {
  event.preventDefault();
  const ingrInputs = event.target.closest(".ingredient-group");
  ingrInputs.remove();
  updateDeleteButtons();
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

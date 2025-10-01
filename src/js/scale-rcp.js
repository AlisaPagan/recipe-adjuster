const baseQty = document.querySelector("#base");
const desiredQty = document.querySelector("#desired");

const ingredientInput = document.querySelector(".ingredient-group");
const inputContainer = document.querySelector(".ingredient-input-wrapper");

const addIngredient = document.querySelector(".add-new-btn");
const scaleRecipe = document.querySelector(".result-btn");
const clearAll = document.querySelector(".clear-btn");

// =====ADD NEW INGREDIENT LINE======

addIngredient.addEventListener("click", addNewIngredient);

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
  const inputContainer = newIngredientInput.querySelector(
    ".ingredient-input-wrapper"
  );

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("del-btn", "button");

  const delIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  delIcon.classList.add("icon");
  const delIconLink = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );

  delIconLink.setAttribute("href", "../images/icons.svg#icon-cross");

  delIcon.append(delIconLink);
  deleteButton.append(delIcon);

  // =====add to container======

  inputContainer.insertAdjacentElement("beforeend", deleteButton);

  addIngredient.insertAdjacentElement("beforebegin", newIngredientInput);
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

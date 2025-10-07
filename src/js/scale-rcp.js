// ===== GLOBAL ELEMENTS =====
const baseQty = document.querySelector("#base");
const desiredQty = document.querySelector("#desired");

const addIngredientBtn = document.querySelectorAll(".add-new-btn");
const scaleRecipeButton = document.querySelectorAll(".result-btn");
const clearAllBtn = document.querySelectorAll(".clear-btn");
const delButton = document.querySelectorAll(".del-btn");

const numInputs = document.querySelectorAll('input[type="number"]');
const textInputs = document.querySelectorAll('input[type="text"]');

const placeholderText = document.querySelector(".empty-card-message");
const updatedRecipeList = document.querySelector(".updated-recipe-list");

const tabButtons = document.querySelectorAll(".tablink");
const tabSections = document.querySelectorAll(".recipe-scale");

// ===== INPUT VALIDATION LISTENERS =====
numInputs.forEach((input) =>
  input.addEventListener("keydown", validateNumInputs)
);
textInputs.forEach((input) =>
  input.addEventListener("input", validateTextInput)
);

// ===== INITIALIZE =====
updateDeleteButtons();

// ===== SWITCH TABS =====
tabButtons.forEach((button) => {
  button.addEventListener("click", switchTabs);
});

function switchTabs(event) {
  const clickedBtn = event.currentTarget;
  const tabName = clickedBtn.dataset.tab;

  // Remove active state from all
  tabSections.forEach((tab) => tab.classList.remove("active"));
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  // Activate clicked tab + its button
  clickedBtn.classList.add("active");
  document.getElementById(tabName).classList.add("active");

  updateOutputCard(tabName);
  updateDeleteButtons();
}

// ===== UPDATE OUTPUT CARD DEFAULT TEXT =====
function updateOutputCard(tabName) {
  if (tabName === "key-ingr") {
    placeholderText.textContent =
      "Input your key ingredient and the original recipe, then click ‘Scale Recipe’ to see your updated recipe. Be sure to include the key ingredient in the recipe.";
  } else if (tabName === "portion") {
    placeholderText.textContent =
      "Input your ingredients and amounts, then click 'Scale Recipe' to see your updated recipe.";
  }
}

// ===== ADD NEW INGREDIENT LINE =====
addIngredientBtn.forEach((button) =>
  button.addEventListener("click", addNewIngredient)
);
delButton.forEach((button) =>
  button.addEventListener("click", removeIngredient)
);

function addNewIngredient(event) {
  event.preventDefault();
  const activeTab = event.target.closest(".recipe-scale");
  const ingredientInput = activeTab.querySelector(".ingredient-group");
  const addBtn = event.currentTarget;

  // ==== Clone + reset ====
  const newIngredientInput = ingredientInput.cloneNode(true);
  const inputs = newIngredientInput.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.value = "";
    if (input.tagName === "SELECT") input.selectedIndex = 0;
  });

  // ==== Add validation again ====
  const numInputs = newIngredientInput.querySelectorAll('input[type="number"]');
  const textInputs = newIngredientInput.querySelectorAll('input[type="text"]');
  numInputs.forEach((input) =>
    input.addEventListener("keydown", validateNumInputs)
  );
  textInputs.forEach((input) =>
    input.addEventListener("input", validateTextInput)
  );

  // ==== Add delete event ====
  const deleteButton = newIngredientInput.querySelector(".del-btn");
  deleteButton.addEventListener("click", removeIngredient);

  // ==== Insert before Add button ====
  addBtn.insertAdjacentElement("beforebegin", newIngredientInput);

  updateDeleteButtons();
  updateIngredientLabels(activeTab);
}

// ===== CLEAR ALL INPUTS =====
clearAllBtn.forEach((button) =>
  button.addEventListener("click", clearAllInputs)
);

function clearAllInputs(event) {
  const activeTab = event.target.closest(".recipe-scale");

  // ==== Remove all cloned ingredient groups except the first ====
  const ingredientGroups = activeTab.querySelectorAll(".ingredient-group");
  [...ingredientGroups].slice(1).forEach((group) => group.remove());

  // ==== Reset inputs ====
  const inputs = activeTab.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.value = "";
    if (input.tagName === "SELECT") input.selectedIndex = 0;
  });

  // ==== Clear output & errors ====
  updatedRecipeList
    .querySelectorAll(".updated-ingredient, .error-message")
    .forEach((el) => el.remove());

  // ==== Restore placeholder ====
  updatedRecipeList.append(placeholderText);

  updateDeleteButtons();
}

// ===== REMOVE INGREDIENT LINE =====
function removeIngredient(event) {
  event.preventDefault();
  const activeTab = event.target.closest(".recipe-scale");
  const group = event.target.closest(".ingredient-group");
  group.remove();
  updateDeleteButtons();
  updateIngredientLabels(activeTab);
}

// ===== UPDATE DELETE BUTTON STATE =====
function updateDeleteButtons() {
  const activeTab = document.querySelector(".recipe-scale.active");
  if (!activeTab) return;

  const groups = activeTab.querySelectorAll(".ingredient-group");
  const deleteButtons = activeTab.querySelectorAll(".del-btn");

  const disable = groups.length === 1;
  deleteButtons.forEach((btn) => (btn.disabled = disable));
}

// ===== INPUT VALIDATION =====
function validateTextInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[0-9]/g, "");
}

function validateNumInputs(event) {
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

// ===== INGREDIENT LABEL NUMBERS =====
function updateIngredientLabels(activeTab) {
  const ingredientGroups = activeTab.querySelectorAll(".ingredient-group");
  ingredientGroups.forEach((group, index) => {
    const label = group.querySelector(".ingr-label");
    label.textContent = "Ingredient " + (index + 1);
  });
}

// ===== RECIPE SCALING =====
scaleRecipeButton.forEach((button) =>
  button.addEventListener("click", scaleRecipe)
);

function scaleRecipe(event) {
  event.preventDefault();
  const activeTab = event.target.closest(".recipe-scale");

  // ==== Reset previous list + errors ====
  updatedRecipeList
    .querySelectorAll(".updated-ingredient, .error-message")
    .forEach((el) => el.remove());

  const name = activeTab.querySelector(".ingr-name").value;
  const qty = activeTab.querySelector(".ingr-qty").value;

  // ==== SCALING BY PORTION ====
  if (activeTab.id === "portion") {
    // ==== Validate base & desired yield ====
    if (
      !baseQty.value ||
      !desiredQty.value ||
      baseQty.value === "0" ||
      desiredQty.value === "0"
    ) {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Please input your base and desired yield!";
      updatedRecipeList.append(errorMessage);
      return;
    }

    // ==== Validate ingredients ====
    if (!name || !qty) {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent =
        "Please input names and quantity of ingredients!";
      updatedRecipeList.append(errorMessage);
      return;
    }

    const ingredientGroups = activeTab.querySelectorAll(".ingredient-group");
    const scaleFactor = Number(desiredQty.value) / Number(baseQty.value);

    placeholderText.remove();
    ingredientGroups.forEach((group) => {
      const name = group.querySelector(".ingr-name").value;
      const qty = group.querySelector(".ingr-qty").value;
      const unit = group.querySelector(".select").value;
      if (!name || !qty) return;

      const scaledQty = Number(qty) * scaleFactor;
      const roundedQty = Math.round(scaledQty * 100) / 100;

      const updatedListItem = document.createElement("li");
      updatedListItem.classList.add("updated-ingredient");
      updatedListItem.textContent = `${name}: ${roundedQty} ${unit}`;
      updatedRecipeList.append(updatedListItem);
    });
  }

  // ==== SCALING BY KEY INGREDIENT ====
  else if (activeTab.id === "key-ingr") {
    const keyIngredient = activeTab.querySelector("#key");
    if (!keyIngredient.value || keyIngredient.value === "0") {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent =
        "Please input the amount of your key ingredient!";
      updatedRecipeList.append(errorMessage);
      return;
    }

    if (!name || !qty) {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent =
        "Please input names and quantity of the original recipe ingredients!";
      updatedRecipeList.append(errorMessage);
      return;
    }

    const keyRadioBtn = activeTab.querySelector(
      "input[name='radio-key']:checked"
    );
    if (!keyRadioBtn) {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent =
        "Please select the key ingredient in the original recipe!";
      updatedRecipeList.append(errorMessage);
      return;
    }

    const group = keyRadioBtn.closest(".ingredient-group");
    const ingrName = group.querySelector(".ingr-name").value;
    const ingrQty = group.querySelector(".ingr-qty").value;
    const ingrUnit = group.querySelector(".select").value;

    if (ingrQty === "0" || !ingrQty) {
      placeholderText.remove();
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent =
        "Please enter the valid amount of the key ingredient in the original recipe! (can't be 0)";
      updatedRecipeList.append(errorMessage);
      return;
    }

    const keyScaleFactor = Number(keyIngredient.value) / Number(ingrQty);

    const ingrGroups = activeTab.querySelectorAll(".ingredient-group");
    ingrGroups.forEach((group) => {
      const ingrName = group.querySelector(".ingr-name").value;
      const ingrQty = group.querySelector(".ingr-qty").value;
      const ingrUnit = group.querySelector(".select").value;

      if (!ingrName || !ingrQty) return;

      const scaledQty = Number(ingrQty) * keyScaleFactor;
      const roundedQty = Math.round(scaledQty * 100) / 100;

      const originalRecipe = document.createElement("li");
      originalRecipe.classList.add("original-ingredient");
      originalRecipe.textContent = `${ingrName}: ${ingrQty} ${ingrUnit}`;
      updatedRecipeList.append(originalRecipe);

      const updatedListItem = document.createElement("li");
      updatedListItem.classList.add("updated-ingredient");
      updatedListItem.textContent = `${ingrName}: ${roundedQty} ${ingrUnit}`;
      updatedRecipeList.append(updatedListItem);
    });
  }
}

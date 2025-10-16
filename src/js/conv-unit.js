// ===== IMPORTS =====
// input validation

import { validateNumInputs } from "./functions.js";

// ===== GLOBAL ELEMENTS =====
const cardsWrappers = document.querySelectorAll(".convert-units-form-wrap");

const numConvertFrom = document.querySelector("#unit-to-conv");

const fromUnit = document.querySelector("#convert-from");
const toUnit = document.querySelector("#convert-to");

const ingredientDensity = document.querySelector("#ingredients");

const roundingBtns = document.querySelectorAll(".option-button");

const convertBtn = document.querySelectorAll(".result-btn");
const clearBtn = document.querySelectorAll(".clear-btn");

const tempInput = document.querySelector("#degrees");

const fromTemp = document.querySelector("#from-temp");
const toTemp = document.querySelector("#to-temp");

const resultCard = document.querySelector(".result");
const resultSubtitle = document.querySelector(".result-placeholder");
const resultDataWContainer = document.querySelector(".result-wrapper");

// ===== EVENT LISTENERS =====
//inputs
numConvertFrom.addEventListener("keydown", validateNumInputs);
tempInput.addEventListener("keydown", validateNumInputs);

//buttons
clearBtn.forEach((button) => {
  button.addEventListener("click", clearAllInputs);
});
//wrappers
cardsWrappers.forEach((card) =>
  card.addEventListener("focusin", clearCardOnSwitch)
);

// ===== OPEN/COLLAPSE CARDS =====
cardsWrappers.forEach((wrapper) => {
  const heading = wrapper.querySelector(".list-heading");
  const icon = wrapper.querySelector(".icon");

  heading.addEventListener("click", (event) => {
    wrapper.classList.toggle("open");
  });
});

// ===== CLEAR INPUTS, SELECTS =====
function clearAllInputs(eventOnCard) {
  let card;
  if (eventOnCard && eventOnCard.preventDefault) {
    eventOnCard.preventDefault();
    card = eventOnCard.currentTarget.closest(".convert-units-form-wrap");
  } else {
    card = eventOnCard;
  }

  if (!card) return;

  //reset inputs
  const inputs = card.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.value = "";
    if (input.tagName === "SELECT") input.selectedIndex = 0;
  });
}

// ===== CLEAR THE CARD ON FOCUS SWITCH =====
let activeCard = null;
function clearCardOnSwitch(event) {
  const currentCard = event.currentTarget;

  if (activeCard && activeCard !== currentCard) {
    clearAllInputs(activeCard);
  }

  activeCard = currentCard;
}

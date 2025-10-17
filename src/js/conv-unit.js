// ===== IMPORTS =====
// input validation

import { validateNumInputs } from "./functions.js";

// data

import { density, volumeUnits, weightUnits } from "./data.js";

// PREP DATA
const roundedVolume = roundUnits(volumeUnits);
const roundedWeight = roundUnits(weightUnits);

// ===== GLOBAL ELEMENTS =====
const cardsWrappers = document.querySelectorAll(".convert-units-form-wrap");

const numConvertFrom = document.querySelector("#unit-to-conv");

const fromUnit = document.querySelector("#convert-from");
const toUnit = document.querySelector("#convert-to");

const ingredientDensity = document.querySelector("#ingredients");

const roundingBtns = document.querySelectorAll(".option-button");

const convertUnitsBtn = document.querySelector(".result-btn-units");
const convertTempsBtn = document.querySelector(".result-btn-temps");
const clearBtn = document.querySelectorAll(".clear-btn");

const tempInput = document.querySelector("#degrees");

const fromTemp = document.querySelector("#from-temp");
const toTemp = document.querySelector("#to-temp");

const resultCard = document.querySelector(".result");
const resultSubtitle = document.querySelector(".result-placeholder");
const resultDataContainer = document.querySelector(".result-wrapper");

// ===== EVENT LISTENERS =====
//inputs
numConvertFrom.addEventListener("keydown", validateNumInputs);
tempInput.addEventListener("keydown", validateNumInputs);

convertUnitsBtn.addEventListener("click", handleUnitConversion);

function handleUnitConversion(event) {
  event.preventDefault();

  let chosenUnitSet;
  const amount = Number(numConvertFrom.value);
  const from = fromUnit.value;
  const to = toUnit.value;
  const ingredient = ingredientDensity.value;

  if (from in volumeUnits) {
    chosenUnitSet = volumeUnits;
  } else if (from in weightUnits) {
    chosenUnitSet = weightUnits;
  }
  const result = convertUnits(amount, from, to, chosenUnitSet, ingredient);

  if (result === NaN || result === undefined) {
    return;
  }
  resultSubtitle.remove();
  const convertedUnitsList = document.createElement("p");
  convertedUnitsList.classList.add("descr");
  convertedUnitsList.textContent = `${amount} ${from} of ${ingredient} equals to ${result} ${to}`;
  resultDataContainer.append(convertedUnitsList);
}

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

// ===== UNIT CONVERSION =====

// Round units
function roundUnits(obj) {
  let roundedUnits = {};
  for (const [unit, factor] of Object.entries(obj)) {
    roundedUnits[unit] = Math.round(factor * 100) / 100;
  }
  return roundedUnits;
}

// Convert units
function convertUnits(
  numConvertFrom,
  fromUnit,
  toUnit,
  chosenUnitSet,
  ingredient
) {
  const fromFactor = chosenUnitSet[fromUnit];
  const toFactor = chosenUnitSet[toUnit];
  const conversionResult = numConvertFrom * (fromFactor / toFactor);
  const densityFactor = density[ingredient];

  if (fromUnit in chosenUnitSet && toUnit in chosenUnitSet) {
    return Math.round(conversionResult * 100) / 100;
  }
  //
  else if (fromUnit in volumeUnits && toUnit in weightUnits) {
    const fromFactor = volumeUnits[fromUnit];
    const toFactor = weightUnits[toUnit];

    const ml = numConvertFrom * fromFactor;
    const gram = ml * densityFactor;

    const convertedValue = gram / toFactor;

    return Math.round(convertedValue * 100) / 100;
  }
  //
  else if (fromUnit in weightUnits && toUnit in volumeUnits) {
    const fromFactor = weightUnits[fromUnit];
    const toFactor = volumeUnits[toUnit];

    const gram = numConvertFrom * fromFactor;
    const ml = gram / densityFactor;

    const convertedValue = ml / toFactor;

    return Math.round(convertedValue * 100) / 100;
  }
}

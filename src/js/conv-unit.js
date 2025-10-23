/////////////////////////// ===== IMPORTS =====
// input validation

import { validateNumInputs } from "./functions.js";

// data

import {
  density,
  volumeUnits,
  weightUnits,
  unitNames,
  ingredientNames,
} from "./data.js";

/////////////////////////// ===== PREP DATA =====
let activeCard = null;
let currentRoundingMode = "none";

/////////////////////////// ===== GLOBAL ELEMENTS =====
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

const resultSubtitle = document.querySelector(".result-placeholder");

/////////////////////////// ===== EVENT LISTENERS =====
//inputs
numConvertFrom.addEventListener("keydown", validateNumInputs);
tempInput.addEventListener("keydown", validateNumInputs);

//buttons
convertUnitsBtn.addEventListener("click", handleUnitConversion);
convertTempsBtn.addEventListener("click", handleTempConversion);

roundingBtns.forEach((button) =>
  button.addEventListener("click", handleRounding)
);

clearBtn.forEach((button) => {
  button.addEventListener("click", clearAllInputs);
});
//wrappers
cardsWrappers.forEach((card) =>
  card.addEventListener("focusin", clearCardOnSwitch)
);

/////////////////////////// ===== EVENTS HANDLERS =====

// ===== Rounding buttons hangler =====
function handleRounding(event) {
  const mode = event.currentTarget.dataset.mode;
  currentRoundingMode = mode;

  if (event.currentTarget.classList.contains("active")) {
    event.currentTarget.classList.remove("active");
    currentRoundingMode = "none";
    return;
  } else {
    event.currentTarget.classList.contains("active");
    roundingBtns.forEach((button) => button.classList.remove("active"));
    event.currentTarget.classList.add("active");
  }
}

// ===== Unit conversion button hangler =====
function handleUnitConversion(event) {
  event.preventDefault();

  let chosenUnitSet;
  const amount = Number(numConvertFrom.value);
  const from = fromUnit.value;
  const to = toUnit.value;
  const ingredient = ingredientDensity.value;

  if (!amount) {
    resultSubtitle.textContent = "Please input the amount you wish to convert!";
    return;
  }
  //
  else if (from === "" || to === "") {
    resultSubtitle.textContent = "Please select the units you wish to convert!";
    return;
  }
  //
  else if (from === to) {
    resultSubtitle.textContent = "Same unit is selected!";
    return;
  }

  if (from in volumeUnits) {
    chosenUnitSet = volumeUnits;
  } else if (from in weightUnits) {
    chosenUnitSet = weightUnits;
  }
  // conversion
  const result = convertUnits(amount, from, to, chosenUnitSet, ingredient);
  //rounding
  const roundedResult = applyRounding(result);
  // format output
  const formattedResultText = cleanUpOutput(
    from,
    to,
    ingredient,
    amount,
    roundedResult
  );

  if (isNaN(result) || result === undefined) {
    return;
  }

  resultSubtitle.textContent = formattedResultText;
}
// ===== Temps conversion button hangler =====
function handleTempConversion(event) {
  event.preventDefault();

  const temperature = Number(tempInput.value);
  const from = fromTemp.value;
  const to = toTemp.value;

  if (!temperature) {
    resultSubtitle.textContent =
      "Please input the temperature you wish to convert!";
    return;
  }
  //
  else if (from === "" || to === "") {
    resultSubtitle.textContent = "Please select the scale you wish to convert!";
    return;
  }
  //
  else if (from === to) {
    resultSubtitle.textContent = "Same scale is selected!";
    return;
  }

  const result = convertTemps(temperature, from, to);

  if (isNaN(result) || result === undefined) {
    return;
  }

  resultSubtitle.textContent = `${temperature} ${from} equals ${result} ${to}.`;
}

/////////////////////////// ===== UTILITIES =====

// ===== Open/collapse cards =====
cardsWrappers.forEach((wrapper) => {
  const heading = wrapper.querySelector(".list-heading");
  const icon = wrapper.querySelector(".icon");

  heading.addEventListener("click", (event) => {
    wrapper.classList.toggle("open");
  });
});

// ===== Clear inputs & selects =====
function clearAllInputs(eventOnCard) {
  let card;
  if (eventOnCard && eventOnCard.preventDefault) {
    eventOnCard.preventDefault();
    card = eventOnCard.currentTarget.closest(".convert-units-form-wrap");
  } else {
    card = eventOnCard;
  }

  if (!card) return;

  // reset inputs
  const inputs = card.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.value = "";
    if (input.tagName === "SELECT") input.selectedIndex = 0;
  });

  roundingBtns.forEach((button) => button.classList.remove("active"));

  // reset result card
  resultSubtitle.textContent =
    "Please, input your values, select units and conditions and click convert!";
}

// ===== Clear the card on focus switch =====

function clearCardOnSwitch(event) {
  const currentCard = event.currentTarget;

  if (activeCard && activeCard !== currentCard) {
    clearAllInputs(activeCard);
  }

  activeCard = currentCard;
}

// ===== Unit conversion =====

// Convert units
function convertUnits(
  numConvertFrom,
  fromUnit,
  toUnit,
  chosenUnitSet,
  ingredient
) {
  //
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

// ===== Result output clean-up =====

function cleanUpOutput(from, to, ingredient, amount, result) {
  const fromName = unitNames[from]?.singular || from;
  const toName = unitNames[to]?.singular || to;
  const ingredientName = ingredientNames[ingredient] || ingredient;

  let fromFinalName;
  let toFinalName;

  if (amount <= 1) {
    fromFinalName = fromName;
  } else {
    fromFinalName = unitNames[from]?.plural || `${from}s`;
  }

  if (result <= 1) {
    toFinalName = toName;
  } else {
    toFinalName = unitNames[to]?.plural || `${to}s`;
  }

  const formattedOutput = `${amount} ${fromFinalName} of ${ingredientName} equals ${result} ${toFinalName}.`;

  return formattedOutput;
}

// ===== Rounding buttons =====

function applyRounding(result) {
  if (currentRoundingMode === "none") {
    return result;
  } else if (currentRoundingMode === "half") {
    return Math.round(result * 2) / 2;
  } else if (currentRoundingMode === "whole") {
    return Math.round(result);
  } else {
    return result;
  }
}

// ===== Temperature conversion =====

function convertTemps(tempInput, fromTemp, toTemp) {
  let convertedResult;
  if (fromTemp === "c" && toTemp === "f") {
    convertedResult = fromTemp * (9 / 5) + 32;
    const roundedConvertedResult = Math.round(convertedResult * 100) / 100;
  } else if (fromTemp === "f" && toTemp === "c") {
    convertedResult = (fromTemp - 32) * (5 / 9);
    const roundedConvertedResult = Math.round(convertedResult * 100) / 100;
  } else {
    return tempInput;
  }
  return roundedConvertedResult;
}

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
const cleartBtn = document.querySelectorAll(".clear-btn");

const tempInput = document.querySelector("#degrees");

const fromTemp = document.querySelector("#from-temp");
const toTemp = document.querySelector("#to-temp");

// ===== EVENT LISTENERS =====
//inputs
numConvertFrom.addEventListener("keydown", validateNumInputs);
tempInput.addEventListener("keydown", validateNumInputs);

//buttons

// ===== OPEN/COLLAPSE CARDS =====
cardsWrappers.forEach((wrapper) => {
  const heading = wrapper.querySelector(".list-heading");
  const icon = wrapper.querySelector(".icon");

  heading.addEventListener("click", (event) => {
    wrapper.classList.toggle("open");
  });
});

"use strict";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

gsap.registerPlugin(SplitText, DrawSVGPlugin, Draggable, InertiaPlugin);

const split = SplitText.create(".main-title", { type: "words", mask: "words" });
// GSAP Timeline
const tl = gsap.timeline();

tl.from(".controller-path", {
  duration: 3,
  ease: "power3.in",
  drawSVG: "0% 0%",
})
  .from(split.words, { yPercent: 100, ease: "back", stagger: 0.2 })
  .from(".key-pad-btn", { xPercent: 100, ease: "elastic.in", stagger: 0.2 });

// > ==================================
// * Elements
// > ==================================
const restartBtn = document.querySelector(".btn--play-again");
const inputEl = document.querySelector("#guess");
const checkBtn = document.querySelector(".btn--main");
const toast = document.querySelector(".toast");
const gameForm = document.querySelector(".game-form");
const messageEl = document.querySelector("#message");
const scoreEl = document.querySelector(".score__value");
const highScoreEl = document.querySelector(".high-score__value");
const levelInfo = document.querySelector("#level-info");

const rect = document.body.getBoundingClientRect();

const rightCornerX = rect.right;
const rightCornerY = rect.top;

// > ==================================
// * Celebration Function
// > ==================================

function celebration() {
  confetti({
    position: { x: 0, y: 0 },
    count: 500,
    size: 1,
    velocity: 200,
    fade: false,
    color: ["#FF06B5", "#fb8500", "#219ebc", "#9b5de5", "#00f5d4"],
  });

  confetti({
    position: { x: rightCornerX, y: Number(rightCornerY) },
    size: 1,
    velocity: 200,
    fade: false,
    color: ["#FF06B5", "#fb8500", "#219ebc", "#9b5de5", "#00f5d4"],
  });

  ribbons({
    count: 20,
    fade: false,
    color: ["#FF06B5", "#fb8500", "#219ebc", "#9b5de5", "#00f5d4"],
  });
}

const randomNumGenerator = Math.floor(Math.random() * 20 + 1);

let highScore = 0;

// > ==================================
// * Messages
// > ==================================

function winningMessage(num) {
  messageEl.textContent = `🎉🎉YAY! You win. The number was ${num}`;
  highScoreEl.textContent = highScore;
  if (!messageEl.classList.contains("success-text")) {
    messageEl.classList.add("success-text");
  }
  checkBtn.textContent = "Fire Confetti";
  celebration();
}

function loseMessage(term) {
  if (!messageEl.classList.contains("error-text")) {
    messageEl.classList.add("error-text");
  }
  messageEl.textContent = `Sorry! The number is quite ${term}.`;
  scoreEl.textContent -= 1;
  highScore++;
  inputEl.value = "";
}

// > ==================================
// * Check Conditions
// > ==================================

function checkCondition(actualNum, guessNum) {
  if (guessNum === actualNum) {
    winningMessage(actualNum);
  } else if (guessNum > actualNum) {
    loseMessage("big");
  } else {
    loseMessage("low");
  }
}

function checkValue(e) {
  e.preventDefault();
  const guess = Number(inputEl.value);
  if (!guess) return (messageEl.textContent = "Not a valid number.");
  checkCondition(randomNumGenerator, guess);
}

gameForm.addEventListener("keydown", function (e) {
  if (e.key === "Enter") e.preventDefault();
});

function restartGame() {
  messageEl.textContent = "Can you Guess it?";
  highScore = 0;
  scoreEl.textContent = 20;
  highScoreEl.textContent = 0;
  messageEl.classList.remove("error-text");
  messageEl.classList.remove("success-text");
  checkBtn.textContent = "Check!";
  inputEl.value = "";
  gsap.to(".btn--main", { x: 0, y: 0, ease: "power3.in" });
}

Draggable.create(".btn--main", {
  bounds: "body",
  inertia: true,
});

checkBtn.addEventListener("click", checkValue);
restartBtn.addEventListener("click", restartGame);

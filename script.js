import words from "./words.js";

const image = document.getElementById("toilet-image");
const gameBox = document.getElementById("game-box");
const gameOver = document.getElementById("game-over");
const gameWon = document.getElementById("game-won");
const blanksDiv = document.getElementById("blanks");
const meaningDiv = document.getElementById("meaning");
const attemptsP = document.getElementById("attempts");
const scoreP = document.getElementById("score");
const correctWordP = document.getElementById("correct-word");

const flushSound = new Audio("./assets/toilet-flush-182274.mp3");
const rizzSound = new Audio("./assets/rizz-sound-effect.mp3");
const skibidiSound = new Audio("./assets/skibidi-toilet.mp3");
skibidiSound.currentTime = 3;
flushSound.currentTime = 1.1;

let word;
let meaning;
let distinctLetters;
let wrongAttempts;
let score = 0;

function setupNewGame() {
  wrongAttempts = 0;
  distinctLetters = [];
  const getRandomWord = getWord();
  const randWord = getRandomWord();
  word = randWord.word;
  meaning = randWord.meaning;
  for (const char of word) {
    if (char !== " " && !distinctLetters.includes(char)) {
      distinctLetters.push(char);
    }
    const p = document.createElement("p");
    if (char === " ") {
      p.innerHTML = "&#160;";
      p.classList.add("space");
    } else {
      p.innerHTML = "_";
    }
    blanksDiv.appendChild(p);
  }
  meaningDiv.innerHTML = meaning;
  attemptsP.textContent = 10;
  scoreP.textContent = score;
}

function getWord() {
  const history = [];

  return function () {
    let randIndex;
    do {
      randIndex = Math.floor(Math.random() * words.length);
    } while (history.includes(randIndex));
    history.push(randIndex);
    if (history.length > 3) {
      history.shift();
    }
    return words[randIndex];
  };
}

function clickedLetter(letter) {
  const clickedButton = document.querySelector(
    `button[onclick="clickedLetter('${letter}')"]`
  );
  if (clickedButton.classList.contains("disabled")) {
    return;
  }
  clickedButton.classList.add("disabled");
  checkLetter(letter);
}

function checkLetter(letter) {
  const indices = [];
  let position = word.indexOf(letter);
  while (position !== -1) {
    indices.push(position);
    position = word.indexOf(letter, position + 1);
  }
  indices.length === 0 ? wrongLetter() : correctLetter(letter, indices);
}

function wrongLetter() {
  wrongAttempts++;
  image.style.height = `${wrongAttempts * 20}vh`;
  attemptsP.textContent = 10 - wrongAttempts;
  if (wrongAttempts === 1) rizzSound.play();
  if (wrongAttempts === 5) {
    skibidiSound.play();
    setTimeout(() => {
      skibidiSound.pause();
      skibidiSound.currentTime = 3;
    }, 3000);
  }
  if (wrongAttempts >= 10) {
    score = 0;
    gameBox.style.display = "none";
    gameOver.style.display = "flex";
    correctWordP.textContent = word;
    flushSound.play();
  }
}

function correctLetter(letter, indices) {
  for (const index of indices) {
    blanksDiv.children[index].innerHTML = letter;
  }
  distinctLetters.splice(distinctLetters.indexOf(letter), 1);
  if (distinctLetters.length === 0) {
    gameBox.style.display = "none";
    gameWon.style.display = "flex";
    ++score;
  }
}

window.clickedLetter = clickedLetter;

function restart() {
  const disabledButtons = document.querySelectorAll("button.disabled");
  image.style.height = "0vh";
  gameBox.style.display = "flex";
  gameOver.style.display = "none";
  gameWon.style.display = "none";
  correctWordP.textContent = "";
  disabledButtons.forEach((button) => button.classList.remove("disabled"));
  while (blanksDiv.lastChild) {
    blanksDiv.removeChild(blanksDiv.lastChild);
  }
  flushSound.pause();
  flushSound.currentTime = 1.1;
  setupNewGame();
}

window.restart = restart;

setupNewGame();

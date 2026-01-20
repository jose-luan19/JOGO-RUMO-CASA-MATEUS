"use strict";

var confetti = [];
var CONFETTI_COUNT = 120;
var feedbackTimer;
var transitionLock = false; // ===== LEVELS =====

var levels = [{
  title: "Nível 1 – O encontro dos amigos (As Figurinhas).",
  image: "assets/images/fase1.png",
  possibleAnswer: [4, 8, 12, 15],
  answer: 12
}, {
  title: "Nível 2 – O caminho até o parque",
  image: "assets/images/fase2.png",
  possibleAnswer: [4, 8, 12, 15],
  answer: 8
}, {
  title: "Nível 3 – Os bancos do parque",
  image: "assets/images/fase3.png",
  possibleAnswer: [4, 8, 12, 15],
  answer: 12
}, {
  title: "Nível 4 – As telhas das casas",
  image: "assets/images/fase4.png",
  possibleAnswer: [4, 8, 12, 15],
  answer: 15
}, {
  title: "Nível 5 – A festa do Mateus 🎉",
  image: "assets/images/fase5.png",
  possibleAnswer: [4, 8, 12, 15],
  answer: 12
}]; // ===== ESTADO GERAL =====

var level = 0;
var keys = {};
updateBackButton();

var setTitle = function setTitle() {
  document.getElementById("levelTitle").innerText = levels[level].title;
};

var setImageLevel = function setImageLevel() {
  document.getElementById("imgLevel").src = levels[level].image;
};

setTitle();
setImageLevel();

function checkAnswer(btnSelected) {
  if (transitionLock) return;
  var valueSelected = btnSelected.value;

  if (valueSelected == levels[level].answer) {
    transitionLock = true;
    btnSelected.classList.add("correctAnswer");
    showFeedback("✅ Resposta certa!", function () {
      level++;
      btnSelected.classList.remove("correctAnswer");
      updateBackButton();

      for (var key in keys) {
        keys[key] = false;
      }

      if (level >= levels.length) {
        finishGame();
        return;
      }

      setTitle();
      setImageLevel();
      transitionLock = false;
    });
  } else {
    btnSelected.classList.add("wrongAnswer");
    showFeedback("❌ Tente de novo", function () {
      btnSelected.classList.remove("wrongAnswer");
    });
  }
}

function showFeedback(msg, callback) {
  var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;
  var feedback = document.getElementById("feedback"); // feedback.classList.remove("hidden");

  clearTimeout(feedbackTimer);
  feedback.innerText = msg;
  feedbackTimer = setTimeout(function () {
    feedback.innerText = ""; // feedback.classList.add("hidden");

    if (callback) callback();
  }, timer);
}

function finishGame() {
  // createConfetti();
  // drawConfetti();
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("endGame").classList.remove("hidden");
}

function goBackLevel() {
  if (level > 0) {
    level--;
    setTitle();
    setImageLevel();
  }

  document.getElementById("feedback").innerText = "";

  for (var key in keys) {
    keys[key] = false;
  }

  updateBackButton();
}

function updateBackButton() {
  var btn = document.getElementById("restartBtn");

  if (level === 0) {
    btn.disabled = true;
    btn.title = "Já está no início";
  } else if (level >= levels.length) {
    btn.disabled = true;
    btn.title = "Jogo finalizado";
  } else {
    btn.disabled = false;
    btn.title = "Voltar para o nível anterior";
  }
}

function restartGame() {
  document.getElementById("endGame").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  level = 0;
  setTitle();
  updateBackButton();
} // function createConfetti() {
//   confetti.length = 0;
//   for (let i = 0; i < CONFETTI_COUNT; i++) {
//     confetti.push({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 4 + 2,
//       dy: Math.random() * 2 + 1,
//       color: `hsl(${Math.random() * 360}, 100%, 50%)`
//     });
//   }
// }
// function drawConfetti() {
//   confetti.forEach(c => {
//     ctx.beginPath();
//     ctx.fillStyle = c.color;
//     ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
//     ctx.fill();
//     c.y += c.dy;
//     if (c.y > canvas.height) {
//       c.y = -10;
//       c.x = Math.random() * canvas.width;
//     }
//   });
// }


function renderAnswersImage() {
  var box = document.getElementById("answerButtons");
  box.innerHTML = "";
  levels[level].possibleAnswer.forEach(function (value) {
    var btn = document.createElement("button");
    btn.innerText = value;
    btn.value = value;
    btn.classList.add("answerBtn");

    btn.onclick = function () {
      return checkAnswer(btn);
    };

    box.appendChild(btn);
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (s) {
    return s.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function startGame() {
  showScreen("gameScreen");
  renderAnswersImage();
}
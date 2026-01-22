"use strict";

var confettiPieces = [];
var feedbackTimer;
var transitionLock = false;
var level = 0;
var confettiAnimationId = null;
var imageCache = [];
var colors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"];

var setTitle = function setTitle() {
  document.getElementById("levelTitle").innerText = levels[level].title;
};

var setImageLevel = function setImageLevel() {
  document.getElementById("imgLevel").src = levels[level].image;
  preloadNextLevel(level);
};

function preloadNextLevel(index) {
  var nextIndex = index + 1;
  if (nextIndex >= levels.length) return;
  if (imageCache[nextIndex]) return;
  var img = new Image();
  img.src = levels[nextIndex].image;
  imageCache[nextIndex] = img;
} // ===== Confetti =====


var canvas = document.getElementById("confetti");
var ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createConfettiPiece() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360
  };
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(function (p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
    p.y += p.speed;
    p.rotation += p.speed;

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  });
  confettiAnimationId = requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  confettiPieces = Array.from({
    length: 150
  }, createConfettiPiece);
  animateConfetti();
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
} // ===== LEVELS =====


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
}];
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
  var feedback = document.getElementById("feedback");
  feedback.classList.remove("hidden");
  clearTimeout(feedbackTimer);
  feedback.innerText = msg;
  feedbackTimer = setTimeout(function () {
    if (!feedback.classList.contains("hidden")) {
      feedback.classList.add("hidden");
    }

    if (callback) callback();
  }, timer);
}

function finishGame() {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("endGame").classList.remove("hidden");
  startConfetti();
}

function goBackLevel() {
  if (level > 0) {
    level--;
    setTitle();
    setImageLevel();
  }

  document.getElementById("feedback").classList.add("hidden");
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
  stopConfetti();
  document.getElementById("endGame").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  level = 0;
  transitionLock = false;
  setTitle();
  setImageLevel();
  updateBackButton();
}

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
  updateBackButton();
  setTitle();
  setImageLevel();
  renderAnswersImage();
  showScreen("gameScreen");
}
"use strict";

var questionActive = false;
var gameFinished = false;
var canvas = document.getElementById("game");
canvas.focus();
var ctx = canvas.getContext("2d");
var confetti = [];
var CONFETTI_COUNT = 120; // ===== PERGUNTAS =====

var levels = [{
  title: "Nível 1 – O encontro dos amigos (As Figurinhas).",
  label: "Adição de Parcelas Iguais",
  dica: "Adição de Parcelas Iguais",
  question: "Somos 4 amigos com 3 figurinhas cada. \nQuantas figurinhas teremos juntos?",
  answer: 12
}, {
  title: "Nível 2 – O caminho até o parque",
  label: "Nível 2 – O caminho até o parque",
  dica: "Adição de Parcelas Iguais",
  question: "Há 2 postes em cada quarteirão e eles passaram por 4 quarteirões. \nQuantos postes?",
  answer: 8
}, {
  title: "Nível 3 – Os bancos do parque",
  label: "Nível 3 – Os bancos do parque",
  dica: "Adição de Parcelas Iguais",
  question: "São 3 espaços com 4 bancos em cada um. \nQuantos bancos ao todo?",
  answer: 12
}, {
  title: "Nível 4 – As telhas das casas",
  label: "Nível 4 – As telhas das casas",
  dica: "Adição de Parcelas Iguais",
  question: "Um muro tem 3 linhas com 5 telhas em cada linha. \nQuantas telhas há no total?",
  answer: 15
}, {
  title: "Nível 5 – A festa do Mateus 🎉",
  label: "Nível 5 – A festa do Mateus 🎉",
  dica: "Adição de Parcelas Iguais",
  question: "Há 4 mesas com 3 copinhos em cada uma. Quantos copinhos há ao todo?",
  answer: 12
}]; // ===== ESTADO GERAL =====

var level = 0;
var canMove = true;
var keys = {};
updateBackButton();

var setTitle = function setTitle() {
  document.getElementById("levelTitle").innerText = levels[level].title;
};

setTitle(); // ===== PLAYER =====

var player = {
  x: 20,
  y: 180,
  size: 25,
  speed: 3
}; // ===== NPC =====

var npc = {
  x: 600,
  y: 180,
  size: 25
};
answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && questionActive) {
    e.preventDefault();
    checkAnswer();
  }
});
var leftBtn = document.getElementById("leftBtn");
var rightBtn = document.getElementById("rightBtn");
document.getElementById("mobileControls").style.display = "block";
window.addEventListener("keydown", function (e) {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // mata scroll

    keys[e.key] = true;
  }
});
window.addEventListener("keyup", function (e) {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    keys[e.key] = false;
  }
});

function bindButton(btn, key) {
  // Desktop (mouse)
  btn.addEventListener("mousedown", function () {
    return keys[key] = true;
  });
  btn.addEventListener("mouseup", function () {
    return keys[key] = false;
  });
  btn.addEventListener("mouseleave", function () {
    return keys[key] = false;
  }); // Mobile (toque)

  btn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    keys[key] = true;
  });
  btn.addEventListener("touchend", function () {
    return keys[key] = false;
  });
}

bindButton(leftBtn, "ArrowLeft");
bindButton(rightBtn, "ArrowRight");

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameFinished) {
    drawConfetti();
    requestAnimationFrame(update);
    return;
  }

  if (!questionActive) {
    movePlayer();
  }

  drawGround();
  drawPlayer();
  drawNpc();

  if (isNearNpc() && !questionActive) {
    questionActive = true;
    canMove = false;
    showQuestionUI();
  }

  requestAnimationFrame(update);
}

function checkAnswer() {
  var input = document.getElementById("answerInput");
  var userAnswer = input.value;

  if (userAnswer == levels[level].answer) {
    level++;
    updateBackButton();
    questionActive = false;
    canMove = true;
    player.x = 20;
    input.value = "";
    document.getElementById("questionBox").classList.add("hidden"); // limpa todas as teclas pressionadas

    for (var key in keys) {
      keys[key] = false;
    }

    document.getElementById("feedback").innerText = "";

    if (level >= levels.length) {
      finishGame();
      return;
    }

    setTitle();
    canvas.focus(); // devolve controle ao jogo
  } else {
    document.getElementById("feedback").innerText = "❌ Tente de novo";
  }
}

function movePlayer() {
  if (!canMove) return;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed; // trava nos limites do canvas

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  console.log(keys, canMove);
}

function isNearNpc() {
  var distance = Math.abs(player.x - npc.x);
  return distance < 40; // raio de interação
} // ===== DESENHO =====


function drawGround() {
  // Terra
  ctx.fillStyle = "#c2a15f";
  ctx.fillRect(0, 210, canvas.width, 40); // Grama

  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, 200, canvas.width, 10); // Linha de separação (textura fake)

  ctx.strokeStyle = "#3e8e41";
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(canvas.width, 200);
  ctx.stroke();
}

update();

function drawPlayer() {
  ctx.fillStyle = "#1e90ff"; // azul

  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawNpc() {
  ctx.fillStyle = "#ff6347"; // vermelho

  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
}

function showQuestionUI() {
  var levelData = levels[level];
  document.getElementById("question").innerText = levelData.question;
  document.getElementById("questionBox").classList.remove("hidden");
  answerInput.focus();
}

function closeQuestion() {
  questionActive = false;
  canMove = true;
  player.x = 20;
  answerInput.value = "";
  document.getElementById("questionBox").classList.add("hidden");

  for (var key in keys) {
    keys[key] = false;
  }

  canvas.focus();
}

function finishGame() {
  gameFinished = true;
  canMove = false;
  questionActive = false;
  createConfetti();
  document.getElementById("endGame").classList.remove("hidden");
}

function goBackLevel() {
  if (level > 0) {
    level--;
    setTitle();
  } // reseta estado do nível atual


  questionActive = false;
  canMove = true;
  player.x = 20;
  answerInput.value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("questionBox").classList.add("hidden"); // limpa teclas pressionadas

  for (var key in keys) {
    keys[key] = false;
  }

  updateBackButton();
  canvas.focus();
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
  level = 0;
  gameFinished = false;
  canMove = true;
  questionActive = false;
  player.x = 20;
  document.getElementById("endGame").classList.add("hidden");
  updateBackButton();
  canvas.focus();
}

function createConfetti() {
  confetti.length = 0;

  for (var i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 2,
      dy: Math.random() * 2 + 1,
      color: "hsl(".concat(Math.random() * 360, ", 100%, 50%)")
    });
  }
}

function drawConfetti() {
  confetti.forEach(function (c) {
    ctx.beginPath();
    ctx.fillStyle = c.color;
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
    c.y += c.dy;

    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
  });
}
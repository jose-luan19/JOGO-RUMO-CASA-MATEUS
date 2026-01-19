let questionActive = false;
let gameFinished = false;
const canvas = document.getElementById("game");
canvas.focus();
const ctx = canvas.getContext("2d");
const confetti = [];
const CONFETTI_COUNT = 120;
let feedbackTimer;
let transitionLock = false;


// ===== PERGUNTAS =====
const levels = [
  {
    title: "Nível 1 – O encontro dos amigos (As Figurinhas).",
    label: "Adição de Parcelas Iguais",
    dica: "Adição de Parcelas Iguais",
    question: "Somos 4 amigos com 3 figurinhas cada. \nQuantas figurinhas teremos juntos?",
    possibleAnswer: [4, 8, 12, 15],
    answer: 12
  },
  {
    title: "Nível 2 – O caminho até o parque",
    label: "Nível 2 – O caminho até o parque",
    dica: "Adição de Parcelas Iguais",
    question: "Há 2 postes em cada quarteirão e eles passaram por 4 quarteirões. \nQuantos postes?",
    possibleAnswer: [4, 8, 12, 15],
    answer: 8
  },
  {
    title: "Nível 3 – Os bancos do parque",
    label: "Nível 3 – Os bancos do parque",
    dica: "Adição de Parcelas Iguais",
    question: "São 3 espaços com 4 bancos em cada um. \nQuantos bancos ao todo?",
    possibleAnswer: [4, 8, 12, 15],
    answer: 12
  },
  {
    title: "Nível 4 – As telhas das casas",
    label: "Nível 4 – As telhas das casas",
    dica: "Adição de Parcelas Iguais",
    question: "Um muro tem 3 linhas com 5 telhas em cada linha. \nQuantas telhas há no total?",
    possibleAnswer: [4, 8, 12, 15],
    answer: 15
  },
  {
    title: "Nível 5 – A festa do Mateus 🎉",
    label: "Nível 5 – A festa do Mateus 🎉",
    dica: "Adição de Parcelas Iguais",
    question: "Há 4 mesas com 3 copinhos em cada uma. Quantos copinhos há ao todo?",
    possibleAnswer: [4, 8, 12, 15],
    answer: 12
  }
];

// ===== ESTADO GERAL =====
let level = 0;
let canMove = true;
const keys = {};
updateBackButton();
const setTitle = () => {
  document.getElementById("levelTitle").innerText = levels[level].title;
};
setTitle();

// ===== PLAYER =====
const player = {
  x: 20,
  y: 150,
  size: 80,
  image: "assets/images/cirancas.png",
  speed: 3
};


// ===== NPC =====
const npc = {
  x: 800,
  y: 125,
  size: 100,
  image: "assets/images/Questao.png"
};

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

document.getElementById("mobileControls").style.display = "block";

window.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // mata scroll
    keys[e.key] = true;
  }
});

window.addEventListener("keyup", e => {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    keys[e.key] = false;
  }
});

function bindButton(btn, key) {
  // Desktop (mouse)
  btn.addEventListener("mousedown", () => keys[key] = true);
  btn.addEventListener("mouseup", () => keys[key] = false);
  btn.addEventListener("mouseleave", () => keys[key] = false);

  // Mobile (toque)
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    keys[key] = true;
  });

  btn.addEventListener("touchend", () => keys[key] = false);
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

function checkAnswer(selected) {
  if (transitionLock) return;

  if (selected === levels[level].answer) {
    transitionLock = true;

    showFeedback("✅ Resposta certa!", 2000, () => {
      level++;
      updateBackButton();

      questionActive = false;
      canMove = true;
      player.x = 20;

      document.getElementById("questionBox").classList.add("hidden");

      for (let key in keys) keys[key] = false;

      if (level >= levels.length) {
        finishGame();
        return;
      }

      setTitle();
      transitionLock = false;
      canvas.focus();
    });

  } else {
    showFeedback("❌ Tente de novo");
  }
}

function showFeedback(msg, timer = 3000, callback) {
  const feedback = document.getElementById("feedback");

  clearTimeout(feedbackTimer);
  feedback.innerText = msg;

  feedbackTimer = setTimeout(() => {
    feedback.innerText = "";
    if (callback) callback();
  }, timer);
}

function movePlayer() {
  if (!canMove) return;

  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;

  // trava nos limites do canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
}

function isNearNpc() {
  const distance = Math.abs(player.x - npc.x);
  return distance < 130; // raio de interação
}

// ===== DESENHO =====
function drawGround() {
  // Terra
  ctx.fillStyle = "#c2a15f";
  ctx.fillRect(0, 230, canvas.width, 40);

  // Grama
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, 220, canvas.width, 10);

  // Linha de separação (textura fake)
  ctx.strokeStyle = "#3e8e41";
  ctx.beginPath();
  ctx.moveTo(0, 220);
  ctx.lineTo(canvas.width, 220);
  ctx.stroke();
}
update();

function drawPlayer() {
  const playerImg = new Image();
  playerImg.src = player.image;
  ctx.drawImage(playerImg, player.x, player.y, player.size + 80, player.size);
}

function drawNpc() {
  const npcImg = new Image();
  npcImg.src = npc.image;
  ctx.drawImage(npcImg, npc.x, npc.y, npc.size, npc.size);
}


function showQuestionUI() {
  document.getElementById("question").innerText = levels[level].question;
  document.getElementById("questionBox").classList.remove("hidden");
  renderAnswers();
}

function closeQuestion() {
  questionActive = false;
  canMove = true;
  player.x = 20;

  document.getElementById("questionBox").classList.add("hidden");

  for (let key in keys) keys[key] = false;

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
  }

  // reseta estado do nível atual
  questionActive = false;
  canMove = true;

  player.x = 20;
  document.getElementById("feedback").innerText = "";
  document.getElementById("questionBox").classList.add("hidden");

  // limpa teclas pressionadas
  for (let key in keys) keys[key] = false;
  updateBackButton();
  canvas.focus();
}

function updateBackButton() {
  const btn = document.getElementById("restartBtn");

  if (level === 0) {
    btn.disabled = true;
    btn.title = "Já está no início";
  }
  else if (level >= levels.length) {
    btn.disabled = true;
    btn.title = "Jogo finalizado";
  }
  else {
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

  showScreen("menuScreen");
  updateBackButton();
  canvas.focus();
}

function createConfetti() {
  confetti.length = 0;

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 2,
      dy: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
}

function drawConfetti() {
  confetti.forEach(c => {
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

function renderAnswers() {
  const box = document.getElementById("answerBox");
  box.innerHTML = "";

  levels[level].possibleAnswer.forEach(value => {
    const btn = document.createElement("button");
    btn.innerText = value;
    btn.classList.add("answerBtn");

    btn.onclick = () => checkAnswer(value);

    box.appendChild(btn);
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goToMap() {
  showScreen("mapScreen");
}

function startGame() {
  showScreen("gameWrapper");
  canvas.focus();
}


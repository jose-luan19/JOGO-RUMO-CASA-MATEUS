let questionActive = false;
let gameFinished = false;
const canvas = document.getElementById("game");
canvas.focus();
const ctx = canvas.getContext("2d");



// ===== ESTADO GERAL =====
let level = 0;
let canMove = true;
const keys = {};


// ===== PERGUNTAS =====
const levels = [
      { question: "4 amigos com 3 figurinhas cada. Quantas figurinhas?", answer: 12 },
      { question: "2 postes em cada quarteirão, passaram por 4. Total?", answer: 8 },
      { question: "3 espaços com 4 bancos cada. Quantos bancos?", answer: 12 }
];


// ===== PLAYER =====
const player = {
      x: 20,
      y: 180,
      size: 25,
      speed: 3
};


// ===== NPC =====
const npc = {
      x: 600,
      y: 180,
      size: 25
};


answerInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && questionActive) {
            e.preventDefault();
            checkAnswer();
      }
});

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
            drawGameOver();
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

      if (questionActive) {
            drawQuestionBubble();
      }

      requestAnimationFrame(update);
}

function checkAnswer() {
      const input = document.getElementById("answerInput");
      const userAnswer = input.value;

      if (userAnswer == levels[level].answer) {
            level++;
            questionActive = false;
            canMove = true;
            player.x = 20;

            input.value = "";
            document.getElementById("questionBox").classList.add("hidden");

            // limpa todas as teclas pressionadas
            for (let key in keys) {
                  keys[key] = false;
            }
            document.getElementById("feedback").innerText = "";
            if (level >= levels.length) {
                  finishGame();
                  return;
            }
            canvas.focus(); // devolve controle ao jogo
      } else {
            document.getElementById("feedback").innerText = "❌ Tenta de novo";
      }
}


function movePlayer() {
      if (!canMove) return;

      if (keys["ArrowRight"]) player.x += player.speed;
      if (keys["ArrowLeft"]) player.x -= player.speed;

      // trava nos limites do canvas
      player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
      console.log(keys, canMove);
}

function isNearNpc() {
      const distance = Math.abs(player.x - npc.x);
      return distance < 40; // raio de interação
}

function drawQuestionBubble() {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;

      // balão
      ctx.fillRect(150, 40, 400, 90);
      ctx.strokeRect(150, 40, 400, 90);

      // texto
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.fillText(levels[level].question, 170, 85);
}

// ===== DESENHO =====
function drawGround() {
      // Terra
      ctx.fillStyle = "#c2a15f";
      ctx.fillRect(0, 210, canvas.width, 40);

      // Grama
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, 200, canvas.width, 10);

      // Linha de separação (textura fake)
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

function drawGameOver() {
      ctx.fillStyle = "#000";
      ctx.font = "28px Arial";
      ctx.fillText("🎉 Parabéns!", 250, 100);

      ctx.font = "18px Arial";
      ctx.fillText("Você chegou à casa do Mateus!", 210, 140);
}

function showQuestionUI() {
      document.getElementById("questionBox").classList.remove("hidden");
      answerInput.focus();
}

function closeQuestion() {
      questionActive = false;
      canMove = true;
      player.x = 20;

      answerInput.value = "";
      document.getElementById("questionBox").classList.add("hidden");

      for (let key in keys) keys[key] = false;

      canvas.focus();
}

function finishGame() {
      gameFinished = true;
      questionActive = false;
      canMove = false;

      document.getElementById("questionBox").classList.add("hidden");
}

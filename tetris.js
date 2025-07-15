// Obtenção de elementos do HTML
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const toggleSoundBtn = document.getElementById("toggle-sound");
const pauseBtn = document.getElementById("pauseBtn");
const nameInput = document.getElementById("player-name");
const saveBtn = document.getElementById("save-score-btn");
const rankingList = document.getElementById("ranking-list");
const modal = document.getElementById("modal");
const finalScore = document.getElementById("final-score");

// Elementos de áudio
const musicaFundo = document.getElementById("musica-fundo");
const sons = {
  rodar: document.getElementById("som-rodar"),
  colidir: document.getElementById("som-colidir"),
  pontos: document.getElementById("som-pontos"),
  perdeu: document.getElementById("som-perdeu")
};

// Configuração inicial do jogo
let somAtivo = true, paused = false, gameOver = false;
let board, currentPiece, nextPiece, pos, score, level, linesCleared;
let dropInterval = 1000, dropCounter = 0, lastTime = 0, startTime = null;
let animationId = null;

const COLS = 10, ROWS = 20, BLOCK = 32;
canvas.width = COLS * BLOCK;
canvas.height = ROWS * BLOCK;
nextCanvas.width = BLOCK * 4;
nextCanvas.height = BLOCK * 4;

// Cores e formas das peças
const COLORS = [null, "#FF3CAC", "#784BA0", "#29FFC6", "#F8FF00", "#00F0FF", "#FFB65C", "#FF4E50"];
const SHAPES = [
  [], [[1,1,1,1]], [[2,2],[2,2]], [[0,3,0],[3,3,3]],
  [[4,4,0],[0,4,4]], [[0,5,5],[5,5,0]], [[6,0,0],[6,6,6]], [[0,0,7],[7,7,7]]
];

// Função para tocar som (se ativo)
const tocarSom = s => somAtivo && s && s.play();

// Funções de criação e desenho
const matriz = (w, h) => Array.from({length: h}, () => Array(w).fill(0));
const desenhar = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(253,246,227,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  desenharMatriz(board, {x:0, y:0});
  currentPiece && desenharMatriz(currentPiece, pos);
  ctx.strokeStyle = "#888"; ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
};
const desenharProxima = () => {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const offX = Math.floor((4 - nextPiece[0].length) / 2);
  const offY = Math.floor((4 - nextPiece.length) / 2);
  desenharMatriz(nextPiece, {x:offX, y:offY}, nextCtx);
};
function desenharMatriz(matrix, offset, ctxRef = ctx) {
  matrix.forEach((row, y) =>
    row.forEach((val, x) => {
      if (!val) return;
      const gx = x + offset.x, gy = y + offset.y;
      const grad = ctxRef.createLinearGradient(gx*BLOCK, gy*BLOCK, (gx+1)*BLOCK, (gy+1)*BLOCK);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, COLORS[val]);
      ctxRef.fillStyle = grad;
      ctxRef.strokeStyle = "#222";
      ctxRef.lineWidth = 2;
      ctxRef.shadowColor = "rgba(0,0,0,0.4)";
      ctxRef.shadowBlur = 6;
      ctxRef.fillRect(gx*BLOCK, gy*BLOCK, BLOCK, BLOCK);
      ctxRef.strokeRect(gx*BLOCK, gy*BLOCK, BLOCK, BLOCK);
      ctxRef.shadowColor = "transparent"; ctxRef.shadowBlur = 0;
    }));
}

// Lógica de jogo
const colide = (b, p, o) => p.some((r, y) => r.some((v, x) => v && b[y+o.y]?.[x+o.x]));
const fundir = (b, p, o) => {
  p.forEach((r, y) => r.forEach((v, x) => v && (b[y+o.y][x+o.x] = v)));
  tocarSom(sons.colidir);
};
const rodar = (m, dir) => dir > 0 ? m[0].map((_, i) => m.map(r => r[i])).reverse() : m[0].map((_, i) => m.map(r => r[i])).map(r => r.reverse());

const gerarPeça = () => SHAPES[Math.floor(Math.random() * (SHAPES.length - 1)) + 1].map(r => [...r]);
const novaPeça = () => {
  currentPiece = nextPiece;
  nextPiece = gerarPeça();
  pos = {x: Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2), y:0};
  if (colide(board, currentPiece, pos)) {
    gameOver = true;
    tocarSom(sons.perdeu);
    mostrarModal();
  }
};

const limparLinhas = () => {
  let linhas = 0;
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every(v => v)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      linhas++; y++;
    }
  }
  if (linhas) {
    linesCleared += linhas;
    score += linhas * 100 * level;
    if (linesCleared >= level * 10) {
      level++; dropInterval = Math.max(100, dropInterval * 0.8);
    }
    tocarSom(sons.pontos);
    atualizarPontuacao();
  }
};

const atualizarPontuacao = () => {
  scoreEl.textContent = score;
  levelEl.textContent = level;
};

function atualizar(t = 0) {
  if (gameOver || paused) return;
  if (!startTime) startTime = t;
  const dt = t - lastTime;
  dropCounter += dt;
  lastTime = t;
  if (dropCounter > dropInterval) { pos.y++; if (colide(board, currentPiece, pos)) { pos.y--; fundir(board, currentPiece, pos); limparLinhas(); novaPeça(); } dropCounter = 0; }
  const tempo = Math.floor((t - startTime) / 1000);
  timeEl.textContent = `${String(Math.floor(tempo/60)).padStart(2,"0")}:${String(tempo%60).padStart(2,"0")}`;
  desenhar(); desenharProxima();
  animationId = requestAnimationFrame(atualizar);
}

function iniciarJogo() {
  board = matriz(COLS, ROWS);
  score = level = linesCleared = 0;
  dropInterval = 1000;
  gameOver = paused = false;
  nextPiece = gerarPeça();
  novaPeça(); atualizarPontuacao();
  startTime = lastTime = dropCounter = 0;
  if (somAtivo) musicaFundo.play();
  animationId = requestAnimationFrame(atualizar);
}
const reiniciar = () => { cancelAnimationFrame(animationId); musicaFundo.currentTime = 0; iniciarJogo(); };
const alternarPausa = () => {
  paused = !paused;
  if (paused) {
    cancelAnimationFrame(animationId);
    musicaFundo.pause();
  } else {
    lastTime = performance.now();
    if (somAtivo) musicaFundo.play();
    animationId = requestAnimationFrame(atualizar);
  }
  pauseBtn.textContent = paused ? "▶ Retomar" : "⏸ Pausar";
};

// Controlo de peças
const mover = dir => { pos.x += dir; if (colide(board, currentPiece, pos)) pos.x -= dir; };
const rodarPeca = dir => {
  const original = currentPiece;
  currentPiece = rodar(currentPiece, dir);
  if (colide(board, currentPiece, pos)) {
    currentPiece = original; // desfaz rotação se colidir
  } else {
    tocarSom(sons.rodar);
  }
};

// Controlo por teclado
window.addEventListener("keydown", e => {
  if (gameOver) return;
  if (["p", "P"].includes(e.key)) return alternarPausa();

  switch (e.key) {
    case "ArrowLeft": mover(-1); break;
    case "ArrowRight": mover(1); break;
    case "ArrowDown": pos.y++; if (colide(board, currentPiece, pos)) pos.y--; break;
    case "ArrowUp": rodarPeca(1); break;
  }
});

// Guardar pontuação no ranking
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Por favor, insere o teu nome.");
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores.splice(10);
  localStorage.setItem("scores", JSON.stringify(scores));
  atualizarRanking();
  modal.classList.remove("show");
});

// Mostrar o Modal  de fim de jogo
const mostrarModal = () => {
  finalScore.textContent = `Pontuação: ${score}`;
  modal.classList.add("show");
};

// Atualizar lista de ranking
const atualizarRanking = () => {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  const medalhas = ["🥇", "🥈", "🥉"];
  rankingList.innerHTML = scores
    .map((entry, i) => `<li>${medalhas[i] || (i + 1)}. ${entry.name} - ${entry.score}</li>`)
    .join("");
};
atualizarRanking(); // carregar ao iniciar

// Botões principais
startBtn.addEventListener("click", iniciarJogo);
resetBtn.addEventListener("click", reiniciar);
pauseBtn.addEventListener("click", alternarPausa);

// Alternar o som
toggleSoundBtn.addEventListener("click", () => {
  somAtivo = !somAtivo;
  toggleSoundBtn.textContent = somAtivo ? "🔊 Som" : "🔇 Silenciar";
  somAtivo ? musicaFundo.play() : musicaFundo.pause();
});

// Controlo tátil por botões visuais
document.getElementById("leftBtn").addEventListener("click", () => mover(-1));
document.getElementById("rightBtn").addEventListener("click", () => mover(1));
document.getElementById("downBtn").addEventListener("click", () => { pos.y++; if (colide(board, currentPiece, pos)) pos.y--; });
document.getElementById("rotateBtn").addEventListener("click", () => rodarPeca(1));

// Redimensionar canvas conforme dispositivo
const redimensionarCanvas = () => {
  const largura = canvas.parentElement.clientWidth;
  canvas.width = largura;
  canvas.height = largura * (ROWS / COLS);
  nextCanvas.width = largura / 3;
  nextCanvas.height = largura / 3;
};
window.addEventListener("resize", redimensionarCanvas);
window.addEventListener("load", redimensionarCanvas);

// Gestos de toque (deslizar e toque rápido)
let startX = 0, startY = 0;
canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
});
canvas.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  const absX = Math.abs(dx), absY = Math.abs(dy);

  if (Math.max(absX, absY) < 20) return rodarPeca(1); // toque curto = rotação

  if (absX > absY) dx > 0 ? mover(1) : mover(-1);
  else if (dy > 0) { pos.y++; if (colide(board, currentPiece, pos)) pos.y--; } // deslizar para baixo
});
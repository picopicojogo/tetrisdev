// canvas.js — desenho do tabuleiro principal e da próxima peça
import { COLUNAS, LINHAS, CORES } from "./motor.js";

/**
 * Inicializa os canvas e devolve os contextos e elementos configurados
 * @returns {{
 *   ctxBoard: CanvasRenderingContext2D,
 *   ctxNext: CanvasRenderingContext2D,
 *   board: HTMLCanvasElement,
 *   next: HTMLCanvasElement
 * }}
 */
export function configurarCanvas() {
  const board = document.getElementById('board');
  const next = document.getElementById('next');

  // Dimensão otimizada para ecrã 1920x1080
  const bloco = 36; // pixels por bloco
  board.width = COLUNAS * bloco;
  board.height = LINHAS * bloco;

  next.width = 100;
  next.height = 100;

  const ctxBoard = board.getContext('2d');
  const ctxNext = next.getContext('2d');

  return { ctxBoard, ctxNext, board, next };
}

/**
 * Desenha o estado atual do tabuleiro e da peça em movimento
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} largura
 * @param {number} altura
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);
  const larguraBloco = largura / COLUNAS;
  const alturaBloco = altura / LINHAS;

  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      const valor = tabuleiro[y][x];
      if (valor) desenharBloco(ctx, x, y, larguraBloco, alturaBloco, valor);
    }
  }

  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (valor) {
        const px = posicao.x + x;
        const py = posicao.y + y;
        if (py >= 0 && py < LINHAS) {
          desenharBloco(ctx, px, py, larguraBloco, alturaBloco, valor);
        }
      }
    }
  }
}

/**
 * Desenha a próxima peça no canvas lateral
 * @param {CanvasRenderingContext2D} ctx
 * @param {number[][]} proxima
 */
export function desenharProxima(ctx, proxima) {
  const largura = ctx.canvas.width;
  const altura = ctx.canvas.height;
  ctx.clearRect(0, 0, largura, altura);

  const larguraBloco = largura / 4;
  const alturaBloco = altura / 4;
  const offsetX = (largura - proxima[0].length * larguraBloco) / 2;
  const offsetY = (altura - proxima.length * alturaBloco) / 2;

  for (let y = 0; y < proxima.length; y++) {
    for (let x = 0; x < proxima[y].length; x++) {
      const valor = proxima[y][x];
      if (valor) {
        const posX = offsetX + x * larguraBloco;
        const posY = offsetY + y * alturaBloco;
        desenharBlocoAbsoluto(ctx, posX, posY, larguraBloco, alturaBloco, valor);
      }
    }
  }
}

/**
 * Desenha um bloco na grelha principal
 */
function desenharBloco(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
  ctx.strokeStyle = "#333333";
  ctx.strokeRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
}

/**
 * Desenha um bloco absoluto (para a pré-visualização)
 */
function desenharBlocoAbsoluto(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(x, y, largura, altura);
  ctx.strokeStyle = "#333333";
  ctx.strokeRect(x, y, largura, altura);
}

/**
 * Retorna a cor associada ao tipo de peça
 * @param {number} valor
 * @returns {string}
 */
function obterCor(valor) {
  return CORES[valor] || "#FFFFFF";
}

/**
 * Atualiza a pontuação e o nível
 * @param {number} pontuacao
 * @param {number} nivel
 */
export function atualizarPontuacao(pontuacao, nivel) {
  document.getElementById("score").textContent = pontuacao;
  document.getElementById("level").textContent = nivel;
}

/**
 * Atualiza o tempo decorrido no formato MM:SS
 * @param {HTMLElement} elTempo
 * @param {number} segundos
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Apresenta o modal com pontuação final
 * @param {number} pontuacao
 */
export function mostrarModalFim(pontuacao) {
  const elPontuacao = document.getElementById("final-score");
  if (elPontuacao) elPontuacao.textContent = `Pontuação: ${pontuacao}`;
  document.getElementById("modal").classList.add("show");
}

/**
 * Atualiza a lista de ranking
 * @param {Array<{name: string, score: number}>} lista
 */
export function atualizarRanking(lista) {
  const medalhas = ["🥇", "🥈", "🥉"];
  const ul = document.getElementById("ranking-list");
  if (!ul) return;

  ul.innerHTML = lista.map((item, i) =>
    `<li>${medalhas[i] || `${i + 1}.`} ${item.name} - ${item.score}</li>`
  ).join("");
}

/**
 * Carrega ranking guardado no localStorage
 */
export function carregarRankingGuardado() {
  const guardados = JSON.parse(localStorage.getItem("scores") || "[]");
  atualizarRanking(guardados);
}

/**
 * Guarda pontuação atual e atualiza ranking
 * @param {number} pontuacao
 */
export function guardarPontuacao(pontuacao) {
  const nome = document.getElementById("player-name").value.trim();
  if (!nome) {
    alert("Por favor, insere o teu nome.");
    return;
  }

  const lista = JSON.parse(localStorage.getItem("scores") || "[]");
  lista.push({ name: nome, score: pontuacao });
  lista.sort((a, b) => b.score - a.score);
  lista.splice(10);
  localStorage.setItem("scores", JSON.stringify(lista));
  atualizarRanking(lista);
  document.getElementById("modal").classList.remove("show");
}

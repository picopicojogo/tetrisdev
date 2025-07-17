// canvas.js — desenho do tabuleiro principal e da próxima peça
import { COLUNAS, LINHAS, CORES } from "./motor.js";

/**
 * Inicializa os canvas e devolve os contextos e elementos configurados
 */
export function configurarCanvas() {
  const board = document.getElementById('board');
  const next = document.getElementById('next');

  const bloco = 32; // tamanho em px de cada célula (ajustado para 1920×1080)

  board.width = COLUNAS * bloco;
  board.height = LINHAS * bloco;

  next.width = 100;
  next.height = 100;

  const ctxBoard = board.getContext('2d');
  const ctxNext = next.getContext('2d');

  return { ctxBoard, ctxNext, board, next };
}

/**
 * Desenha o tabuleiro e a peça atual no canvas principal
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);

  const larguraBloco = largura / COLUNAS;
  const alturaBloco = altura / LINHAS;

  // Tabuleiro
  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      const valor = tabuleiro[y][x];
      if (valor) desenharBloco(ctx, x, y, larguraBloco, alturaBloco, valor);
    }
  }

  // Peça ativa
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
 * Desenha a pré-visualização da próxima peça
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
 * Desenha um bloco no tabuleiro principal
 */
function desenharBloco(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
}

/**
 * Desenha um bloco absoluto para o canvas da próxima peça
 */
function desenharBlocoAbsoluto(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(x, y, largura, altura);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, largura, altura);
}

/**
 * Retorna a cor da peça
 */
function obterCor(valor) {
  return CORES[valor] || "#ffffff";
}

/**
 * Atualiza os valores da pontuação e nível na interface
 */
export function atualizarPontuacao(pontuacao, nivel) {
  const elPontos = document.getElementById("score");
  const elNivel = document.getElementById("level");
  if (elPontos) elPontos.textContent = pontuacao;
  if (elNivel) elNivel.textContent = nivel;
}

/**
 * Atualiza o tempo decorrido no formato MM:SS
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Mostra modal de fim de jogo com pontuação final
 */
export function mostrarModalFim(pontuacaoFinal) {
  const elPontuacao = document.getElementById("final-score");
  if (elPontuacao) elPontuacao.textContent = `Pontuação: ${pontuacaoFinal}`;
  document.getElementById("modal")?.classList.add("show");
}

// canvas.js — desenho do tabuleiro principal e da próxima peça
import { COLUNAS, LINHAS, CORES } from "./motor.js";

/**
 * Inicializa os canvas e devolve os contextos e elementos configurados
 */
export function configurarCanvas() {
  const board = document.getElementById('board');
  const next = document.getElementById('next');

  const bloco = 32;

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
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas
 * @param {number} largura - largura total do canvas
 * @param {number} altura - altura total do canvas
 * @param {number[][]} tabuleiro - matriz de blocos fixos
 * @param {number[][]} peca - matriz da peça ativa
 * @param {{x: number, y: number}} posicao - posição da peça ativa
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
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas
 * @param {number[][]} proxima - matriz da próxima peça
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
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas
 * @param {number} x - coluna do bloco
 * @param {number} y - linha do bloco
 * @param {number} largura - largura do bloco
 * @param {number} altura - altura do bloco
 * @param {number} valor - tipo da peça
 */
function desenharBloco(ctx, x, y, largura, altura, valor) {
  const px = Math.floor(x * largura);
  const py = Math.floor(y * altura);
  const cor = obterCor(valor);

  // Sombra subtil
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = cor;
  ctx.fillRect(px, py, largura, altura);

  // Contorno
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "#333";
  ctx.strokeRect(px, py, largura, altura);
}

/**
 * Desenha um bloco absoluto para a próxima peça
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas
 * @param {number} x - posição horizontal absoluta
 * @param {number} y - posição vertical absoluta
 * @param {number} largura - largura do bloco
 * @param {number} altura - altura do bloco
 * @param {number} valor - tipo da peça
 */
function desenharBlocoAbsoluto(ctx, x, y, largura, altura, valor) {
  const cor = obterCor(valor);

  // Sombra subtil
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = cor;
  ctx.fillRect(x, y, largura, altura);

  // Contorno
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, largura, altura);
}

/**
 * Obtém a cor da peça, com fallback neutro
 * @param {number} valor - identificador da peça
 * @returns {string} - cor correspondente
 */
function obterCor(valor) {
  return CORES[valor] || "#cccccc";
}

/**
 * Atualiza os valores da pontuação e nível na interface
 * @param {number} pontuacao - pontos atuais
 * @param {number} nivel - nível atual
 */
export function atualizarPontuacao(pontuacao, nivel) {
  const elPontos = document.getElementById("score");
  const elNivel = document.getElementById("level");
  if (elPontos) elPontos.textContent = pontuacao;
  if (elNivel) elNivel.textContent = nivel;
}

/**
 * Atualiza o tempo decorrido em formato MM:SS
 * @param {HTMLElement} elTempo - elemento DOM onde mostrar o tempo
 * @param {number} segundos - tempo total em segundos
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Mostra o modal de fim de jogo com pontuação final
 * @param {number} pontuacaoFinal - pontuação a mostrar
 */
export function mostrarModalFim(pontuacaoFinal) {
  const elPontuacao = document.getElementById("final-score");
  if (elPontuacao) elPontuacao.textContent = `Pontuação: ${pontuacaoFinal}`;
  document.getElementById("modal")?.classList.add("show");
}

// canvas.js — desenho do tabuleiro principal e da próxima peça

import { COLUNAS, LINHAS } from "./motor.js";

/**
 * Desenha o tabuleiro e a peça atual no canvas principal
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} largura
 * @param {number} altura
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {object} posicao
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);

  const larguraBloco = largura / COLUNAS;
  const alturaBloco = altura / LINHAS;

  // Desenha o tabuleiro fixo
  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      const valor = tabuleiro[y][x];
      if (valor) {
        desenharBloco(ctx, x, y, larguraBloco, alturaBloco, valor);
      }
    }
  }

  // Desenha a peça actual
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (valor) {
        const px = posicao.x + x;
        const py = posicao.y + y;

        // Impede que o bloco ultrapasse a linha inferior
        if (py >= 0 && py < LINHAS) {
          desenharBloco(ctx, px, py, larguraBloco, alturaBloco, valor);
        }
      }
    }
  }
}

/**
 * Desenha a próxima peça no canvas de preview
 * @param {CanvasRenderingContext2D} ctx
 * @param {number[][]} proxima
 */
export function desenharProxima(ctx, proxima) {
  const largura = ctx.canvas.width;
  const altura = ctx.canvas.height;

  ctx.clearRect(0, 0, largura, altura);

  const larguraBloco = largura / proxima[0].length;
  const alturaBloco = altura / proxima.length;

  for (let y = 0; y < proxima.length; y++) {
    for (let x = 0; x < proxima[y].length; x++) {
      const valor = proxima[y][x];
      if (valor) {
        desenharBloco(ctx, x, y, larguraBloco, alturaBloco, valor);
      }
    }
  }
}

/**
 * Desenha um único bloco com cor no canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} largura
 * @param {number} altura
 * @param {number} valor
 */
function desenharBloco(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(
    Math.floor(x * largura),
    Math.floor(y * altura),
    Math.ceil(largura),
    Math.ceil(altura)
  );
}

/**
 * Retorna a cor associada ao valor do bloco
 * @param {number} valor
 * @returns {string}
 */
function obterCor(valor) {
  const cores = [
    "#F9CA24", // amarelo
    "#E74C3C", // vermelho
    "#8E44AD", // roxo
    "#3498DB", // azul
    "#2ECC71", // verde
    "#E67E22", // laranja
    "#34495E"  // cinza escuro
  ];
  return cores[(valor - 1) % cores.length] || "#FFFFFF";
}

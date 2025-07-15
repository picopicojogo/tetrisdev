// Módulo de desenho do canvas (tabuleiro e peças)
import { TAMANHO_BLOCO, CORES } from './motor.js';

/**
 * Desenha uma Matriz (peça ou tabuleiro) no canvas escolhido
 * @param {number[][]} matriz - matriz com valores das peças
 * @param {{x: number, y: number}} offset - posição onde desenhar
 * @param {CanvasRenderingContext2D} contexto - contexto de desenho (ctx)
 */
export function desenharMatriz(matriz, offset, contexto) {
  matriz.forEach((linha, y) =>
    linha.forEach((valor, x) => {
      if (!valor) return;

      const px = (x + offset.x) * TAMANHO_BLOCO;
      const py = (y + offset.y) * TAMANHO_BLOCO;
      const gradiente = contexto.createLinearGradient(px, py, px + TAMANHO_BLOCO, py + TAMANHO_BLOCO);
      gradiente.addColorStop(0, "#fff");
      gradiente.addColorStop(1, CORES[valor]);

      contexto.fillStyle = gradiente;
      contexto.strokeStyle = "#222";
      contexto.lineWidth = 2;
      contexto.shadowColor = "rgba(0, 0, 0, 0.4)";
      contexto.shadowBlur = 6;

      contexto.fillRect(px, py, TAMANHO_BLOCO, TAMANHO_BLOCO);
      contexto.strokeRect(px, py, TAMANHO_BLOCO, TAMANHO_BLOCO);

      // remove sombra após desenhar
      contexto.shadowColor = "transparent";
      contexto.shadowBlur = 0;
    })
  );
}

/**
 * Desenha o tabuleiro completo e a peça actual
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas principal
 * @param {number} largura - largura total
 * @param {number} altura - altura total
 * @param {number[][]} tabuleiro - estado atual do tabuleiro
 * @param {number[][]} peça - peça ativa
 * @param {{x: number, y: number}} posição - posição da peça
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peça, posição) {
  ctx.clearRect(0, 0, largura, altura);
  ctx.fillStyle = "rgba(253, 246, 227, 0.25)";
  ctx.fillRect(0, 0, largura, altura);

  desenharMatriz(tabuleiro, { x: 0, y: 0 }, ctx);
  if (peça) desenharMatriz(peça, posição, ctx);

  ctx.strokeStyle = "#888";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, largura, altura);
}

/**
 * Desenha a próxima peça no canvas lateral
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas de preview
 * @param {number[][]} próximaPeça - peça seguinte
 */
export function desenharProxima(ctx, próximaPeça) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const offsetX = Math.floor((4 - próximaPeça[0].length) / 2);
  const offsetY = Math.floor((4 - próximaPeça.length) / 2);
  desenharMatriz(próximaPeça, { x: offsetX, y: offsetY }, ctx);
}
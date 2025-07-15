// 🎨 Módulo de desenho no canvas: tabuleiro e peças
import { TAMANHO_BLOCO, CORES } from './motor.js';

/**
 * Desenha uma matriz (peça ou tabuleiro) no canvas indicado
 * @param {number[][]} matriz - matriz com valores de blocos
 * @param {{x: number, y: number}} offset - posição onde desenhar
 * @param {CanvasRenderingContext2D} contexto - contexto do canvas
 */
export function desenharMatriz(matriz, offset, contexto) {
  matriz.forEach((linha, y) => {
    linha.forEach((valor, x) => {
      if (!valor) return;

      const px = (x + offset.x) * TAMANHO_BLOCO;
      const py = (y + offset.y) * TAMANHO_BLOCO;

      const gradiente = contexto.createLinearGradient(px, py, px + TAMANHO_BLOCO, py + TAMANHO_BLOCO);
      gradiente.addColorStop(0, "#ffffff");
      gradiente.addColorStop(1, CORES[valor]);

      contexto.fillStyle = gradiente;
      contexto.strokeStyle = "#222";
      contexto.lineWidth = 2;
      contexto.shadowColor = "rgba(0, 0, 0, 0.4)";
      contexto.shadowBlur = 6;

      contexto.fillRect(px, py, TAMANHO_BLOCO, TAMANHO_BLOCO);
      contexto.strokeRect(px, py, TAMANHO_BLOCO, TAMANHO_BLOCO);

      // ⚠️ Remove sombra para próximos blocos
      contexto.shadowColor = "transparent";
      contexto.shadowBlur = 0;
    });
  });
}

/**
 * Desenha o estado completo do jogo no canvas principal
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas principal
 * @param {number} largura - largura do canvas
 * @param {number} altura - altura do canvas
 * @param {number[][]} tabuleiro - matriz atual do tabuleiro
 * @param {number[][]} peça - matriz da peça atual
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
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas de pré-visualização
 * @param {number[][]} próximaPeça - matriz da próxima peça
 */
export function desenharProxima(ctx, próximaPeça) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Centraliza a peça dentro do canvas
  const offsetX = Math.floor((4 - próximaPeça[0].length) / 2);
  const offsetY = Math.floor((4 - próximaPeça.length) / 2);

  desenharMatriz(próximaPeça, { x: offsetX, y: offsetY }, ctx);
}

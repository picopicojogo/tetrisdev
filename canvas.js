// Módulo de desenho: renderiza o tabuleiro e as pecas
import { TAMANHO_BLOCO, CORES } from './motor.js';

/**
 * Desenha uma matriz no canvas (tabuleiro ou peca)
 * @param {number[][]} matriz - matriz de blocos
 * @param {{x: number, y: number}} deslocamento - posicao no canvas
 * @param {CanvasRenderingContext2D} contexto - contexto 2D do canvas
 */
export function desenharMatriz(matriz, deslocamento, contexto) {
  matriz.forEach((linha, y) => {
    linha.forEach((valor, x) => {
      if (!valor) return;

      const px = (x + deslocamento.x) * TAMANHO_BLOCO;
      const py = (y + deslocamento.y) * TAMANHO_BLOCO;

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

      // Remove sombra para os proximos blocos
      contexto.shadowColor = "transparent";
      contexto.shadowBlur = 0;
    });
  });
}

/**
 * Desenha o estado atual do jogo no canvas principal
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas principal
 * @param {number} largura - largura do canvas
 * @param {number} altura - altura do canvas
 * @param {number[][]} tabuleiro - matriz do tabuleiro
 * @param {number[][]} peca - matriz da peca atual
 * @param {{x: number, y: number}} posicao - posicao da peca
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);
  ctx.fillStyle = "rgba(253, 246, 227, 0.25)";
  ctx.fillRect(0, 0, largura, altura);

  desenharMatriz(tabuleiro, { x: 0, y: 0 }, ctx);
  if (peca) desenharMatriz(peca, posicao, ctx);

  ctx.strokeStyle = "#888";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, largura, altura);
}

/**
 * Desenha a proxima peca no canvas lateral
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas lateral
 * @param {number[][]} proximaPeca - matriz da proxima peca
 */
export function desenharProxima(ctx, proximaPeca) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const deslocamentoX = Math.floor((4 - proximaPeca[0].length) / 2);
  const deslocamentoY = Math.floor((4 - proximaPeca.length) / 2);

  desenharMatriz(proximaPeca, { x: deslocamentoX, y: deslocamentoY }, ctx);
}

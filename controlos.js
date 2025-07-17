import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça horizontalmente, se não houver colisão
 * @param {number} direcao - -1 para esquerda, +1 para direita
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 */
export function moverPeca(direcao, tabuleiro, peca, posicao) {
  posicao.x += direcao;
  if (verificarColisao(tabuleiro, peca, posicao)) {
    posicao.x -= direcao;
  }
}

/**
 * Roda a peça, se possível
 * @param {number} direcao - +1 horário, -1 anti-horário
 * @param {number[][]} peca
 * @param {number[][]} tabuleiro
 * @param {{x: number, y: number}} posicao
 * @returns {number[][]} matriz rodada ou original
 */
export function rodarPeca(direcao, peca, tabuleiro, posicao) {
  const rodada = rodar(peca, direcao);
  if (verificarColisao(tabuleiro, rodada, posicao)) {
    return peca;
  }
  tocarSomRodar();
  return rodada;
}

/**
 * Move a peça uma linha para baixo, ou trava se houver colisão
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 * @returns {boolean} verdadeiro se não conseguiu descer
 */
export function descerPeca(tabuleiro, peca, posicao) {
  posicao.y++;
  if (verificarColisao(tabuleiro, peca, posicao)) {
    posicao.y--;
    return true;
  }
  return false;
}

/**
 * Liga os controlos do jogador (teclado, botões e toque)
 * @param {function} moverFn - mover horizontalmente
 * @param {function} rodarFn - rodar a peça
 * @param {function} descerFn - descer uma linha
 * @param {function} quedaFn - descida rápida da peça
 * @param {function} pausarFn - pausar o jogo
 */
export function configurarControlos(moverFn, rodarFn, descerFn, quedaFn, pausarFn) {
  // Teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key;
    const teclaInferior = tecla.toLowerCase();

    // Impede o scroll do navegador
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"].includes(tecla)) {
      e.preventDefault();
    }

    if (teclaInferior === "arrowleft") moverFn(-1);
    if (teclaInferior === "arrowright") moverFn(1);
    if (teclaInferior === "arrowdown") descerFn();
    if (teclaInferior === "arrowup") rodarFn(1);
    if (teclaInferior === " ") quedaFn();
    if (teclaInferior === "p") pausarFn();
  });

  // Botões visuais (se existirem)
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));
  document.getElementById("dropBtn")?.addEventListener("click", () => quedaFn());

  // Controlo por toque em dispositivos móveis
  const canvas = document.getElementById("board");
  let startX = 0, startY = 0;

  canvas?.addEventListener("touchstart", e => {
    const toque = e.touches[0];
    startX = toque.clientX;
    startY = toque.clientY;
  });

  canvas?.addEventListener("touchend", e => {
    const toque = e.changedTouches[0];
    const dx = toque.clientX - startX;
    const dy = toque.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Toque leve = rodar
    if (Math.max(absX, absY) < 20) {
      rodarFn(1);
      return;
    }

    // Gesto horizontal = mover
    if (absX > absY) {
      dx > 0 ? moverFn(1) : moverFn(-1);
    }
    // Gesto vertical = descer ou queda rápida
    else {
      dy > 0 ? descerFn() : quedaFn();
    }
  });
}

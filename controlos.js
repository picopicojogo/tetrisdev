import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça na horizontal, se possível
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
 * Roda a peça no sentido indicado, se não houver colisão
 * @param {number} direcao - +1 horário, -1 anti-horário
 * @param {number[][]} peca
 * @param {number[][]} tabuleiro
 * @param {{x: number, y: number}} posicao
 * @returns {number[][]} matriz da peça (rodada ou original)
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
 * Move a peça uma linha para baixo ou trava se houver colisão
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
 * Liga os controlos do jogador: teclado, botões visuais e toque
 * @param {function} moverFn - move horizontalmente
 * @param {function} rodarFn - roda a peça
 * @param {function} descerFn - desce uma linha
 * @param {function} quedaFn - descida rápida da peça
 * @param {function} pausarFn - pausa o jogo
 */
export function configurarControlos(moverFn, rodarFn, descerFn, quedaFn, pausarFn) {
  // Teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key.toLowerCase();
    const bloquear = ["arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"];
    if (bloquear.includes(tecla) || tecla === " ") e.preventDefault();

    if (tecla === "arrowleft") moverFn(-1);
    if (tecla === "arrowright") moverFn(1);
    if (tecla === "arrowdown") descerFn();
    if (tecla === "arrowup") rodarFn(1);
    if (tecla === " ") quedaFn();
    if (tecla === "p") pausarFn();
  });

  // Botões visuais (se existirem)
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));
  document.getElementById("dropBtn")?.addEventListener("click", () => quedaFn());

  // Toque em dispositivos móveis
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

    if (Math.max(absX, absY) < 20) {
      rodarFn(1); // Toque leve = rodar
      return;
    }

    if (absX > absY) {
      dx > 0 ? moverFn(1) : moverFn(-1);
    } else {
      dy > 0 ? descerFn() : quedaFn();
    }
  });
}

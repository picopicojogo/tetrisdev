import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça lateralmente, se possível
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
 * @returns {number[][]}
 */
export function rodarPeca(direcao, peca, tabuleiro, posicao) {
  const original = peca.map(r => [...r]);
  const rodada = rodar(peca, direcao);
  if (verificarColisao(tabuleiro, rodada, posicao)) {
    return original;
  } else {
    tocarSomRodar();
    return rodada;
  }
}

/**
 * Move a peça uma linha para baixo
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 * @returns {boolean} - true se colidiu
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
 * Liga controlos do jogador aos eventos
 * @param {function} moverFn
 * @param {function} rodarFn
 * @param {function} descerFn
 * @param {function} pausarFn
 */
export function configurarControlos(moverFn, rodarFn, descerFn, pausarFn) {
  // Teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(tecla)) e.preventDefault();
    if (tecla === "ArrowLeft") moverFn(-1);
    if (tecla === "ArrowRight") moverFn(1);
    if (tecla === "ArrowDown") descerFn();
    if (tecla === "ArrowUp") rodarFn(1);
    if (tecla.toLowerCase() === "p") pausarFn();
  });

  // Botões visuais (pcional)
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));

  // Toque em ecrãs móveis
  let startX = 0, startY = 0;
  const canvas = document.getElementById("board");

  canvas?.addEventListener("touchstart", e => {
    const toque = e.touches[0];
    startX = toque.clientX;
    startY = toque.clientY;
  });

  canvas?.addEventListener("touchend", e => {
    const toque = e.changedTouches[0];
    const dx = toque.clientX - startX;
    const dy = toque.clientY - startY;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    if (Math.max(absX, absY) < 20) return rodarFn(1);
    if (absX > absY) dx > 0 ? moverFn(1) : moverFn(-1);
    else if (dy > 0) descerFn();
  });
}

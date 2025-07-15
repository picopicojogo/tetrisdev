// Módulo de controlo: teclado, botões e toque
import { verificarColisao, rodar } from './motor.js';
import { tocarSom } from './audio.js';

/**
 * Move a peça para a esquerda ou direita
 * @param {number} direção - -1 para esquerda, +1 para direita
 * @param {number[][]} tabuleiro
 * @param {number[][]} peça
 * @param {{x: number, y: number}} posição
 */
export function moverPeça(direção, tabuleiro, peça, posição) {
  posição.x += direção;
  if (verificarColisao(tabuleiro, peça, posição)) {
    posição.x -= direção; // desfaz movimento se colidir
  }
}

/**
 * Roda a peça com verificação de colisão
 * @param {number} direção - +1 horário, -1 anti-horário
 * @param {number[][]} peça
 * @param {number[][]} tabuleiro
 * @param {{x: number, y: number}} posição
 * @returns {number[][]} - peça rotacionada ou original
 */
export function rodarPeça(direção, peça, tabuleiro, posição) {
  const original = peça.map(r => [...r]);
  const rodada = rodar(peça, direção);
  if (verificarColisao(tabuleiro, rodada, posição)) {
    return original; // ignora rotação se colidir
  } else {
    tocarSom("rodar");
    return rodada;
  }
}

/**
 * Move a peça uma linha abaixo
 * @param {number[][]} tabuleiro
 * @param {number[][]} peça
 * @param {{x: number, y: number}} posição
 * @returns {boolean} - true se colidir
 */
export function descerPeça(tabuleiro, peça, posição) {
  posição.y++;
  if (verificarColisao(tabuleiro, peça, posição)) {
    posição.y--;
    return true; // colisão confirmada
  }
  return false;
}

/**
 * Regista os eventos de controlo do jogador
 * @param {function} moverFn - função para mover lateralmente
 * @param {function} rodarFn - função para rodar peça
 * @param {function} descerFn - função para descer peça
 * @param {function} pausarFn - função para pausar jogo
 */
export function configurarControlos(moverFn, rodarFn, descerFn, pausarFn) {
  // Teclado físico
  window.addEventListener("keydown", e => {
    const tecla = e.key;
    const setas = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    // Evita que o navegador responda faça scroll ao jogarmos
    if (setas.includes(tecla)) e.preventDefault();

    if (tecla === "ArrowLeft") moverFn(-1);
    if (tecla === "ArrowRight") moverFn(1);
    if (tecla === "ArrowDown") descerFn();
    if (tecla === "ArrowUp") rodarFn(1);
    if (tecla.toLowerCase() === "p") pausarFn();
  });

  // Botões táteis/visuais
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));

  // Gestos de toque para dispositivos móveis
  let startX = 0, startY = 0;
  const canvas = document.getElementById("board");

  canvas?.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });

  canvas?.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const absX = Math.abs(dx), absY = Math.abs(dy);

    if (Math.max(absX, absY) < 20) return rodarFn(1); // toque curto = rotação

    if (absX > absY) dx > 0 ? moverFn(1) : moverFn(-1);
    else if (dy > 0) descerFn();
  });
}
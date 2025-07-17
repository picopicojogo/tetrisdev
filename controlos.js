import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça na horizontal, se não houver colisão
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
 * @param {number} direcao - +1 sentido horário, -1 sentido anti-horário
 * @param {number[][]} peca
 * @param {number[][]} tabuleiro
 * @param {{x: number, y: number}} posicao
 * @returns {number[][]} matriz da peça (original ou rodada)
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
 * Desce a peça uma linha, ou deteta colisão vertical
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 * @returns {boolean} true se não conseguiu descer
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
 * Liga os controlos (teclado, botões e toque) às funções do jogo
 * @param {function} moverFn - função para mover horizontalmente
 * @param {function} rodarFn - função para rodar a peça
 * @param {function} descerFn - função para descer a peça
 * @param {function} quedaFn - função para descida rápida da peça
 * @param {function} pausarFn - função para pausar o jogo
 */
export function configurarControlos(moverFn, rodarFn, descerFn, quedaFn, pausarFn) {
  // Controlos via teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key;
    const teclaInferior = tecla.toLowerCase();
    const bloqueadas = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"];
    if (bloqueadas.includes(tecla)) e.preventDefault();

    if (teclaInferior === "arrowleft") moverFn(-1);
    if (teclaInferior === "arrowright") moverFn(1);
    if (teclaInferior === "arrowdown") descerFn();
    if (teclaInferior === "arrowup") rodarFn(1);
    if (teclaInferior === " ") quedaFn();
    if (teclaInferior === "p") pausarFn();
  });

  // Botões visuais
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));
  document.getElementById("dropBtn")?.addEventListener("click", () => quedaFn());

  // Controlos por toque em dispositivos móveis
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
    const absX = Math.abs(dx), absY = Math.abs(dy);

    if (Math.max(absX, absY) < 20) {
      rodarFn(1); // Toque leve = rodar a peça
      return;
    }

    if (absX > absY) {
      dx > 0 ? moverFn(1) : moverFn(-1); // Deslocar horizontalmente
    } else {
      dy > 0 ? descerFn() : quedaFn();   // Descer ou lançar rapidamente
    }
  });
}

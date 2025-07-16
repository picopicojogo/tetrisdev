import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça lateralmente, se possível
 */
export function moverPeca(direcao, tabuleiro, peca, posicao) {
  posicao.x += direcao;
  if (verificarColisao(tabuleiro, peca, posicao)) {
    posicao.x -= direcao;
  }
}

/**
 * Roda a peça, se possível
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
 * Faz a peça cair até ao fundo
 */
export function quedaInstantanea(tabuleiro, peca, posicao) {
  while (!verificarColisao(tabuleiro, peca, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
}

/**
 * Liga controlos do jogador aos eventos
 */
export function configurarControlos(moverFn, rodarFn, descerFn, pausarFn, dropFn) {
  // Teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(tecla)) e.preventDefault();
    if (tecla === "ArrowLeft") moverFn(-1);
    if (tecla === "ArrowRight") moverFn(1);
    if (tecla === "ArrowDown") descerFn();
    if (tecla === "ArrowUp") rodarFn(1);
    if (tecla === " ") dropFn();
    if (tecla.toLowerCase() === "p") pausarFn();
  });

  // Botões visuais (opcionais)
  document.getElementById("leftBtn")?.addEventListener("click", () => moverFn(-1));
  document.getElementById("rightBtn")?.addEventListener("click", () => moverFn(1));
  document.getElementById("downBtn")?.addEventListener("click", () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));
  document.getElementById("dropBtn")?.addEventListener("click", () => dropFn());

  // 📱 Toque em ecrãs móveis
  let startX = 0, startY = 0;
  let ultimoToque = 0;
  const canvas = document.getElementById("board");

  canvas?.addEventListener("touchstart", e => {
    const toque = e.touches[0];
    startX = toque.clientX;
    startY = toque.clientY;

    const agora = Date.now();
    if (agora - ultimoToque < 300) {
      rodarFn(-1); // Toque duplo → rotação anti-horária
    }
    ultimoToque = agora;
  });

  canvas?.addEventListener("touchend", e => {
    const toque = e.changedTouches[0];
    const dx = toque.clientX - startX;
    const dy = toque.clientY - startY;
    const absX = Math.abs(dx), absY = Math.abs(dy);

    if (Math.max(absX, absY) < 30) return rodarFn(1); // Toque curto → rotação horária

    if (absX > absY) {
      dx > 0 ? moverFn(1) : moverFn(-1);
    } else {
      if (absY > 100) {
        dropFn(); // Deslizar rápido para baixo
      } else {
        descerFn(); // Desliza de forma curta
      }
    }
  });
}

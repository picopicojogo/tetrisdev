import { verificarColisao, rodar } from './motor.js';
import { tocarSomRodar } from './audio.js';

/**
 * Move a peça horizontalmente, se não houver colisão
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
  const rodada = rodar(peca, direcao);
  if (verificarColisao(tabuleiro, rodada, posicao)) {
    return peca;
  }
  tocarSomRodar();
  return rodada;
}

/**
 * Move uma linha para baixo ou trava se houver colisão
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
 * Liga os controlos do utilizador (teclado, botões, toque e gestos)
 */
export function configurarControlos(moverFn, rodarFn, descerFn, quedaFn, pausarFn) {
  // ⌨️ Teclado
  window.addEventListener("keydown", e => {
    const tecla = e.key.toLowerCase();

    // Impede scroll
    if (["arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar"].includes(tecla)) {
      e.preventDefault();
    }

    if (tecla === "arrowleft") moverFn(-1);
    if (tecla === "arrowright") moverFn(1);
    if (tecla === "arrowdown") descerFn();
    if (tecla === "arrowup") rodarFn(1);
    if (tecla === " ") quedaFn();
    if (tecla === "p") pausarFn();
  });

  // 🕹️ Botões visuais (com repetição contínua ao pressionar)
  const repetirAoManter = (el, acao) => {
    let intervalo;
    el?.addEventListener("mousedown", () => {
      acao();
      intervalo = setInterval(acao, 150);
    });
    el?.addEventListener("mouseup", () => clearInterval(intervalo));
    el?.addEventListener("mouseleave", () => clearInterval(intervalo));
    el?.addEventListener("touchstart", () => {
      acao();
      intervalo = setInterval(acao, 150);
    }, { passive: true });
    el?.addEventListener("touchend", () => clearInterval(intervalo));
  };

  repetirAoManter(document.getElementById("leftBtn"), () => moverFn(-1));
  repetirAoManter(document.getElementById("rightBtn"), () => moverFn(1));
  repetirAoManter(document.getElementById("downBtn"), () => descerFn());
  document.getElementById("rotateBtn")?.addEventListener("click", () => rodarFn(1));
  document.getElementById("dropBtn")?.addEventListener("click", () => quedaFn());

  // 📱 Gestos por toque no canvas
  const canvas = document.getElementById("board");
  let startX = 0, startY = 0;
  let ultimoToque = 0;

  canvas?.addEventListener("touchstart", e => {
    const toque = e.touches[0];
    startX = toque.clientX;
    startY = toque.clientY;

    const agora = Date.now();
    if (agora - ultimoToque < 300) {
      rodarFn(1); // toque duplo para rodar
    }
    ultimoToque = agora;
  }, { passive: true });

  canvas?.addEventListener("touchend", e => {
    const toque = e.changedTouches[0];
    const dx = toque.clientX - startX;
    const dy = toque.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const limiar = 10; // sensibilidade

    if (Math.max(absX, absY) < limiar) {
      rodarFn(1); // toque leve = rodar
      return;
    }

    if (absX > absY) {
      dx > 0 ? moverFn(1) : moverFn(-1);
    } else {
      dy > 40 ? quedaFn() : descerFn(); // deslize forte = queda
    }
  }, { passive: true });
}

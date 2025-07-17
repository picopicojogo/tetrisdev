/**
 * controlos.js
 *
 * Módulo responsável por gerir os controlos do jogador durante o jogo.
 * Inclui funções para mover, rodar e acelerar a peça, bem como configurar
 * os eventos de teclado que ativam essas ações.
 */

// Importa funções necessárias
import { verificarColisao, aplicarEfeitosTabuleiro } from './canvas.js';
import {
  tocarSomRodar,
  tocarSomColidir,
  tocarSomPontos,
  tocarComboFinal
} from './audio.js';

/**
 * Roda a peça no sentido horário ou anti-horário
 */
export function rodarPeca(sentido, peca, tabuleiro, posicao) {
  const altura = peca.length;
  const largura = peca[0].length;
  const nova = [];

  for (let x = 0; x < largura; x++) {
    nova[x] = [];
    for (let y = 0; y < altura; y++) {
      nova[x][y] = sentido > 0
        ? peca[altura - y - 1][x]
        : peca[y][largura - x - 1];
    }
  }

  if (!verificarColisao(tabuleiro, nova, posicao)) {
    tocarSomRodar();
    return nova;
  }

  return peca;
}

/**
 * Move a peça horizontalmente
 */
export function moverPeca(direcao, tabuleiro, peca, posicao) {
  const novaX = posicao.x + direcao;
  if (!verificarColisao(tabuleiro, peca, { x: novaX, y: posicao.y })) {
    posicao.x = novaX;
  }
}

/**
 * Desce a peça uma linha
 */
export function descerPeca(tabuleiro, peca, posicao) {
  const novaY = posicao.y + 1;
  if (!verificarColisao(tabuleiro, peca, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  }
}

/**
 * Queda instantânea até ao fundo
 */
export function quedaInstantanea(tabuleiro, peca, posicao) {
  while (!verificarColisao(tabuleiro, peca, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
}

/**
 * Liga os eventos de teclado aos controlos do jogo
 */
export function configurarControlos(mover, rodar, descer, pausar, cair) {
  document.addEventListener('keydown', evento => {
    switch (evento.code) {
      case 'ArrowLeft':
        mover(-1);
        break;
      case 'ArrowRight':
        mover(1);
        break;
      case 'ArrowUp':
        rodar();
        break;
      case 'ArrowDown':
        descer();
        break;
      case 'Space':
        cair();
        break;
      case 'Escape':
        pausar();
        break;
    }
  });
}

/**
 * Chamado ao eliminar uma linha ou combo importante
 * Aplica efeitos visuais e sons dependendo das definições
 */
export function aplicarFeedbackCombo(comboLevel = 1) {
  aplicarEfeitosTabuleiro(); // Flash / vibração se ativo

  if (comboLevel === 1) {
    tocarSomPontos();
  } else if (comboLevel === 2) {
    tocarSomColidir();
  } else if (comboLevel >= 3) {
    tocarComboFinal();
  }
}

/**
 * controlos.js
 *
 * Módulo responsável por gerir os controlos do jogador durante o jogo.
 * Inclui funções para mover, rodar e acelerar a peça, bem como configurar
 * os eventos de teclado que ativam essas ações.
 */

// Importa a função de colisão para validar movimentos
import { verificarColisao } from './canvas.js';

/**
 * Roda a peça no sentido horário ou anti-horário
 * @param {number} sentido - 1 para horário, -1 para anti-horário
 * @param {Array<Array<number>>} peca - matriz da peça atual
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Object} posicao - posição atual da peça
 * @returns {Array<Array<number>>} - nova matriz da peça rodada
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

  // Verifica se a rotação é válida
  if (!verificarColisao(tabuleiro, nova, posicao)) {
    return nova;
  }

  // Se houver colisão, mantém a peça original
  return peca;
}

/**
 * Move a peça horizontalmente
 * @param {number} direcao - -1 para esquerda, 1 para direita
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} peca - matriz da peça atual
 * @param {Object} posicao - posição atual da peça (modificada diretamente)
 */
export function moverPeca(direcao, tabuleiro, peca, posicao) {
  const novaX = posicao.x + direcao;
  if (!verificarColisao(tabuleiro, peca, { x: novaX, y: posicao.y })) {
    posicao.x = novaX;
  }
}

/**
 * Faz a peça descer uma linha
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} peca - matriz da peça atual
 * @param {Object} posicao - posição atual da peça (modificada diretamente)
 */
export function descerPeca(tabuleiro, peca, posicao) {
  const novaY = posicao.y + 1;
  if (!verificarColisao(tabuleiro, peca, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  }
}

/**
 * Faz a peça cair até ao fundo instantaneamente
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} peca - matriz da peça atual
 * @param {Object} posicao - posição atual da peça (modificada diretamente)
 */
export function quedaInstantanea(tabuleiro, peca, posicao) {
  while (!verificarColisao(tabuleiro, peca, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
}

/**
 * Liga os eventos de teclado aos controlos do jogo
 * @param {Function} mover - função para mover a peça
 * @param {Function} rodar - função para rodar a peça
 * @param {Function} descer - função para descer a peça
 * @param {Function} pausar - função para pausar o jogo
 * @param {Function} cair - função para queda instantânea
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

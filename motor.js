// Dimensões do tabuleiro de jogo
export const COLUNAS = 10;
export const LINHAS = 20;

/**
 * Verifica se uma peça colide com o tabuleiro ou com os limites
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} peca - matriz da peça
 * @param {Object} posicao - posição x e y da peça
 * @returns {boolean} - true se houver colisão
 */
export function verificarColisao(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const px = posicao.x + x;
        const py = posicao.y + y;

        // Verifica se está fora dos limites ou sobre uma célula ocupada
        if (
          px < 0 ||
          px >= COLUNAS ||
          py >= LINHAS ||
          (py >= 0 && tabuleiro[py][px])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Fixa a peça no tabuleiro após colisão
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} peca - matriz da peça
 * @param {Object} posicao - posição x e y da peça
 */
export function fixarPeca(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const px = posicao.x + x;
        const py = posicao.y + y;

        if (py >= 0 && py < LINHAS && px >= 0 && px < COLUNAS) {
          tabuleiro[py][px] = peca[y][x];
        }
      }
    }
  }
}

/**
 * Elimina linhas completas do tabuleiro
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @returns {number} - número de linhas eliminadas
 */
export function eliminarLinhas(tabuleiro) {
  let linhasEliminadas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(valor => valor !== 0)) {
      tabuleiro.splice(y, 1); // Remove a linha completa
      tabuleiro.unshift(Array(COLUNAS).fill(0)); // Adiciona linha vazia no topo
      linhasEliminadas++;
      y++;
    }
  }

  return linhasEliminadas;
}

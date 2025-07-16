// Constantes do tabuleiro
export const COLUNAS = 10;
export const LINHAS = 20;

/**
 * Verifica se há colisão entre a peça e o tabuleiro na posição dada
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 * @returns {boolean}
 */
export function verificarColisao(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const novoX = posicao.x + x;
        const novoY = posicao.y + y;
        if (
          novoX < 0 || novoX >= COLUNAS ||
          novoY >= LINHAS ||
          (novoY >= 0 && tabuleiro[novoY]?.[novoX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Roda uma matriz no sentido horário (+1) ou anti-horário (-1)
 * @param {number[][]} peca
 * @param {number} direcao
 * @returns {number[][]}
 */
export function rodar(peca, direcao = 1) {
  const altura = peca.length;
  const largura = peca[0].length;
  const matriz = [];

  for (let x = 0; x < largura; x++) {
    matriz[x] = [];
    for (let y = 0; y < altura; y++) {
      matriz[x][y] = direcao > 0
        ? peca[altura - 1 - y][x]     // horário
        : peca[y][largura - 1 - x];  // anti-horário
    }
  }

  return matriz;
}

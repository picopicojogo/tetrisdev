export const COLUNAS = 10;
export const LINHAS = 20;

/* Cores das peças (por tipo) */
export const CORES = {
  1: '#00ffff', // I
  2: '#ff00ff', // T
  3: '#ffff00', // O
  4: '#00ff00', // S
  5: '#ff0000', // Z
  6: '#0000ff', // J
  7: '#ffa500'  // L
};

/* Todas as peças disponíveis */
const PECAS = [
  // I
  [[1, 1, 1, 1]],
  // T
  [[0, 2, 0], [2, 2, 2]],
  // O
  [[3, 3], [3, 3]],
  // S
  [[0, 4, 4], [4, 4, 0]],
  // Z
  [[5, 5, 0], [0, 5, 5]],
  // J
  [[6, 0, 0], [6, 6, 6]],
  // L
  [[0, 0, 7], [7, 7, 7]]
];

/**
 * Cria matriz do tabuleiro com todas as posições a zero
 * @param {number} largura
 * @param {number} altura
 * @returns {number[][]}
 */
export function criarMatriz(largura, altura) {
  return Array.from({ length: altura }, () => Array(largura).fill(0));
}

/**
 * Gera uma nova peça aleatória
 * @returns {number[][]}
 */
export function gerarPeca() {
  const id = Math.floor(Math.random() * PECAS.length);
  return PECAS[id].map(row => [...row]);
}

/**
 * Verifica se há colisão entre a peça e o tabuleiro
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 * @returns {boolean}
 */
export function verificarColisao(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (!valor) continue;

      const tx = posicao.x + x;
      const ty = posicao.y + y;

      if (tx < 0 || tx >= COLUNAS || ty >= LINHAS) {
        return true;
      }

      if (ty >= 0 && tabuleiro[ty]?.[tx] !== 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Roda a peça no sentido indicado
 * @param {number[][]} peca
 * @param {number} direcao - +1 para horário, -1 para anti-horário
 * @returns {number[][]}
 */
export function rodar(peca, direcao) {
  const matriz = peca.map((_, i) => peca.map(r => r[i]));
  return direcao > 0 ? matriz.map(r => r.reverse()) : matriz.reverse();
}

/**
 * Fundir peça fixa no tabuleiro
 * @param {number[][]} tabuleiro
 * @param {number[][]} peca
 * @param {{x: number, y: number}} posicao
 */
export function fundirPeca(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (valor) {
        const tx = posicao.x + x;
        const ty = posicao.y + y;
        if (ty >= 0 && ty < LINHAS && tx >= 0 && tx < COLUNAS) {
          tabuleiro[ty][tx] = valor;
        }
      }
    }
  }
}

/**
 * Remove linhas completas e devolve o número de linhas eliminadas
 * @param {number[][]} tabuleiro
 * @returns {number} número de linhas removidas
 */
export function limparLinhas(tabuleiro) {
  let linhasRemovidas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(valor => valor !== 0)) {
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(new Array(tabuleiro[0].length).fill(0));
      linhasRemovidas++;
      y++; // volta a verificar nova linha no mesmo índice
    }
  }

  return linhasRemovidas;
}

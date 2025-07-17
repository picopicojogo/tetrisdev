export const COLUNAS = 10;
export const LINHAS = 20;

/* Cores por tipo de peça */
export const CORES = {
  1: '#00ffff', // I
  2: '#ff00ff', // T
  3: '#ffff00', // O
  4: '#00ff00', // S
  5: '#ff0000', // Z
  6: '#0000ff', // J
  7: '#ffa500'  // L
};

/* Formatos das peças */
const PECAS = [
  [[1, 1, 1, 1]],                    // I
  [[0, 2, 0], [2, 2, 2]],            // T
  [[3, 3], [3, 3]],                  // O
  [[0, 4, 4], [4, 4, 0]],            // S
  [[5, 5, 0], [0, 5, 5]],            // Z
  [[6, 0, 0], [6, 6, 6]],            // J
  [[0, 0, 7], [7, 7, 7]]             // L
];

/**
 * Cria uma matriz vazia para o tabuleiro
 */
export function criarMatriz(largura, altura) {
  return Array.from({ length: altura }, () => Array(largura).fill(0));
}

/**
 * Gera uma nova peça aleatória
 */
export function gerarPeca() {
  const i = Math.floor(Math.random() * PECAS.length);
  return PECAS[i].map(row => [...row]);
}

/**
 * Verifica se há colisão com limites ou peças fixas
 */
export function verificarColisao(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (!valor) continue;

      const tx = posicao.x + x;
      const ty = posicao.y + y;

      if (tx < 0 || tx >= COLUNAS || ty >= LINHAS) return true;
      if (ty >= 0 && tabuleiro[ty]?.[tx] !== 0) return true;
    }
  }
  return false;
}

/**
 * Roda a peça no sentido indicado
 */
export function rodar(peca, direcao) {
  const matriz = peca.map((_, i) => peca.map(r => r[i]));
  return direcao > 0 ? matriz.map(r => r.reverse()) : matriz.reverse();
}

/**
 * Fundir peça fixa no tabuleiro
 * @param {number[][]} tabuleiro - estado atual do tabuleiro
 * @param {number[][]} peca - matriz da peça ativa
 * @param {{x: number, y: number}} posicao - posição de inserção da peça
 */
export function fundirPeca(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (valor) {
        const tx = posicao.x + x;
        const ty = posicao.y + y;
        if (tx >= 0 && tx < COLUNAS && ty >= 0 && ty < LINHAS) {
          tabuleiro[ty][tx] = valor;
        }
      }
    }
  }
}

/**
 * Elimina linhas completas do tabuleiro
 * @param {number[][]} tabuleiro - matriz do tabuleiro
 * @returns {number} - número de linhas eliminadas
 */
export function limparLinhas(tabuleiro) {
  let linhasRemovidas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    const linhaCompleta = tabuleiro[y].every(valor => valor !== 0);
    if (linhaCompleta) {
      tabuleiro.splice(y, 1); // remove a linha
      tabuleiro.unshift(new Array(COLUNAS).fill(0)); // adiciona linha vazia no topo
      linhasRemovidas++;
      y++; // reposiciona para verificar nova linha após deslocamento
    }
  }

  return linhasRemovidas;
}

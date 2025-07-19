// Dimensões do tabuleiro
export const COLUNAS = 10;
export const LINHAS = 20;

/**
 * Cores associadas aos tipos de peça
 */
export const CORES = {
  1: '#00ffff', // I
  2: '#ff00ff', // T
  3: '#ffff00', // O
  4: '#00ff00', // S
  5: '#ff0000', // Z
  6: '#0000ff', // J
  7: '#ffa500'  // L
};

/**
 * Formatos das peças disponíveis
 */
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
 * Cria uma matriz vazia com dimensões especificadas
 * @param {number} largura - número de colunas
 * @param {number} altura - número de linhas
 * @returns {number[][]} - matriz inicial do tabuleiro
 */
export function criarMatriz(largura, altura) {
  return Array.from({ length: altura }, () => Array(largura).fill(0));
}

/**
 * Gera uma nova peça aleatória a partir dos formatos disponíveis
 * @returns {number[][]} - matriz da peça gerada
 */
export function gerarPeca() {
  const i = Math.floor(Math.random() * PECAS.length);
  return PECAS[i].map(row => [...row]); // cópia segura da peça
}

/**
 * Verifica se há colisão da peça com os limites ou com peças fixas
 * @param {number[][]} tabuleiro - matriz actual do tabuleiro
 * @param {number[][]} peca - matriz da peça activa
 * @param {{x: number, y: number}} posicao - posição da peça
 * @returns {boolean} - verdadeiro se houver colisão
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
 * Roda a peça consoante a direcção indicada
 * @param {number[][]} peca - matriz da peça
 * @param {number} direcao - +1 para horário, -1 para anti-horário
 * @returns {number[][]} - matriz rodada
 */
export function rodar(peca, direcao) {
  const matriz = peca[0].map((_, i) => peca.map(r => r[i]));
  return direcao > 0 ? matriz.map(r => r.reverse()) : matriz.reverse();
}

/**
 * Funde a peça activa na matriz do tabuleiro
 * @param {number[][]} tabuleiro - estado actual do tabuleiro
 * @param {number[][]} peca - matriz da peça activa
 * @param {{x: number, y: number}} posicao - posição actual da peça
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
 * Elimina linhas completas e actualiza o tabuleiro
 * @param {number[][]} tabuleiro - matriz do tabuleiro
 * @returns {number} - número de linhas eliminadas
 */
export function limparLinhas(tabuleiro) {
  let linhasRemovidas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    const linhaCompleta = tabuleiro[y].every(valor => valor !== 0);
    if (linhaCompleta) {
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(new Array(COLUNAS).fill(0));
      linhasRemovidas++;
      y++; // reposiciona para verificar nova linha após deslocamento
    }
  }

  return linhasRemovidas;
}

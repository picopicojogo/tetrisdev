// Dimensões do tabuleiro de jogo
export const COLUNAS = 10;
export const LINHAS = 20;

// Lista de peças disponíveis no jogo
export const pecasDisponiveis = [
  [[1, 1], [1, 1]],                    // Quadrado
  [[0, 2, 0], [2, 2, 2]],              // T
  [[3, 3, 0], [0, 3, 3]],              // S
  [[0, 4, 4], [4, 4, 0]],              // Z
  [[5, 5, 5, 5]],                      // I
  [[6, 0, 0], [6, 6, 6]],              // L
  [[0, 0, 7], [7, 7, 7]]               // J
];

/**
 * Cria uma peça aleatória com base na lista disponível
 * @returns {Array<Array<number>>} Matriz da peça
 */
export function gerarPecaAleatoria() {
  const aleatoria = Math.floor(Math.random() * pecasDisponiveis.length);
  return pecasDisponiveis[aleatoria];
}

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
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(Array(COLUNAS).fill(0));
      linhasEliminadas++;
      y++;
    }
  }

  return linhasEliminadas;
}

/**
 * Desenha a próxima peça no canvas de preview
 * @param {CanvasRenderingContext2D} ctx - contexto do canvas
 * @param {Array<Array<number>>} peca - matriz da peça
 */
export function desenharProxima(ctx, peca) {
  const bloco = 20;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x * bloco, y * bloco, bloco, bloco);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x * bloco, y * bloco, bloco, bloco);
      }
    }
  }
}

/**
 * Desenha o estado atual do tabuleiro e a peça em movimento
 * @param {CanvasRenderingContext2D} ctx - contexto do tabuleiro
 * @param {number} width - largura do canvas
 * @param {number} height - altura do canvas
 * @param {Array<Array<number>>} tabuleiro - matriz do tabuleiro
 * @param {Array<Array<number>>} pecaAtual - matriz da peça atual
 * @param {Object} posicao - posição x e y da peça atual
 */
export function desenharJogo(ctx, width, height, tabuleiro, pecaAtual, posicao) {
  const bloco = 20;
  ctx.clearRect(0, 0, width, height);

  // Desenha o tabuleiro
  for (let y = 0; y < tabuleiro.length; y++) {
    for (let x = 0; x < tabuleiro[y].length; x++) {
      if (tabuleiro[y][x]) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(x * bloco, y * bloco, bloco, bloco);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x * bloco, y * bloco, bloco, bloco);
      }
    }
  }

  // Desenha a peça actual em movimento
  for (let y = 0; y < pecaAtual.length; y++) {
    for (let x = 0; x < pecaAtual[y].length; x++) {
      if (pecaAtual[y][x]) {
        const px = posicao.x + x;
        const py = posicao.y + y;
        ctx.fillStyle = 'white';
        ctx.fillRect(px * bloco, py * bloco, bloco, bloco);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(px * bloco, py * bloco, bloco, bloco);
      }
    }
  }
}

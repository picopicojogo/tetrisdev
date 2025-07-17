/**
 * canvas.js
 *
 * Módulo responsável pela lógica visual e estrutural do tabuleiro.
 * Inclui funções para desenhar o jogo, gerar peças, verificar colisões,
 * fixar peças no tabuleiro e eliminar linhas completas.
 */
// Dimensões do tabuleiro
export const COLUNAS = 10;
export const LINHAS = 20;

/**
 * Peças disponíveis no jogo
 */
const PECAS = [
  [[1, 1, 1, 1]],                  // I
  [[1, 1], [1, 1]],                // O
  [[0, 1, 0], [1, 1, 1]],          // T
  [[1, 0, 0], [1, 1, 1]],          // J
  [[0, 0, 1], [1, 1, 1]],          // L
  [[0, 1, 1], [1, 1, 0]],          // S
  [[1, 1, 0], [0, 1, 1]]           // Z
];

/**
 * Gera uma peça aleatória
 */
export function gerarPecaAleatoria() {
  const index = Math.floor(Math.random() * PECAS.length);
  return PECAS[index];
}

/**
 * Verifica colisão entre a peça e o tabuleiro
 */
export function verificarColisao(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const novoX = posicao.x + x;
        const novoY = posicao.y + y;
        if (
          novoX < 0 ||
          novoX >= COLUNAS ||
          novoY >= LINHAS ||
          (novoY >= 0 && tabuleiro[novoY][novoX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Fixa a peça ao tabuleiro quando colide
 */
export function fixarPeca(tabuleiro, peca, posicao) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const nx = posicao.x + x;
        const ny = posicao.y + y;
        if (ny >= 0 && ny < LINHAS && nx >= 0 && nx < COLUNAS) {
          tabuleiro[ny][nx] = 1;
        }
      }
    }
  }
}

/**
 * Elimina linhas completas do tabuleiro
 * Retorna o número de linhas eliminadas
 */
export function eliminarLinhas(tabuleiro) {
  let eliminadas = 0;
  for (let y = LINHAS - 1; y >= 0; y--) {
    if (tabuleiro[y].every(val => val)) {
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(Array(COLUNAS).fill(0));
      eliminadas++;
      y++; // Reanalisa esta linha após inserir
    }
  }
  return eliminadas;
}

/**
 * Desenha o tabuleiro e a peça atual
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);

  // Desenha peças fixas
  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      if (tabuleiro[y][x]) {
        desenharCelula(ctx, x, y, '#ff00ff');
      }
    }
  }

  // Desenha peça atual
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        desenharCelula(ctx, posicao.x + x, posicao.y + y, '#00ffff');
      }
    }
  }
}

/**
 * Desenha a próxima peça
 */
export function desenharProxima(ctx, peca) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        desenharCelula(ctx, x, y, '#00ffcc');
      }
    }
  }
}

/**
 * Desenha uma célula no canvas
 */
function desenharCelula(ctx, x, y, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(x * 20, y * 20, 20, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x * 20, y * 20, 20, 20);
}

/**
 * Aplica efeitos visuais ao tabuleiro (flash ou vibração)
 */
export function aplicarEfeitosTabuleiro() {
  const config = carregarDefinicoesAcessibilidade();
  const board = document.getElementById('board');

  if (config.flash) {
    board.classList.add('flash');
    setTimeout(() => board.classList.remove('flash'), 300);
  }

  if (config.vibracao) {
    board.classList.add('vibrar');
    setTimeout(() => board.classList.remove('vibrar'), 300);
  }
}

/**
 * Carrega definições de acessibilidade gravadas pelo jogador
 * Exemplo: { flash: true, somGeral: true, vibracao: true }
 */
export function carregarDefinicoesAcessibilidade() {
  const def = localStorage.getItem('acessibilidade');
  return def ? JSON.parse(def) : {
    flash: true,
    somGeral: true,
    vibracao: true
  };
}

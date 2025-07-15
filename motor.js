// Módulo de lógica do jogo: peças, colisões e tabuleiro
export const COLUNAS = 10;
export const LINHAS = 20;
export const TAMANHO_BLOCO = 24;

export const CORES = [
  null, "#FF3CAC", "#784BA0", "#29FFC6",
  "#F8FF00", "#00F0FF", "#FFB65C", "#FF4E50"
];

export const FORMATOS = [
  [],
  [[1,1,1,1]],
  [[2,2],[2,2]],
  [[0,3,0],[3,3,3]],
  [[4,4,0],[0,4,4]],
  [[0,5,5],[5,5,0]],
  [[6,0,0],[6,6,6]],
  [[0,0,7],[7,7,7]]
];

// Cria matriz de tabuleiro
export function criarMatriz(largura, altura) {
  return Array.from({ length: altura }, () => Array(largura).fill(0));
}

// Roda matriz 90º
export function rodar(matriz, direcao) {
  const transposta = matriz[0].map((_, i) => matriz.map(l => l[i]));
  return direcao > 0 ? transposta.reverse() : transposta.map(r => r.reverse());
}

// Verifica colisão com tabuleiro
export function verificarColisao(tabuleiro, peça, posição) {
  return peça.some((linha, y) =>
    linha.some((valor, x) =>
      valor !== 0 &&
      (tabuleiro[y + posição.y]?.[x + posição.x]) !== 0
    )
  );
}

// Fundir a peça ao tabuleiro
export function fundirPeca(tabuleiro, peça, posição) {
  peça.forEach((linha, y) =>
    linha.forEach((valor, x) => {
      if (valor !== 0) {
        tabuleiro[y + posição.y][x + posição.x] = valor;
      }
    })
  );
}

// Gera peça aleatória
export function gerarPeça() {
  const i = Math.floor(Math.random() * (FORMATOS.length - 1)) + 1;
  return FORMATOS[i].map(r => [...r]);
}

// Limpa linhas preenchidas e dá pontuação
export function limparLinhas(tabuleiro, nivelAtual) {
  let linhasLimpas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(valor => valor !== 0)) {
      const linhaVazia = Array(COLUNAS).fill(0);
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(linhaVazia);
      linhasLimpas++;
      y++; // reavalia linha atual depois de remoção
    }
  }

  const novaPontuação = linhasLimpas * 100 * nivelAtual;
  const progressoNível = linhasLimpas;

  return { novaPontuação, progressoNível };
}

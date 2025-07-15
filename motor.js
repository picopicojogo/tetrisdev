// Módulo principal da lógica do jogo: peças, tabuleiro e pontuação

// Dimensões do tabuleiro e dos blocos
export const COLUNAS = 10;
export const LINHAS = 20;
export const TAMANHO_BLOCO = 32;

// Cores das peças Tetris
export const CORES = [
  null,
  "#FF3CAC", // Rosa neon
  "#784BA0", // Roxo suave
  "#29FFC6", // Verde água neon
  "#F8FF00", // Amarelo neon
  "#00F0FF", // Azul ciano
  "#FFB65C", // Laranja pastel
  "#FF4E50"  // Vermelho coral
];

// Formatos das peças Tetris
export const FORMATOS = [
  [],
  [[1,1,1,1]],                     // I
  [[2,2],[2,2]],                   // O
  [[0,3,0],[3,3,3]],               // T
  [[4,4,0],[0,4,4]],               // S
  [[0,5,5],[5,5,0]],               // Z
  [[6,0,0],[6,6,6]],               // J
  [[0,0,7],[7,7,7]]                // L
];

// Cria uma matriz vazia com dimensões dadas (largura × altura)
export function criarMatriz(largura, altura) {
  return Array.from({ length: altura }, () => Array(largura).fill(0));
}

// Roda uma matriz 90º no sentido indicado
export function rodar(matriz, direcao) {
  const transposta = matriz[0].map((_, i) => matriz.map(linha => linha[i]));
  return direcao > 0
    ? transposta.reverse()             // sentido horário
    : transposta.map(l => l.reverse()); // sentido anti-horário
}

// Verifica se há colisão entre a peça e o tabuleiro na posição atual
export function verificarColisao(tabuleiro, peça, posição) {
  return peça.some((linha, y) =>
    linha.some((valor, x) =>
      valor !== 0 &&
      (tabuleiro[y + posição.y] && tabuleiro[y + posição.y][x + posição.x]) !== 0
    )
  );
}

// Fundir a peça no tabuleiro após colisão
export function fundirPeca(tabuleiro, peça, posição) {
  peça.forEach((linha, y) =>
    linha.forEach((valor, x) => {
      if (valor !== 0) {
        tabuleiro[y + posição.y][x + posição.x] = valor;
      }
    })
  );
}

// Cria uma nova peça de forma aleatória
export function gerarPeça() {
  const índice = Math.floor(Math.random() * (FORMATOS.length - 1)) + 1;
  return FORMATOS[índice].map(linha => [...linha]); // cópia profunda
}

// Limpa as linhas completas e calcula nova pontuação
export function limparLinhas(tabuleiro, nívelAtual) {
  let linhasLimpas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(valor => valor !== 0)) {
      const linhaVazia = tabuleiro.splice(y, 1)[0].fill(0);
      tabuleiro.unshift(linhaVazia);
      linhasLimpas++;
      y++; // reposiciona o índice
    }
  }

  let novaPontuação = linhasLimpas * 100 * nívelAtual;
  let progressoNível = linhasLimpas;

  return { novaPontuação, progressoNível };
}
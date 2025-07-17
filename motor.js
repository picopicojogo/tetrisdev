// Dimensões padrão do tabuleiro
export const COLUNAS = 10;
export const LINHAS = 20;

// Lista de cores associadas a cada tipo de peça
export const CORES = [
  null,
  "#FF3CAC", // rosa forte
  "#784BA0", // roxo
  "#29FFC6", // verde-água
  "#F8FF00", // amarelo
  "#00F0FF", // azul-claro
  "#FFB65C", // laranja
  "#FF4E50"  // vermelho-rosado
];

// Lista de formatos das peças do jogo
export const FORMATOS = [
  [],
  [[1,1,1,1]],                      // Peça I
  [[2,2],[2,2]],                    // Peça O
  [[0,3,0],[3,3,3]],                // Peça T
  [[4,4,0],[0,4,4]],                // Peça S
  [[0,5,5],[5,5,0]],                // Peça Z
  [[6,0,0],[6,6,6]],                // Peça L
  [[0,0,7],[7,7,7]]                 // Peça J
];

/**
 * Cria uma matriz de tabuleiro com a dimensão especificada
 * @param {number} largura - número de colunas
 * @param {number} altura - número de linhas
 * @returns {number[][]} matriz preenchida com zeros
 */
export const criarMatriz = (largura, altura) =>
  Array.from({ length: altura }, () => Array(largura).fill(0));

/**
 * Roda uma matriz no sentido indicado
 * @param {number[][]} matriz - peça a rodar
 * @param {number} direcao - +1 sentido horário, -1 sentido anti-horário
 * @returns {number[][]} nova matriz rodada
 */
export const rodar = (matriz, direcao) => {
  const transposta = matriz[0].map((_, i) => matriz.map(linha => linha[i]));
  return direcao > 0 ? transposta.reverse() : transposta.map(linha => linha.reverse());
};

/**
 * Verifica se há colisão entre uma peça e o tabuleiro
 * @param {number[][]} tabuleiro - matriz atual do tabuleiro
 * @param {number[][]} peca - matriz da peça
 * @param {{x: number, y: number}} posicao - posição da peça
 * @returns {boolean} verdadeiro se houver colisão
 */
export const verificarColisao = (tabuleiro, peca, posicao) =>
  peca.some((linha, y) =>
    linha.some((valor, x) =>
      valor !== 0 &&
      tabuleiro[y + posicao.y]?.[x + posicao.x] !== 0
    )
  );

/**
 * Insere a peça no tabuleiro, fixando-a na posição indicada
 * @param {number[][]} tabuleiro - matriz atual do tabuleiro
 * @param {number[][]} peca - matriz da peça
 * @param {{x: number, y: number}} posicao - posição da peça
 */
export const fundirPeca = (tabuleiro, peca, posicao) =>
  peca.forEach((linha, y) =>
    linha.forEach((valor, x) => {
      if (valor !== 0) {
        tabuleiro[y + posicao.y][x + posicao.x] = valor;
      }
    })
  );

/**
 * Gera uma peça aleatória a partir da lista de formatos
 * @returns {number[][]} nova peça
 */
export const gerarPeca = () =>
  FORMATOS[Math.floor(Math.random() * (FORMATOS.length - 1)) + 1].map(linha => [...linha]);

/**
 * Verifica e limpa linhas completas do tabuleiro
 * @param {number[][]} tabuleiro - matriz atual do tabuleiro
 * @param {number} nivelAtual - nível atual do jogador
 * @returns {{novaPontuacao: number, progressoNivel: number}} resultado da limpeza
 */
export const limparLinhas = (tabuleiro, nivelAtual) => {
  let linhasLimpas = 0;

  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(celula => celula !== 0)) {
      const linhaVazia = Array(COLUNAS).fill(0);
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(linhaVazia);
      linhasLimpas++;
      y++; // Reavalia a linha após reposição
    }
  }

  const novaPontuacao = linhasLimpas * 100 * nivelAtual;
  const progressoNivel = linhasLimpas;

  return { novaPontuacao, progressoNivel };
};

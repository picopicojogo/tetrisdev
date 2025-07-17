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

// Lista de peças disponíveis
export const pecasDisponiveis = [
  [[1, 1], [1, 1]],                    // Quadrado
  [[0, 2, 0], [2, 2, 2]],              // T
  [[3, 3, 0], [0, 3, 3]],              // S
  [[0, 4, 4], [4, 4, 0]],              // Z
  [[5, 5, 5, 5]],                      // I
  [[6, 0, 0], [6, 6, 6]],              // L
  [[0, 0, 7], [7, 7, 7]]               // J
];

// Gera uma peça aleatória
export function gerarPecaAleatoria() {
  const aleatoria = Math.floor(Math.random() * pecasDisponiveis.length);
  return pecasDisponiveis[aleatoria];
}

// Verifica colisão entre peça e tabuleiro/limites
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

// Fixa a peça no tabuleiro após colisão
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

// Elimina linhas completas
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

// Desenha a próxima peça no canvas lateral
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

// Desenha o estado atual do tabuleiro e da peça em movimento
export function desenharJogo(ctx, width, height, tabuleiro, pecaAtual, posicao) {
  const bloco = 20;
  ctx.clearRect(0, 0, width, height);

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

// Acessibilidade e menu de opções
function carregarDefinicoesAcessibilidade() {
  const padrao = {
    flash: true,
    vibracao: true,
    animacoes: true,
    sonsAgudos: true,
    somGeral: true
  };
  const guardado = localStorage.getItem('acessibilidade');
  return guardado ? JSON.parse(guardado) : padrao;
}

function guardarDefinicoesAcessibilidade() {
  const definicoes = {
    flash: document.getElementById('toggle-flash').checked,
    vibracao: document.getElementById('toggle-vibracao').checked,
    animacoes: document.getElementById('toggle-animacoes').checked,
    sonsAgudos: document.getElementById('toggle-sonos-agudos').checked,
    somGeral: document.getElementById('toggle-som').checked
  };
  localStorage.setItem('acessibilidade', JSON.stringify(definicoes));
}

// Abertura e fecho do menu
document.getElementById('btn-opcoes').onclick = () => {
  const config = carregarDefinicoesAcessibilidade();
  document.getElementById('toggle-flash').checked = config.flash;
  document.getElementById('toggle-vibracao').checked = config.vibracao;
  document.getElementById('toggle-animacoes').checked = config.animacoes;
  document.getElementById('toggle-sonos-agudos').checked = config.sonsAgudos;
  document.getElementById('toggle-som').checked = config.somGeral;
  document.getElementById('menu-opcoes').classList.remove('escondido');
};

document.getElementById('fechar-opcoes').onclick = () => {
  guardarDefinicoesAcessibilidade();
  document.getElementById('menu-opcoes').classList.add('escondido');
};

// Uso das definições no jogo
export function aplicarEfeitosTabuleiro() {
  const config = carregarDefinicoesAcessibilidade();

  if (config.vibracao) {
    const tabuleiro = document.getElementById('board');
    tabuleiro.classList.add('vibrar');
    setTimeout(() => tabuleiro.classList.remove('vibrar'), 300);
  }

  if (config.flash) {
    const tabuleiro = document.getElementById('board');
    tabuleiro.classList.add('flash');
    setTimeout(() => tabuleiro.classList.remove('flash'), 300);
  }
}

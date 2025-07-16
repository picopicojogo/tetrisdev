// Importa módulos essenciais para o funcionamento do jogo
import { COLUNAS, LINHAS, verificarColisao } from './motor.js';
import { desenharJogo, desenharProxima } from './canvas.js';
import {
  tocarSomColidir,
  tocarSomPerdeu,
  iniciarMusicaFundo,
  pararMusicaFundo
} from './audio.js';
import {
  configurarControlos,
  moverPeca,
  rodarPeca,
  descerPeca,
  quedaInstantanea
} from './controlos.js';

// Referências aos elementos canvas
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

// Define tamanho dos blocos e dimensões dos canvas
const tamanhoBloco = 20;
boardCanvas.width = COLUNAS * tamanhoBloco;
boardCanvas.height = LINHAS * tamanhoBloco;
nextCanvas.width = 80;
nextCanvas.height = 80;

// Variáveis principais do estado do jogo
let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let pontuacao = 0;
let nivel = 1;
let totalLinhasEliminadas = 0;
let intervaloTempo = 600;

// Variáveis do cronómetro
let segundos = 0;
let cronometroID = null;

// Inicia o cronómetro e actualiza o elemento #time
function iniciarCronometro() {
  cronometroID = setInterval(() => {
    segundos++;
    const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
    const ss = String(segundos % 60).padStart(2, '0');
    document.getElementById('time').textContent = `${mm}:${ss}`;
  }, 1000);
}

// Para o cronómetro
function pararCronometro() {
  clearInterval(cronometroID);
  cronometroID = null;
}

// Reinicia o cronómetro para 00:00
function reiniciarCronometro() {
  segundos = 0;
  document.getElementById('time').textContent = '00:00';
}

// Cria um tabuleiro vazio (matriz de zeros)
function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

// Gera uma peça aleatória a partir das formas disponíveis
function gerarPecaAleatoria() {
  const pecas = [
    [[1, 1], [1, 1]], // Quadrado
    [[0, 2, 0], [2, 2, 2]], // T
    [[3, 3, 0], [0, 3, 3]], // S
    [[0, 4, 4], [4, 4, 0]], // Z
    [[5, 5, 5, 5]], // I
    [[6, 0, 0], [6, 6, 6]], // L
    [[0, 0, 7], [7, 7, 7]]  // J
  ];
  return pecas[Math.floor(Math.random() * pecas.length)];
}

// Desenha o estado atual do jogo e da próxima peça
function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Elimina linhas completas do tabuleiro e retorna quantas foram removidas
function eliminarLinhas(tabuleiro) {
  let linhasEliminadas = 0;
  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(val => val !== 0)) {
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(Array(COLUNAS).fill(0));
      linhasEliminadas++;
      y++;
    }
  }
  return linhasEliminadas;
}

// Actualiza o estado do jogo a cada intervalo
function atualizar() {
  const novaY = posicao.y + 1;
  if (!verificarColisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  } else {
    fixarPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();
    pontuacao += 10;

    const eliminadas = eliminarLinhas(tabuleiro);
    if (eliminadas > 0) {
      pontuacao += eliminadas * 100;
      totalLinhasEliminadas += eliminadas;

      // Animação de celebração
      boardCanvas.classList.add('flash');
      setTimeout(() => boardCanvas.classList.remove('flash'), 300);

      const celebracao = document.getElementById('celebracao');
      celebracao.style.display = 'block';
      celebracao.style.animation = 'subirCelebracao 1s ease-out forwards';
      setTimeout(() => {
        celebracao.style.display = 'none';
        celebracao.style.animation = '';
      }, 1000);

      // Atualiza nível conforme linhas eliminadas
      const novoNivel = Math.floor(totalLinhasEliminadas / 5) + 1;
      if (novoNivel > nivel) {
        nivel = novoNivel;
        document.getElementById('level').textContent = nivel;
        clearInterval(intervalo);
        intervaloTempo = Math.max(150, intervaloTempo - 50);
        intervalo = setInterval(atualizar, intervaloTempo);
      }
    }

    document.getElementById('score').textContent = pontuacao;
    pecaAtual = proximaPeca;
    proximaPeca = gerarPecaAleatoria();
    posicao = { x: 3, y: 0 };

    // Verifica se o jogador perdeu
    if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      intervalo = null;
      pararCronometro();
      document.getElementById('modal').classList.add('show');
    }
  }
  desenhar();
}

// Fixa a peça no tabuleiro após colisão
function fixarPeca(tab, peca, pos) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const px = pos.x + x;
        const py = pos.y + y;
        if (py >= 0 && py < LINHAS && px >= 0 && px < COLUNAS) {
          tab[py][px] = peca[y][x];
        }
      }
    }
  }
}

// Liga os controlos do jogador ao jogo
configurarControlos(
  direcao => {
    moverPeca(direcao, tabuleiro, pecaAtual, posicao);
    desenhar();
  },
  () => {
    pecaAtual = rodarPeca(1, pecaAtual, tabuleiro, posicao);
    desenhar();
  },
  () => {
    descerPeca(tabuleiro, pecaAtual, posicao);
    desenhar();
  },
  () => {
    document.getElementById('pauseBtn').click();
  },
  () => {
    quedaInstantanea(tabuleiro, pecaAtual, posicao);
    desenhar();
  }
);

// Botão Start
document.getElementById('startBtn').addEventListener('click', () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, intervaloTempo);
    iniciarMusicaFundo();
    iniciarCronometro();
  }
});

// Botão Pause
document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
  pararCronometro();
});

// Botão Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  tabuleiro = criarTabuleiroVazio();
  pecaAtual = gerarPecaAleatoria();
  proximaPeca = gerarPecaAleatoria();
  posicao = { x: 3, y: 0 };
  pontuacao = 0;
  nivel = 1;
  totalLinhasEliminadas = 0;
  intervaloTempo = 600;
  document.getElementById('score').textContent = 0;
  document.getElementById('level').textContent = nivel;
  reiniciarCronometro();
  desenhar();
});

// Alterna entre o ligar e desligar a música de fundo
document.getElementById('toggle-sound').addEventListener('click', () => {
  const audio = document.getElementById('musica-fundo');
  const botao = document.getElementById('toggle-sound');
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    botao.textContent = '🔊 Som ligado';
  } else {
    audio.pause();
    botao.textContent = '🔇 Som desligado';
  }
});

// Abre o modal para guardar pontuação
document.getElementById('save-score-btn').addEventListener('click', () => {
  const nomeAnterior = localStorage.getItem('ultimoJogador');
  if (nomeAnterior) {
    document.getElementById('player-name').value = nomeAnterior;
  }
  document.getElementById('modal').classList.add('show');
});

// Confirma e guarda pontuação no ranking local
document.getElementById('confirmSave').addEventListener('click', () => {
  const nome = document.getElementById('player-name').value.trim();
  if (nome) {
    localStorage.setItem('ultimoJogador', nome);
    const pontuacaoAtual = parseInt(document.getElementById('score').textContent, 10);
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-PT');

    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ nome, pontuacao: pontuacaoAtual, data });
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    const top10 = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(top10));
    atualizarRankingVisual(top10);

    document.getElementById('modal').classList.remove('show');
    document.getElementById('player-name').value = '';
  }
});

// Alterna visualização do ranking
document.getElementById('top10Btn')?.addEventListener('click', () => {
  const ranking = document.getElementById('ranking-container');
  ranking.style.display = ranking.style.display === 'none' || !ranking.style.display ? 'block' : 'none';
});

// Limpa o ranking guardado
document.getElementById('clear-ranking-btn')?.addEventListener('click', () => {
  localStorage.removeItem('ranking');
  atualizarRankingVisual([]);
});

// Ao carregar a página, desenha o tabuleiro e carrega o ranking
window.addEventListener('DOMContentLoaded', () => {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  atualizarRankingVisual(ranking);
  reiniciarCronometro();
  desenhar();
});

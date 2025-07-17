// cerebro.js — o CPU do jogo
import {
  COLUNAS, LINHAS, criarMatriz, rodar, verificarColisao, fundirPeca, gerarPeca
} from './motor.js';
import {
  desenharJogo, desenharProxima, atualizarPontuacao,
  mostrarModalFim, guardarPontuacao, carregarRankingGuardado
} from './canvas.js';
import {
  tocarSomRodar, tocarSomColidir, tocarSomPerdeu,
  iniciarMusicaFundo, pararMusicaFundo
} from './audio.js';

// Canvas e contexto
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

// Dimensões
boardCanvas.width = COLUNAS * 24;
boardCanvas.height = LINHAS * 24;

// Estado do jogo
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let pontuacao = 0;
let nivel = 1;

// Funções principais
function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fundirPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

    // Simulação de cálculo de pontos (podes ajustar)
    pontuacao += 100 * nivel;
    atualizarPontuacao(pontuacao, nivel);

    [pecaAtual, proximaPeca] = [proximaPeca, gerarPeca()];
    posicao = { x: 3, y: 0 };

    if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      mostrarModalFim(pontuacao);
    }
  }

  desenhar();
}

// Controlo por teclado
document.addEventListener('keydown', e => {
  if (!intervalo) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();

  const { x, y } = posicao;
  if (e.key === 'ArrowLeft' && !verificarColisao(tabuleiro, pecaAtual, { x: x - 1, y })) posicao.x--;
  if (e.key === 'ArrowRight' && !verificarColisao(tabuleiro, pecaAtual, { x: x + 1, y })) posicao.x++;
  if (e.key === 'ArrowDown' && !verificarColisao(tabuleiro, pecaAtual, { x, y: y + 1 })) posicao.y++;
  if (e.key === 'ArrowUp') {
    const rodada = rodar(pecaAtual, 1);
    if (!verificarColisao(tabuleiro, rodada, posicao)) {
      pecaAtual = rodada;
      tocarSomRodar();
    }
  }

  desenhar();
});

// Botões
document.getElementById('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarMusicaFundo();
  }
};

document.getElementById('pauseBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
};

document.getElementById('resetBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  [pecaAtual, proximaPeca] = [gerarPeca(), gerarPeca()];
  posicao = { x: 3, y: 0 };
  pontuacao = 0;
  nivel = 1;
  atualizarPontuacao(pontuacao, nivel);
  desenhar();
};

document.getElementById('toggle-sound').onclick = () => {
  const audio = document.getElementById('musica-fundo');
  const btn = document.getElementById('toggle-sound');
  audio.paused ? audio.play() : audio.pause();
  btn.textContent = audio.paused ? '🔇 Som desligado' : '🔊 Som ligado';
  btn.classList.toggle('active', !audio.paused);
};

// Modal e pontuação
document.getElementById('confirmSave').onclick = () => guardarPontuacao(pontuacao);
document.getElementById('cancelSave').onclick = () => document.getElementById('modal').classList.remove('show');

// Início
carregarRankingGuardado();
desenhar();

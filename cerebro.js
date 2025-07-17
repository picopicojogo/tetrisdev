// cerebro.js — o CPU do jogo
import {
  COLUNAS, LINHAS,
  criarMatriz, rodar,
  verificarColisao, fundirPeca,
  gerarPeca
} from './motor.js';

import {
  desenharJogo, desenharProxima,
  atualizarPontuacao, mostrarModalFim,
  guardarPontuacao, carregarRankingGuardado
} from './canvas.js';

import {
  tocarSomRodar, tocarSomColidir,
  tocarSomPerdeu, iniciarMusicaFundo,
  pararMusicaFundo
} from './audio.js';

// Obtenção do contexto dos canvas principais
const board = document.getElementById('board');
const next = document.getElementById('next');
const ctxBoard = board.getContext('2d');
const ctxNext = next.getContext('2d');

// Configuração das dimensões do canvas
board.width = COLUNAS * 24;
board.height = LINHAS * 24;
next.width = 80;
next.height = 80;

// Estado interno do jogo
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let pontuacao = 0;
let nivel = 1;

// Renderização do estado atual do jogo
function desenhar() {
  desenharJogo(ctxBoard, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(ctxNext, proximaPeca);
}

// Função principal que atualiza o jogo em cada ciclo
function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fundirPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

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

// Evento de teclado para controlo do jogador
document.addEventListener('keydown', e => {
  if (!intervalo) return;
  const tecla = e.key;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(tecla)) e.preventDefault();

  const { x, y } = posicao;

  if (tecla === 'ArrowLeft' && !verificarColisao(tabuleiro, pecaAtual, { x: x - 1, y })) posicao.x--;
  if (tecla === 'ArrowRight' && !verificarColisao(tabuleiro, pecaAtual, { x: x + 1, y })) posicao.x++;
  if (tecla === 'ArrowDown' && !verificarColisao(tabuleiro, pecaAtual, { x, y: y + 1 })) posicao.y++;
  if (tecla === 'ArrowUp') {
    const rodada = rodar(pecaAtual, 1);
    if (!verificarColisao(tabuleiro, rodada, posicao)) {
      pecaAtual = rodada;
      tocarSomRodar();
    }
  }

  desenhar();
});

// Botão para iniciar o jogo
document.getElementById('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarMusicaFundo();
  }
};

// Botão para pausar o jogo
document.getElementById('pauseBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
};

// Botão para reiniciar o jogo
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

// Botão de alternância de som
document.getElementById('toggle-sound').onclick = () => {
  const audio = document.getElementById('musica-fundo');
  const btn = document.getElementById('toggle-sound');
  if (audio.paused) {
    audio.play();
    btn.textContent = '🔊 Som ligado';
  } else {
    audio.pause();
    btn.textContent = '🔇 Som desligado';
  }
  btn.classList.toggle('active', !audio.paused);
};

// Guarda pontuação no final do jogo
document.getElementById('confirmSave').onclick = () => guardarPontuacao(pontuacao);
document.getElementById('cancelSave').onclick = () => document.getElementById('modal').classList.remove('show');

// Inicialização ao carregar a página
carregarRankingGuardado();
desenhar();

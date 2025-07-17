// cerebro.js — o CPU do jogo
import {
  COLUNAS, LINHAS,
  criarMatriz, rodar,
  verificarColisao, fundirPeca,
  gerarPeca, limparLinhas
} from './motor.js';

import {
  desenharJogo, desenharProxima,
  atualizarPontuacao, atualizarTempo,
  mostrarModalFim, guardarPontuacao,
  carregarRankingGuardado
} from './canvas.js';

import {
  tocarSomRodar, tocarSomColidir,
  tocarSomPerdeu, iniciarMusicaFundo,
  pararMusicaFundo
} from './audio.js';

import {
  moverPeca, rodarPeca, descerPeca,
  configurarControlos
} from './controlos.js';

// Contexto dos canvas principais
const board = document.getElementById('board');
const next = document.getElementById('next');
const ctxBoard = board.getContext('2d');
const ctxNext = next.getContext('2d');

// Dimensões dos canvas
board.width = COLUNAS * 24;
board.height = LINHAS * 24;
next.width = 80;
next.height = 80;

// Estado do jogo
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let segundos = 0;
let tempoEl = document.getElementById("time");
let tempoIntervalo = null;
let pontuacao = 0;
let nivel = 1;

// Renderização atual
function desenhar() {
  desenharJogo(ctxBoard, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(ctxNext, proximaPeca);
}

// Atualiza o estado do jogo (descida automática ou após fixar peça)
function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fundirPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

    // Limpa linhas e atualiza pontuação
    const { novaPontuacao, progressoNivel } = limparLinhas(tabuleiro, nivel);
    pontuacao += novaPontuacao;
    nivel += progressoNivel;
    atualizarPontuacao(pontuacao, nivel);

    [pecaAtual, proximaPeca] = [proximaPeca, gerarPeca()];
    posicao = { x: 3, y: 0 };

    if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      clearInterval(tempoIntervalo);
      mostrarModalFim(pontuacao);
    }
  }

  desenhar();
}

// Descida instantânea até à colisão
function quedaInstantanea() {
  while (!verificarColisao(tabuleiro, pecaAtual, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
  atualizar();
}

// Pausa o jogo
function pausarJogo() {
  clearInterval(intervalo);
  clearInterval(tempoIntervalo);
  intervalo = null;
  tempoIntervalo = null;
  pararMusicaFundo();
}

// Inicia cronómetro visual
function iniciarTempo() {
  tempoIntervalo = setInterval(() => {
    segundos++;
    atualizarTempo(tempoEl, segundos);
  }, 1000);
}

// Inicia o jogo
document.getElementById('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarTempo();
    iniciarMusicaFundo();
  }
};

// Pausa o jogo
document.getElementById('pauseBtn').onclick = () => pausarJogo();

// Reinicia o jogo
document.getElementById('resetBtn').onclick = () => {
  pausarJogo();

  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  [pecaAtual, proximaPeca] = [gerarPeca(), gerarPeca()];
  posicao = { x: 3, y: 0 };
  segundos = 0;
  pontuacao = 0;
  nivel = 1;
  atualizarPontuacao(pontuacao, nivel);
  atualizarTempo(tempoEl, segundos);
  desenhar();
};

// Alternância do som de fundo
document.getElementById('toggle-sound').onclick = () => {
  const audio = document.getElementById('musica-fundo');
  const btn = document.getElementById('toggle-sound');
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    btn.textContent = '🔊 Som ligado';
  } else {
    audio.pause();
    btn.textContent = '🔇 Som desligado';
  }
  btn.classList.toggle('active', !audio.paused);
};

// Guarda pontuação final
document.getElementById('confirmSave').onclick = () => guardarPontuacao(pontuacao);
document.getElementById('cancelSave').onclick = () =>
  document.getElementById('modal').classList.remove('show');

// Liga controlos do jogador
configurarControlos(
  direcao => moverPeca(direcao, tabuleiro, pecaAtual, posicao),
  dir => pecaAtual = rodarPeca(dir, pecaAtual, tabuleiro, posicao),
  () => {
    const travou = descerPeca(tabuleiro, pecaAtual, posicao);
    if (travou) atualizar();
    else desenhar();
  },
  quedaInstantanea,
  pausarJogo
);

// Estado inicial
carregarRankingGuardado();
atualizarTempo(tempoEl, segundos);
desenhar();

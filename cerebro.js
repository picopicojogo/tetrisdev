// cerebro.js — o CPU do jogo
import {
  COLUNAS, LINHAS,
  criarMatriz, rodar,
  verificarColisao, fundirPeca,
  gerarPeca, limparLinhas
} from './motor.js';

import {
  configurarCanvas,
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

/* Inicializa os canvas e contexto gráfico */
const { ctxBoard, ctxNext, board, next } = configurarCanvas();
const tempoEl = document.getElementById("time");

/* Estado do jogo */
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let tempoIntervalo = null;
let segundos = 0;
let pontuacao = 0;
let nivel = 1;

/* Desenha o jogo na tela */
function desenhar() {
  desenharJogo(ctxBoard, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(ctxNext, proximaPeca);
}

/* Processa o ciclo de atualização */
function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fundirPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

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
      return;
    }
  }

  desenhar();
}

/* Realiza descida rápida da peça */
function quedaInstantanea() {
  while (!verificarColisao(tabuleiro, pecaAtual, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
  atualizar();
}

/* Pausa o jogo e o tempo */
function pausarJogo() {
  clearInterval(intervalo);
  clearInterval(tempoIntervalo);
  intervalo = null;
  tempoIntervalo = null;
  pararMusicaFundo();
}

/* Inicia o cronómetro */
function iniciarTempo() {
  tempoIntervalo = setInterval(() => {
    segundos++;
    atualizarTempo(tempoEl, segundos);
  }, 1000);
}

/* Inicia a partida */
document.getElementById('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarTempo();
    iniciarMusicaFundo();
  }
};

/* Pausa manual */
document.getElementById('pauseBtn').onclick = () => {
  pausarJogo();
};

/* Reinicia o estado do jogo */
document.getElementById('resetBtn').onclick = () => {
  pausarJogo();
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  [pecaAtual, proximaPeca] = [gerarPeca(), gerarPeca()];
  posicao = { x: 3, y: 0 };
  pontuacao = 0;
  nivel = 1;
  segundos = 0;
  atualizarPontuacao(pontuacao, nivel);
  atualizarTempo(tempoEl, segundos);
  desenhar();
};

/* Alterna o som de fundo */
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

/* Guarda a pontuação no fim */
document.getElementById('confirmSave').onclick = () => guardarPontuacao(pontuacao);
document.getElementById('cancelSave').onclick = () =>
  document.getElementById('modal')?.classList.remove('show');

/* Liga os controlos de teclado e toque */
configurarControlos(
  direcao => moverPeca(direcao, tabuleiro, pecaAtual, posicao),
  dir => {
    const nova = rodarPeca(dir, pecaAtual, tabuleiro, posicao);
    if (nova !== pecaAtual) {
      pecaAtual = nova;
      desenhar();
    }
  },
  () => {
    const travou = descerPeca(tabuleiro, pecaAtual, posicao);
    if (travou) {
      atualizar();
    } else {
      desenhar();
    }
  },
  quedaInstantanea,
  pausarJogo
);

/* Inicializa visual e ranking */
carregarRankingGuardado();
atualizarTempo(tempoEl, segundos);
desenhar();

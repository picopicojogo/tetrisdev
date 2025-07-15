// Ficheiro principal do jogo que liga todos os ficheiros
import {
  COLUNAS, LINHAS, TAMANHO_BLOCO,
  criarMatriz, gerarPeca, verificarColisao,
  fundirPeca, limparLinhas
} from './motor.js';

import {
  desenharJogo, desenharProxima
} from './canvas.js';

import {
  moverPeca, rodarPeca, descerPeca,
  configurarControlos
} from './controlos.js';

import {
  atualizarPontuacao, atualizarTempo,
  mostrarModalFim, guardarPontuacao, carregarRankingGuardado
} from './ui.js';

import {
  tocarSom, atualizarMusica, alternarSom, somLigado
} from './audio.js';

// Referencias ao DOM
const canvas = document.getElementById("board");
const nextCanvas = document.getElementById("next");
const timeEl = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const pauseBtn = document.getElementById("pauseBtn");
const saveBtn = document.getElementById("save-score-btn");
const toggleSoundBtn = document.getElementById("toggle-sound");

// Estado do jogo
let tabuleiro, pecaAtual, proximaPeca, posicao;
let pontuacao = 0, nivel = 1, progressoNivel = 0;
let dropIntervalo = 1000, dropContador = 0;
let animacaoID = null;
let pausado = false, fimDeJogo = false;
let startTime = null, lastTime = 0;

// Redimensiona o canvas ao ecrã
function redimensionarCanvas() {
  const larguraMax = 400;
  const alturaMax = 600;
  const largura = Math.min(canvas.parentElement.clientWidth, larguraMax);
  const altura = Math.min(canvas.parentElement.clientHeight, alturaMax);
  canvas.width = largura;
  canvas.height = altura;
  nextCanvas.width = largura / 2;
  nextCanvas.height = altura / 2;
}

window.addEventListener("resize", redimensionarCanvas);
window.addEventListener("load", () => {
  redimensionarCanvas();
  carregarRankingGuardado();
});

// Ciclo do jogo
function atualizar(time = 0) {
  if (fimDeJogo || pausado) return;
  if (!startTime) startTime = time;

  const delta = time - lastTime;
  lastTime = time;
  dropContador += delta;

  if (dropContador > dropIntervalo) {
    const colidiu = descerPeca(tabuleiro, pecaAtual, posicao);
    if (colidiu) {
      fundirPeca(tabuleiro, pecaAtual, posicao);
      const { novaPontuacao, progressoNivel: progresso } = limparLinhas(tabuleiro, nivel);
      pontuacao += novaPontuacao;
      progressoNivel += progresso;

      if (progressoNivel >= nivel * 10) {
        nivel++;
        dropIntervalo = Math.max(100, dropIntervalo * 0.8);
      }

      atualizarPontuacao(pontuacao, nivel);
      pecaAtual = proximaPeca;
      proximaPeca = gerarPeca();
      posicao = {
        x: Math.floor(COLUNAS / 2) - Math.floor(pecaAtual[0].length / 2),
        y: 0
      };

      if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
        fimDeJogo = true;
        tocarSom("perdeu");
        mostrarModalFim(pontuacao);
        return;
      }
    }
    dropContador = 0;
  }

  const segundos = Math.floor((time - startTime) / 1000);
  atualizarTempo(timeEl, segundos);
  desenharJogo(canvas.getContext("2d"), canvas.width, canvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCanvas.getContext("2d"), proximaPeca);

  animacaoID = requestAnimationFrame(atualizar);
}

// Inicia novo jogo
function iniciarJogo() {
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  pontuacao = 0;
  nivel = 1;
  progressoNivel = 0;
  dropIntervalo = 1000;
  dropContador = 0;
  pausado = false;
  fimDeJogo = false;
  startTime = null;
  lastTime = 0;

  proximaPeca = gerarPeca();
  pecaAtual = gerarPeca();
  posicao = {
    x: Math.floor(COLUNAS / 2) - Math.floor(pecaAtual[0].length / 2),
    y: 0
  };

  atualizarPontuacao(pontuacao, nivel);
  atualizarMusica();
  animacaoID = requestAnimationFrame(atualizar);
}

// Alternar a pausa
function alternarPausa() {
  pausado = !pausado;
  pauseBtn.textContent = pausado ? "▶ Retomar" : "⏸ Pausar";

  if (pausado) {
    cancelAnimationFrame(animacaoID);
    document.getElementById("musica-fundo").pause();
  } else {
    lastTime = performance.now();
    if (somLigado()) atualizarMusica();
    animacaoID = requestAnimationFrame(atualizar);
  }
}

// Reiniciar
function reiniciarJogo() {
  cancelAnimationFrame(animacaoID);
  document.getElementById("musica-fundo").currentTime = 0;
  iniciarJogo();
}

// Eventos dos botões
startBtn.addEventListener("click", iniciarJogo);
resetBtn.addEventListener("click", reiniciarJogo);
pauseBtn.addEventListener("click", alternarPausa);
toggleSoundBtn.addEventListener("click", alternarSom);
saveBtn.addEventListener("click", () => guardarPontuacao(pontuacao));

// Controlos do jogador
configurarControlos(
  dir => moverPeca(dir, tabuleiro, pecaAtual, posicao),
  dir => { pecaAtual = rodarPeca(dir, pecaAtual, tabuleiro, posicao); },
  () => descerPeca(tabuleiro, pecaAtual, posicao),
  () => alternarPausa()
);

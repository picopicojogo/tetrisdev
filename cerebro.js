// Módulo principal: liga todos os scripts
import {
  COLUNAS, LINHAS, TAMANHO_BLOCO,
  criarMatriz, gerarPeça, verificarColisao,
  fundirPeca, limparLinhas
} from './motor.js';

import {
  desenharJogo, desenharProxima
} from './canvas.js';

import {
  moverPeça, rodarPeça, descerPeça,
  configurarControlos
} from './controlos.js';

import {
  atualizarPontuacao, atualizarTempo,
  mostrarModalFim, guardarPontuacao, carregarRankingGuardado
} from './ui.js';

import {
  tocarSom, atualizarMusica, alternarSom, somLigado
} from './audio.js';

// Referências a elementos do HTML
const canvas = document.getElementById("board");
const nextCanvas = document.getElementById("next");
const timeEl = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const pauseBtn = document.getElementById("pauseBtn");
const saveBtn = document.getElementById("save-score-btn");
const toggleSoundBtn = document.getElementById("toggle-sound");

let tabuleiro, peçaAtual, próximaPeça, posição;
let score = 0, level = 1, progressoNivel = 0;
let dropIntervalo = 1000, dropContador = 0;
let animacaoID = null;
let pausado = false, fimDeJogo = false;
let startTime = null, lastTime = 0;

// Redimensionamento do responsivo
function redimensionarCanvas() {
  const larguraMáxima = 400;
  const larguraDisponível = Math.min(canvas.parentElement.clientWidth, larguraMáxima);
  canvas.width = larguraDisponível;
  canvas.height = larguraDisponível * (LINHAS / COLUNAS);
  nextCanvas.width = larguraDisponível / 2;
  nextCanvas.height = larguraDisponível / 2;
}
window.addEventListener("resize", redimensionarCanvas);
window.addEventListener("load", () => {
  redimensionarCanvas();
  carregarRankingGuardado();
});

// Actualiza jogo a cada frame
function atualizar(time = 0) {
  if (fimDeJogo || pausado) return;
  if (!startTime) startTime = time;

  const delta = time - lastTime;
  lastTime = time;
  dropContador += delta;

  if (dropContador > dropIntervalo) {
    const colidiu = descerPeça(tabuleiro, peçaAtual, posição);
    if (colidiu) {
      fundirPeca(tabuleiro, peçaAtual, posição);
      const { novaPontuação, progressoNível } = limparLinhas(tabuleiro, level);
      score += novaPontuação;
      progressoNivel += progressoNível;

      if (progressoNivel >= level * 10) {
        level++;
        dropIntervalo = Math.max(100, dropIntervalo * 0.8);
      }

      atualizarPontuacao(score, level);
      peçaAtual = próximaPeça;
      próximaPeça = gerarPeça();
      posição = {
        x: Math.floor(COLUNAS / 2) - Math.floor(peçaAtual[0].length / 2),
        y: 0
      };

      if (verificarColisao(tabuleiro, peçaAtual, posição)) {
        fimDeJogo = true;
        tocarSom("perdeu");
        mostrarModalFim(score);
        return;
      }
    }
    dropContador = 0;
  }

  const segundos = Math.floor((time - startTime) / 1000);
  atualizarTempo(timeEl, segundos);
  desenharJogo(canvas.getContext("2d"), canvas.width, canvas.height, tabuleiro, peçaAtual, posição);
  desenharProxima(nextCanvas.getContext("2d"), próximaPeça);

  animacaoID = requestAnimationFrame(atualizar);
}

// Começa um novo jogo
function iniciarJogo() {
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  score = 0;
  level = 1;
  progressoNivel = 0;
  dropIntervalo = 1000;
  dropContador = 0;
  pausado = false;
  fimDeJogo = false;
  startTime = null;
  lastTime = 0;

  próximaPeça = gerarPeça();
  peçaAtual = gerarPeça();
  posição = {
    x: Math.floor(COLUNAS / 2) - Math.floor(peçaAtual[0].length / 2),
    y: 0
  };

  atualizarPontuacao(score, level);
  atualizarMusica();
  animacaoID = requestAnimationFrame(atualizar);
}

// Alterna entre pausa e retoma
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

// Reinicia o jogo do zero
function reiniciarJogo() {
  cancelAnimationFrame(animacaoID);
  document.getElementById("musica-fundo").currentTime = 0;
  iniciarJogo();
}

// Liga os eventos aos botões
startBtn.addEventListener("click", iniciarJogo);
resetBtn.addEventListener("click", reiniciarJogo);
pauseBtn.addEventListener("click", alternarPausa);
toggleSoundBtn.addEventListener("click", alternarSom);
saveBtn.addEventListener("click", () => guardarPontuacao(score));

// Liga as funções aos controlos
configurarControlos(
  dir => moverPeça(dir, tabuleiro, peçaAtual, posição),
  dir => { peçaAtual = rodarPeça(dir, peçaAtual, tabuleiro, posição); },
  () => descerPeça(tabuleiro, peçaAtual, posição),
  () => alternarPausa()
);

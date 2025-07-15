// cerebro.js — o CPU do jogo

import { COLUNAS, LINHAS } from './motor.js';
import { desenharJogo, desenharProxima } from './canvas.js';
import {
  tocarSomRodar,
  tocarSomColidir,
  tocarSomPerdeu,
  iniciarMusicaFundo,
  pararMusicaFundo
} from './audio.js';

// Canvas e contexto
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

// Dimensões dos canvases
const tamanhoBloco = 20;
boardCanvas.width = COLUNAS * tamanhoBloco;
boardCanvas.height = LINHAS * tamanhoBloco;
nextCanvas.width = 80;
nextCanvas.height = 80;

// Estado inicial do jogo
let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;

// Funções auxiliares
function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

function gerarPecaAleatoria() {
  const pecas = [
    [[1, 1], [1, 1]],                    // O
    [[0, 2, 0], [2, 2, 2]],              // T
    [[3, 3, 0], [0, 3, 3]],              // S
    [[0, 4, 4], [4, 4, 0]],              // Z
    [[5, 5, 5, 5]],                      // I
    [[6, 0, 0], [6, 6, 6]],              // L
    [[0, 0, 7], [7, 7, 7]]               // J
  ];
  return pecas[Math.floor(Math.random() * pecas.length)];
}

function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Actualização do jogo
function atualizar() {
  const novaY = posicao.y + 1;

  if (!colisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  } else {
    fixarPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

    pecaAtual = proximaPeca;
    proximaPeca = gerarPecaAleatoria();
    posicao = { x: 3, y: 0 };

    if (colisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      intervalo = null;
      alert("💥 Fim de jogo!");
    }
  }

  desenhar();
}

// Verifica a colisão
function colisao(tab, peca, pos) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const novoX = pos.x + x;
        const novoY = pos.y + y;
        if (
          novoX < 0 ||
          novoX >= COLUNAS ||
          novoY >= LINHAS ||
          (novoY >= 0 && tab[novoY]?.[novoX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

// Fixar peça
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

// Iniciar jogo
document.getElementById('startBtn').addEventListener('click', () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarMusicaFundo();
  }
});

// Pausar jogo
document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
});

// Reiniciar jogo
document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  tabuleiro = criarTabuleiroVazio();
  pecaAtual = gerarPecaAleatoria();
  proximaPeca = gerarPecaAleatoria();
  posicao = { x: 3, y: 0 };
  desenhar();
});

// Alternar som de fundo com botão
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

// Controlos por teclado
document.addEventListener('keydown', (e) => {
  if (!intervalo) return;

  if (e.key === 'ArrowLeft') {
    const novaX = posicao.x - 1;
    if (!colisao(tabuleiro, pecaAtual, { x: novaX, y: posicao.y })) {
      posicao.x = novaX;
    }
  }

  if (e.key === 'ArrowRight') {
    const novaX = posicao.x + 1;
    if (!colisao(tabuleiro, pecaAtual, { x: novaX, y: posicao.y })) {
      posicao.x = novaX;
    }
  }

  if (e.key === 'ArrowDown') {
    const novaY = posicao.y + 1;
    if (!colisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
      posicao.y = novaY;
    }
  }

  if (e.key === 'ArrowUp') {
    tocarSomRodar();
  }

  desenhar();
});

// Render inicial
desenhar();

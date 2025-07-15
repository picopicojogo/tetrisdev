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

// Canvas
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

// Dimensões
const tamanhoBloco = 20;
boardCanvas.width = COLUNAS * tamanhoBloco;
boardCanvas.height = LINHAS * tamanhoBloco;
nextCanvas.width = 80;
nextCanvas.height = 80;

// Estado inicial
let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;

// Criar o tabuleiro vazio
function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

// Criar uma peça aleatória
function gerarPecaAleatoria() {
  const pecas = [
    [[1, 1], [1, 1]],
    [[0, 2, 0], [2, 2, 2]],
    [[3, 3, 0], [0, 3, 3]],
    [[0, 4, 4], [4, 4, 0]],
    [[5, 5, 5, 5]],
    [[6, 0, 0], [6, 6, 6]],
    [[0, 0, 7], [7, 7, 7]]
  ];
  return pecas[Math.floor(Math.random() * pecas.length)];
}

// Desenhar tabuleiro e próxima peça
function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Actualizar jogo
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

// Verificar colisão
function colisao(tab, peca, pos) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const novoX = pos.x + x;
        const novoY = pos.y + y;
        if (
          novoX < 0 || novoX >= COLUNAS ||
          novoY >= LINHAS || (novoY >= 0 && tab[novoY]?.[novoX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

// Fixar peça no tabuleiro
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

// Rodar matriz (90° sentido horário)
function rodarMatriz(matriz) {
  const altura = matriz.length;
  const largura = matriz[0].length;
  const nova = [];
  for (let x = 0; x < largura; x++) {
    nova[x] = [];
    for (let y = altura - 1; y >= 0; y--) {
      nova[x].push(matriz[y][x]);
    }
  }
  return nova;
}

// Botões principais
document.getElementById('startBtn').addEventListener('click', () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarMusicaFundo();
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
  tabuleiro = criarTabuleiroVazio();
  pecaAtual = gerarPecaAleatoria();
  proximaPeca = gerarPecaAleatoria();
  posicao = { x: 3, y: 0 };
  desenhar();
});

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
  if (
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
  ) {
    e.preventDefault();
  }

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
    const rodada = rodarMatriz(pecaAtual);
    if (!colisao(tabuleiro, rodada, posicao)) {
      pecaAtual = rodada;
      tocarSomRodar();
    }
  }

  desenhar();
});

// Controlos por toque
const touchZone = document.getElementById('touch-zone');
let startX = null;

touchZone.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
});

touchZone.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - startX;

  if (Math.abs(deltaX) < 10) {
    // Toque leve → rodar
    const rodada = rodarMatriz(pecaAtual);
    if (!colisao(tabuleiro, rodada, posicao)) {
      pecaAtual = rodada;
      tocarSomRodar();
      desenhar();
    }
  } else if (deltaX > 30) {
    // Deslize direita
    const novaX = posicao.x + 1;
    if (!colisao(tabuleiro, pecaAtual, { x: novaX, y: posicao.y })) {
      posicao.x = novaX;
      desenhar();
    }
  } else if (deltaX < -30) {
    // Deslize esquerda
    const novaX = posicao.x - 1;
    if (!colisao(tabuleiro, pecaAtual, { x: novaX, y: posicao.y })) {
      posicao.x = novaX;
      desenhar();
    }
  }
});
// Render inicial do tabuleiro e próxima peça
desenhar();

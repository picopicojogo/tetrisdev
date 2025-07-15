// cerebro.js — o procesador central do jogo

import { COLUNAS, LINHAS } from './motor.js';
import { desenharJogo, desenharProxima } from './canvas.js';

// Referências ao canvas
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

// Dimensões dos blocos e canvases
const tamanhoBloco = 20;
boardCanvas.width = COLUNAS * tamanhoBloco;
boardCanvas.height = LINHAS * tamanhoBloco;
nextCanvas.width = 100;
nextCanvas.height = 100;

// Tabuleiro lógico e peças
let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };

// Ciclo de jogo
let intervalo = null;

// Cria tabuleiro vazio (matriz)
function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

// Cria uma peça aleatória
function gerarPecaAleatoria() {
  const pecas = [
    [[1, 1], [1, 1]],                      // quadrado
    [[0, 2, 0], [2, 2, 2]],                // T
    [[3, 3, 0], [0, 3, 3]],                // S
    [[0, 4, 4], [4, 4, 0]],                // Z
    [[5, 5, 5, 5]],                        // I
    [[6, 0, 0], [6, 6, 6]],                // L
    [[0, 0, 7], [7, 7, 7]]                 // J
  ];
  const aleatoria = Math.floor(Math.random() * pecas.length);
  return pecas[aleatoria];
}

// Atualiza o estado do jogo
function atualizar() {
  const novaY = posicao.y + 1;

  if (!colisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  } else {
    // Colisão das peças
    fixarPeca(tabuleiro, pecaAtual, posicao);
    pecaAtual = proximaPeca;
    proximaPeca = gerarPecaAleatoria();
    posicao = { x: 3, y: 0 };

    // Verifica se o jogo acabou
    if (colisao(tabuleiro, pecaAtual, posicao)) {
      clearInterval(intervalo);
      alert("🧱 Fim de jogo! Carrega em 'Reiniciar'.");
    }
  }

  desenhar();
}

// Verifica a colisão com paredes, fundo ou blocos fixos
function colisao(tab, peca, pos) {
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      if (peca[y][x]) {
        const novoY = pos.y + y;
        const novoX = pos.x + x;
        if (
          novoY >= LINHAS ||
          novoX < 0 ||
          novoX >= COLUNAS ||
          (novoY >= 0 && tab[novoY]?.[novoX])
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
        const py = pos.y + y;
        const px = pos.x + x;
        if (py >= 0 && py < LINHAS && px >= 0 && px < COLUNAS) {
          tab[py][px] = peca[y][x];
        }
      }
    }
  }
}

// Desenhar tabuleiro e próxima peça
function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Botões de controlo
document.getElementById('startBtn').addEventListener('click', () => {
  if (!intervalo) intervalo = setInterval(atualizar, 600);
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

document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = null;
});

// Controlo por teclas
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

  desenhar();
});

// Render inicial
desenhar();

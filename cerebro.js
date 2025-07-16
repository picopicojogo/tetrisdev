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

// Estado do jogo
let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let pontuacao = 0;

// Criar tabuleiro vazio
function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

// Gerar peça aleatória
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

// Desenhar jogo
function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Atualizar estado
function atualizar() {
  const novaY = posicao.y + 1;
  if (!colisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  } else {
    fixarPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();
    pontuacao += 10;
    document.getElementById('score').textContent = pontuacao;

    pecaAtual = proximaPeca;
    proximaPeca = gerarPecaAleatoria();
    posicao = { x: 3, y: 0 };

    if (colisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      intervalo = null;
      document.getElementById('modal').classList.add('show');
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

// Rodar peça
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
  pontuacao = 0;
  document.getElementById('score').textContent = 0;
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

// Botão Guardar
document.getElementById('save-score-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('show');
});

// Guardar pontuação no ranking
document.getElementById('confirmSave').addEventListener('click', () => {
  const nome = document.getElementById('player-name').value.trim();
  if (nome) {
    const rankingItem = document.createElement('li');
    rankingItem.textContent = `${nome} — ${pontuacao} pts`;
    document.getElementById('ranking-list').appendChild(rankingItem);
    document.getElementById('modal').classList.remove('show');
    document.getElementById('player-name').value = '';
  }
});

// Botão Top 10 → mostrar/ocultar ranking
document.getElementById('top10Btn')?.addEventListener('click', () => {
  const ranking = document.getElementById('ranking-container');
  if (ranking.style.display === 'none' || !ranking.style.display) {
    ranking.style.display = 'block';
  } else {
    ranking.style.display = 'none';
  }
});

// Controlo por teclado
document.addEventListener('keydown', (e) => {
  if (!intervalo) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
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

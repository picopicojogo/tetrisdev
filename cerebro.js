import { COLUNAS, LINHAS } from './motor.js';
import { desenharJogo, desenharProxima } from './canvas.js';
import {
  tocarSomRodar,
  tocarSomColidir,
  tocarSomPerdeu,
  iniciarMusicaFundo,
  pararMusicaFundo
} from './audio.js';

const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

const tamanhoBloco = 20;
boardCanvas.width = COLUNAS * tamanhoBloco;
boardCanvas.height = LINHAS * tamanhoBloco;
nextCanvas.width = 80;
nextCanvas.height = 80;

let tabuleiro = criarTabuleiroVazio();
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let pontuacao = 0;
let nivel = 1;
let totalLinhasEliminadas = 0;
let intervaloTempo = 600;

function criarTabuleiroVazio() {
  return Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
}

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

function desenhar() {
  desenharJogo(boardCtx, boardCanvas.width, boardCanvas.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

function eliminarLinhas(tabuleiro) {
  let linhasEliminadas = 0;
  for (let y = tabuleiro.length - 1; y >= 0; y--) {
    if (tabuleiro[y].every(val => val !== 0)) {
      tabuleiro.splice(y, 1);
      tabuleiro.unshift(Array(COLUNAS).fill(0));
      linhasEliminadas++;
      y++;
    }
  }
  return linhasEliminadas;
}

function atualizar() {
  const novaY = posicao.y + 1;
  if (!colisao(tabuleiro, pecaAtual, { x: posicao.x, y: novaY })) {
    posicao.y = novaY;
  } else {
    fixarPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();
    pontuacao += 10;

    const eliminadas = eliminarLinhas(tabuleiro);
    if (eliminadas > 0) {
      pontuacao += eliminadas * 100;
      totalLinhasEliminadas += eliminadas;

      boardCanvas.classList.add('flash');
      setTimeout(() => boardCanvas.classList.remove('flash'), 300);

      const celebracao = document.getElementById('celebracao');
      celebracao.style.display = 'block';
      celebracao.style.animation = 'subirCelebracao 1s ease-out forwards';
      setTimeout(() => {
        celebracao.style.display = 'none';
        celebracao.style.animation = '';
      }, 1000);

      const novoNivel = Math.floor(totalLinhasEliminadas / 5) + 1;
      if (novoNivel > nivel) {
        nivel = novoNivel;
        document.getElementById('level').textContent = nivel;
        clearInterval(intervalo);
        intervaloTempo = Math.max(150, intervaloTempo - 50);
        intervalo = setInterval(atualizar, intervaloTempo);
      }
    }

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
    intervalo = setInterval(atualizar, intervaloTempo);
    iniciarMusicaFundo(); // Música começa ao iniciar o jogo
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
  nivel = 1;
  totalLinhasEliminadas = 0;
  intervaloTempo = 600;
  document.getElementById('score').textContent = 0;
  document.getElementById('level').textContent = nivel;
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

// Guardar pontuação
document.getElementById('save-score-btn').addEventListener('click', () => {
  const nomeAnterior = localStorage.getItem('ultimoJogador');
  if (nomeAnterior) {
    document.getElementById('player-name').value = nomeAnterior;
  }
  document.getElementById('modal').classList.add('show');
});

document.getElementById('confirmSave').addEventListener('click', () => {
    const nome = document.getElementById('player-name').value.trim();
  if (nome) {
    localStorage.setItem('ultimoJogador', nome);
    const pontuacaoAtual = parseInt(document.getElementById('score').textContent, 10);
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-PT');

    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ nome, pontuacao: pontuacaoAtual, data });
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    const top10 = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(top10));
    atualizarRankingVisual(top10);

    document.getElementById('modal').classList.remove('show');
    document.getElementById('player-name').value = '';
  }
});

// Mostrar/ocultar o ranking
document.getElementById('top10Btn')?.addEventListener('click', () => {
  const ranking = document.getElementById('ranking-container');
  ranking.style.display = ranking.style.display === 'none' || !ranking.style.display ? 'block' : 'none';
});

// Limpar o ranking
document.getElementById('clear-ranking-btn')?.addEventListener('click', () => {
  localStorage.removeItem('ranking');
  atualizarRankingVisual([]);
});

// Actualizar lista visual
function atualizarRankingVisual(ranking) {
  const lista = document.getElementById('ranking-list');
  lista.innerHTML = '';
  ranking.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item.nome} — ${item.pontuacao} pts (${item.data})`;
    lista.appendChild(li);
  });
}

// Carregar o ranking ao iniciar
window.addEventListener('DOMContentLoaded', () => {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  atualizarRankingVisual(ranking);
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

// Render inicial
desenhar();

/**
 * cerebro.js
 *
 * Módulo principal do jogo Pico-Pico Bricks.
 * Coordena os módulos canvas, pontuação, áudio, controlos e cronómetro.
 */
/**
 * Importações 
 */
import {
  COLUNAS, LINHAS, verificarColisao, fixarPeca,
  eliminarLinhas, desenharJogo, desenharProxima, gerarPecaAleatoria,
  carregarDefinicoesAcessibilidade
} from './canvas.js';

import {
  tocarSomColidir, tocarSomPerdeu, iniciarMusicaFundo, pararMusicaFundo
} from './audio.js';

import {
  configurarControlos, moverPeca, rodarPeca, descerPeca, quedaInstantanea
} from './controlos.js';

import {
  pontuacao, comboContador, calcularPontuacao, resetarPontuacao,
  atualizarRankingVisual, mostrarCelebracao
} from './pontuacao.js';

import {
  iniciarCronometro, pararCronometro, reiniciarCronometro
} from './cronometro.js';

// Atalho rápido para elementos por ID
const $ = id => document.getElementById(id);
const board = $('board');
const next = $('next');
const boardCtx = board.getContext('2d');
const nextCtx = next.getContext('2d');

// Dimensões do canvas
board.width = COLUNAS * 20;
board.height = LINHAS * 20;
next.width = 80;
next.height = 80;

// Estado do jogo
let tabuleiro = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let nivel = 1;
let linhasTotais = 0;
let intervaloTempo = 600;
let config = carregarDefinicoesAcessibilidade();

// Desenha o estado do jogo
function desenhar() {
  desenharJogo(boardCtx, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

// Termina o jogo
function terminarJogo() {
  tocarSomPerdeu();
  clearInterval(intervalo);
  intervalo = null;
  pararCronometro();
  $('modal').classList.add('show');
}

// Atualiza ciclo principal do jogo
function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fixarPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

    const eliminadas = eliminarLinhas(tabuleiro);
    if (eliminadas) {
      calcularPontuacao(eliminadas);
      linhasTotais += eliminadas;

      const textoCelebracao = comboContador > 2 ? 'ULTRA COMBO!' :
                               comboContador === 2 ? 'SUPER COMBO!' :
                               comboContador === 1 ? 'COMBO!' : 'LINHA!';

      const classeCelebracao = comboContador > 2 ? 'combo-final' :
                               comboContador === 2 ? 'combo2' :
                               comboContador === 1 ? 'combo' : '';

      mostrarCelebracao(textoCelebracao, classeCelebracao);

      if (config.flash) {
        board.classList.add('flash');
        setTimeout(() => board.classList.remove('flash'), 300);
      }

      const novoNivel = Math.floor(linhasTotais / 5) + 1;
      if (novoNivel > nivel) {
        nivel = novoNivel;
        $('level').textContent = nivel;
        clearInterval(intervalo);
        intervaloTempo = Math.max(150, intervaloTempo - 50);
        intervalo = setInterval(atualizar, intervaloTempo);
      }
    } else {
      comboContador = 0;
    }

    $('score').textContent = pontuacao;
    [pecaAtual, proximaPeca] = [proximaPeca, gerarPecaAleatoria()];
    posicao = { x: 3, y: 0 };

    if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
      terminarJogo();
    }
  }

  desenhar();
}

// Liga controlos do teclado
configurarControlos(
  dir => { moverPeca(dir, tabuleiro, pecaAtual, posicao); desenhar(); },
  () => { pecaAtual = rodarPeca(1, pecaAtual, tabuleiro, posicao); desenhar(); },
  () => { descerPeca(tabuleiro, pecaAtual, posicao); desenhar(); },
  () => { $('pauseBtn').click(); },
  () => { quedaInstantanea(tabuleiro, pecaAtual, posicao); desenhar(); }
);

// Botões principais
$('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, intervaloTempo);
    iniciarMusicaFundo();
    iniciarCronometro();
  }
};

$('pauseBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
  pararCronometro();
};

$('resetBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  tabuleiro = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
  [pecaAtual, proximaPeca] = [gerarPecaAleatoria(), gerarPecaAleatoria()];
  posicao = { x: 3, y: 0 };
  resetarPontuacao();
  nivel = 1;
  linhasTotais = 0;
  intervaloTempo = 600;
  $('level').textContent = nivel;
  reiniciarCronometro();
  desenhar();
};

// Guardar pontuação no ranking
$('confirmSave').onclick = () => {
  const nome = $('player-name').value.trim();
  if (!nome) return;

  localStorage.setItem('ultimoJogador', nome);
  const data = new Date().toLocaleDateString('pt-PT');
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

  ranking.push({ nome, pontuacao, nivel, data });
  localStorage.setItem('ranking',
    JSON.stringify(ranking.sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 10))
  );

  atualizarRankingVisual(JSON.parse(localStorage.getItem('ranking')));
  $('modal').classList.remove('show');
  $('player-name').value = '';
};

$('cancelSave').onclick = () => {
  $('modal').classList.remove('show');
  $('player-name').value = '';
};

$('save-score-btn').onclick = () => {
  const nomeAnterior = localStorage.getItem('ultimoJogador');
  if (nomeAnterior) $('player-name').value = nomeAnterior;
  $('modal').classList.add('show');
};

// Alterna visualização do ranking
$('top10Btn')?.addEventListener('click', () => {
  const r = $('ranking-container');
  r.style.display = r.style.display === 'none' || !r.style.display ? 'block' : 'none';
});

$('clear-ranking-btn')?.addEventListener('click', () => {
  localStorage.removeItem('ranking');
  atualizarRankingVisual([]);
});

// Alterna som
$('toggle-sound').onclick = () => {
  const audio = $('musica-fundo');
  const botao = $('toggle-sound');
  if (!audio) return;
  audio.paused ? audio.play() : audio.pause();
  botao.textContent = audio.paused ? '🔇 Som desligado' : '🔊 Som ligado';
};

// Guarda preferências de acessibilidade
function guardarDefinicoesAcessibilidade() {
  const configNova = {
    flash: $('toggle-flash')?.checked ?? true,
    vibracao: $('toggle-vibracao')?.checked ?? true,
    animacoes: $('toggle-animacoes')?.checked ?? true,
    sonsAgudos: $('toggle-sonos-agudos')?.checked ?? true,
    somGeral: true // obrigatório para audio.js
  };
  localStorage.setItem('acessibilidade', JSON.stringify(configNova));
  config = configNova;
}

// Repõe definições padrão
function reporDefinicoesAcessibilidade() {
  const predefinidas = {
    flash: true,
    vibracao: true,
    animacoes: true,
    sonsAgudos: true,
    somGeral: true
  };
  localStorage.setItem('acessibilidade', JSON.stringify(predefinidas));
  config = predefinidas;

  $('toggle-flash').checked = true;
  $('toggle-vibracao').checked = true;
  $('toggle-animacoes').checked = true;
  $('toggle-sonos-agudos').checked = true;
}

// Menu de opções
$('btn-opcoes')?.addEventListener('click', () => {
  $('menu-opcoes').classList.remove('escondido');
});

$('fechar-opcoes')?.addEventListener('click', () => {
  guardarDefinicoesAcessibilidade();
  $('menu-opcoes').classList.add('escondido');
});

$('repor-opcoes')?.addEventListener('click', () => {
  reporDefinicoesAcessibilidade();
  $('menu-opcoes').classList.add('escondido');
});

// Estado inicial ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  // Recarrega o ranking existente
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  atualizarRankingVisual(ranking.sort((a, b) => b.pontuacao - a.pontuacao));

  // Reinicia o cronómetro e desenha o jogo
  reiniciarCronometro();
  desenhar();

  // Aplica preferências visuais existentes
  $('toggle-flash').checked = config.flash;
  $('toggle-vibracao').checked = config.vibracao;
  $('toggle-animacoes').checked = config.animacoes;
  $('toggle-sonos-agudos').checked = config.sonsAgudos;
});

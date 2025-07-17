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
  eliminarLinhas, desenharJogo, desenharProxima,
  gerarPecaAleatoria, carregarDefinicoesAcessibilidade
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

const $ = id => document.getElementById(id);

// Contextos dos canvas (tabuleiro e próxima peça)
const boardCtx = $('board').getContext('2d');
const nextCtx = $('next').getContext('2d');

// Define dimensões dos canvas
$('board').width = COLUNAS * 20;
$('board').height = LINHAS * 20;
$('next').width = 80;
$('next').height = 80;

// Estado interno do jogo
let tabuleiro = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));
let pecaAtual = gerarPecaAleatoria();
let proximaPeca = gerarPecaAleatoria();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let nivel = 1;
let linhasTotais = 0;
let intervaloTempo = 600;
let config = carregarDefinicoesAcessibilidade(); // Carrega opções do jogador

/**
 * Desenha o tabuleiro e a próxima peça
 */
function desenhar() {
  desenharJogo(boardCtx, $('board').width, $('board').height, tabuleiro, pecaAtual, posicao);
  desenharProxima(nextCtx, proximaPeca);
}

/**
 * Executa as ações necessárias quando o jogo termina
 */
function terminarJogo() {
  tocarSomPerdeu();
  clearInterval(intervalo);
  intervalo = null;
  pararCronometro();
  $('modal').classList.add('show');
}

/**
 * Atualiza o estado do jogo numa iteração
 */
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

      const texto = comboContador > 1 ? 'COMBO!' : 'LINHA!';
      const classe = comboContador > 1 ? 'combo' : '';
      mostrarCelebracao(texto, classe);

      if (config.flash) {
        $('board').classList.add('flash');
        setTimeout(() => $('board').classList.remove('flash'), 300);
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

/**
 * Liga os eventos de teclado aos movimentos do jogo
 */
configurarControlos(
  dir => { moverPeca(dir, tabuleiro, pecaAtual, posicao); desenhar(); },
  () => { pecaAtual = rodarPeca(1, pecaAtual, tabuleiro, posicao); desenhar(); },
  () => { descerPeca(tabuleiro, pecaAtual, posicao); desenhar(); },
  () => { $('pauseBtn').click(); },
  () => { quedaInstantanea(tabuleiro, pecaAtual, posicao); desenhar(); }
);

/**
 * Botão para iniciar o jogo
 */
$('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, intervaloTempo);
    iniciarMusicaFundo();
    iniciarCronometro();
  }
};

/**
 * Botão para pausar o jogo
 */
$('pauseBtn').onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  pararMusicaFundo();
  pararCronometro();
};

/**
 * Botão para reiniciar o jogo
 */
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

/**
 * Abre o modal para guardar a pontuação
 */
$('save-score-btn').onclick = () => {
  const nomeAnterior = localStorage.getItem('ultimoJogador');
  if (nomeAnterior) $('player-name').value = nomeAnterior;
  $('modal').classList.add('show');
};

/**
 * Confirma e guarda a pontuação no ranking
 */
$('confirmSave').onclick = () => {
  const nome = $('player-name').value.trim();
  if (!nome) return;

  localStorage.setItem('ultimoJogador', nome);
  const pontuacaoAtual = parseInt($('score').textContent);
  const data = new Date().toLocaleDateString('pt-PT');
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

  ranking.push({ nome, pontuacao: pontuacaoAtual, nivel, data });
  localStorage.setItem('ranking',
    JSON.stringify(ranking.sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 10))
  );

  atualizarRankingVisual(JSON.parse(localStorage.getItem('ranking')));
  $('modal').classList.remove('show');
  $('player-name').value = '';
};

/**
 * Cancela o guardar da pontuação
 */
$('cancelSave').onclick = () => {
  $('modal').classList.remove('show');
  $('player-name').value = '';
};

/**
 * Mostra ou esconde o ranking Top 10
 */
$('top10Btn')?.addEventListener('click', () => {
  const r = $('ranking-container');
  r.style.display = r.style.display === 'none' || !r.style.display ? 'block' : 'none';
});

/**
 * Limpa completamente o ranking gravado
 */
$('clear-ranking-btn')?.addEventListener('click', () => {
  localStorage.removeItem('ranking');
  atualizarRankingVisual([]);
});

/**
 * Alterna o estado da música de fundo manualmente
 */
$('toggle-sound').onclick = () => {
  const audio = $('musica-fundo');
  const botao = $('toggle-sound');
  if (!audio) return;
  audio.paused ? audio.play() : audio.pause();
  botao.textContent = audio.paused ? '🔇 Som desligado' : '🔊 Som ligado';
};

/**
 * Estado inicial do jogo ao carregar a página
 */
window.addEventListener('DOMContentLoaded', () => {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  atualizarRankingVisual(ranking.sort((a, b) => b.pontuacao - a.pontuacao));
  reiniciarCronometro();
  desenhar();
});

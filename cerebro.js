// cerebro.js — o CPU do jogo
import {
  COLUNAS, LINHAS,
  criarMatriz, verificarColisao,
  fundirPeca, gerarPeca,
  limparLinhas
} from './motor.js';

import {
  configurarCanvas,
  desenharJogo, desenharProxima,
  atualizarTempo,
  mostrarModalFim
} from './canvas.js';

import {
  tocarSomColidir, tocarSomPerdeu,
  iniciarMusicaFundo, pararMusicaFundo
} from './audio.js';

import {
  moverPeca, rodarPeca, descerPeca,
  configurarControlos
} from './controlos.js';

import {
  processarLinhas,
  reiniciarPontuacao,
  guardarPontuacao,
  carregarRankingGuardado
} from './pontuacao.js';

// Inicializa os canvas e elementos visuais
const { ctxBoard, ctxNext, board, next } = configurarCanvas();
const tempoEl = document.getElementById("time");

// Estado do jogo
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let tempoIntervalo = null;
let segundos = 0;

/**
 * Atualiza o jogo após cada descida ou jogada
 */
function atualizar() {
  posicao.y++;

  if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
    posicao.y--;
    fundirPeca(tabuleiro, pecaAtual, posicao);
    tocarSomColidir();

    const linhasFeitas = limparLinhas(tabuleiro);
    processarLinhas(linhasFeitas);

    [pecaAtual, proximaPeca] = [proximaPeca, gerarPeca()];
    posicao = { x: 3, y: 0 };

    if (verificarColisao(tabuleiro, pecaAtual, posicao)) {
      tocarSomPerdeu();
      clearInterval(intervalo);
      clearInterval(tempoIntervalo);
      const { pontuacao } = processarLinhas(0);
      mostrarModalFim(pontuacao);
      return;
    }
  }

  desenhar();
}

/**
 * Desenha estado atual no canvas
 */
function desenhar() {
  desenharJogo(ctxBoard, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(ctxNext, proximaPeca);
}

/**
 * Lançamento rápido da peça
 */
function quedaInstantanea() {
  while (!verificarColisao(tabuleiro, pecaAtual, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
  atualizar();
}

/**
 * Pausar o jogo e música
 */
function pausarJogo() {
  clearInterval(intervalo);
  clearInterval(tempoIntervalo);
  intervalo = null;
  tempoIntervalo = null;
  pararMusicaFundo();
}

/**
 * Inicia cronómetro de tempo
 */
function iniciarTempo() {
  tempoIntervalo = setInterval(() => {
    segundos++;
    atualizarTempo(tempoEl, segundos);
  }, 1000);
}

/**
 * Botão: Iniciar
 */
document.getElementById('startBtn').onclick = () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarTempo();
    iniciarMusicaFundo();
  }
};

/**
 * Botão: Pausar
 */
document.getElementById('pauseBtn').onclick = () => {
  pausarJogo();
};

/**
 * Botão: Reiniciar
 */
document.getElementById('resetBtn').onclick = () => {
  pausarJogo();
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  [pecaAtual, proximaPeca] = [gerarPeca(), gerarPeca()];
  posicao = { x: 3, y: 0 };
  segundos = 0;
  reiniciarPontuacao();
  atualizarTempo(tempoEl, segundos);
  desenhar();
};

/**
 * Botão: Alternar som
 */
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

/**
 * Botão: Guardar pontuação final
 */
document.getElementById('confirmSave').onclick = () => {
  const { pontuacao } = processarLinhas(0);
  guardarPontuacao(pontuacao);
};

/**
 * Botão: Cancelar modal
 */
document.getElementById('cancelSave').onclick = () =>
  document.getElementById('modal')?.classList.remove('show');

/**
 * Liga os controlos do utilizador
 */
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

// Estado inicial
carregarRankingGuardado();
atualizarTempo(tempoEl, segundos);
desenhar();

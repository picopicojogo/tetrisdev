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
  iniciarMusicaFundo, pararMusicaFundo,
  alternarMusica
} from './audio.js';

import {
  moverPeca, rodarPeca, descerPeca,
  configurarControlos
} from './controlos.js';

import {
  processarLinhas,
  reiniciarPontuacao,
  guardarPontuacao
} from './pontuacao.js';

// Inicializa os canvas
const { ctxBoard, ctxNext, board, next } = configurarCanvas();
const tempoEl = document.getElementById("time");

// Estado interno do jogo
let tabuleiro = criarMatriz(COLUNAS, LINHAS);
let pecaAtual = gerarPeca();
let proximaPeca = gerarPeca();
let posicao = { x: 3, y: 0 };
let intervalo = null;
let tempoIntervalo = null;
let segundos = 0;

/**
 * Atualiza o estado do jogo a cada ciclo
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
 * Redesenha o estado visual do jogo
 */
function desenhar() {
  desenharJogo(ctxBoard, board.width, board.height, tabuleiro, pecaAtual, posicao);
  desenharProxima(ctxNext, proximaPeca);
}

/**
 * Executa queda rápida da peça até ao limite
 */
function quedaInstantanea() {
  while (!verificarColisao(tabuleiro, pecaAtual, { x: posicao.x, y: posicao.y + 1 })) {
    posicao.y++;
  }
  atualizar();
}

/**
 * Pausa o jogo e música de fundo
 */
function pausarJogo() {
  clearInterval(intervalo);
  clearInterval(tempoIntervalo);
  intervalo = null;
  tempoIntervalo = null;
  pararMusicaFundo();
}

/**
 * Inicia o cronómetro de jogo
 */
function iniciarTempo() {
  tempoIntervalo = setInterval(() => {
    segundos++;
    atualizarTempo(tempoEl, segundos);
  }, 1000);
}

// Botão: Iniciar jogo
document.getElementById("startBtn")?.addEventListener("click", () => {
  if (!intervalo) {
    intervalo = setInterval(atualizar, 600);
    iniciarTempo();
    iniciarMusicaFundo();
  }
});

// Botão: Pausar jogo
document.getElementById("pauseBtn")?.addEventListener("click", pausarJogo);

// Botão: Reiniciar jogo
document.getElementById("resetBtn")?.addEventListener("click", () => {
  pausarJogo();
  tabuleiro = criarMatriz(COLUNAS, LINHAS);
  [pecaAtual, proximaPeca] = [gerarPeca(), gerarPeca()];
  posicao = { x: 3, y: 0 };
  segundos = 0;
  reiniciarPontuacao();
  atualizarTempo(tempoEl, segundos);
  desenhar();
});

// Botão: Alternar música de fundo
document.getElementById("toggle-sound")?.addEventListener("click", () => {
  alternarMusica();
});

// Botão: Guardar pontuação final
document.getElementById("confirmSave")?.addEventListener("click", () => {
  const pontos = document.getElementById("score")?.textContent || "0";
  guardarPontuacao(parseInt(pontos));
});

// Botão: Cancelar modal
document.getElementById("cancelSave")?.addEventListener("click", () => {
  document.getElementById("modal")?.classList.remove("show");
});

/**
 * Ativa os controlos de teclado, toque e botões visuais
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

// Inicializa tempo e canvas
atualizarTempo(tempoEl, segundos);
desenhar();

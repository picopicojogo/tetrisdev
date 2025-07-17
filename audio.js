/**
 * audio.js
 *
 * Módulo responsável por gerir os efeitos sonoros e a música de fundo do jogo.
 * Inclui funções para tocar sons específicos e controlar o áudio ambiente.
 */

// Obtém os elementos de áudio definidos no HTML
const somColidir      = document.getElementById('som-colidir');
const somPerdeu       = document.getElementById('som-perdeu');
const somRodar        = document.getElementById('som-rodar');
const somPontos       = document.getElementById('som-pontos');
const musicaFundo     = document.getElementById('musica-fundo');
const combo2          = document.getElementById('combo2');
const combo3          = document.getElementById('combo3');
const comboFinal      = document.getElementById('combo-final');
const bonus           = document.getElementById('bonus');

// Verifica se som geral está activo
function somAtivo() {
  const config = localStorage.getItem('acessibilidade');
  return config ? JSON.parse(config).somGeral : true;
}

// Tocar som genérico com verificação
function tocar(som, volume = 0.6) {
  if (!somAtivo() || !som) return;
  som.pause();
  som.currentTime = 0;
  som.volume = volume;
  som.play();
}

export function tocarSomColidir() {
  tocar(somColidir);
}

export function tocarSomPerdeu() {
  tocar(somPerdeu);
}

export function tocarSomRodar() {
  tocar(somRodar, 0.4);
}

export function tocarSomPontos() {
  tocar(somPontos, 0.5);
}

export function iniciarMusicaFundo() {
  if (!somAtivo() || !musicaFundo || !musicaFundo.paused) return;
  musicaFundo.volume = 0.4;
  musicaFundo.loop = true;
  musicaFundo.play();
}

export function pararMusicaFundo() {
  if (musicaFundo && !musicaFundo.paused) {
    musicaFundo.pause();
  }
}

// Combo vocal com fade-in e fade-out
export function fadeInVoz(som, volume = 0.6) {
  if (!somAtivo() || !som) return;
  som.volume = 0;
  som.currentTime = 0;
  som.play();
  const steps = 12;
  const increment = volume / steps;
  let atual = 0;
  const intervalo = setInterval(() => {
    atual += increment;
    som.volume = Math.min(atual, volume);
    if (som.volume >= volume) clearInterval(intervalo);
  }, 30);
}

export function fadeOutVoz(som, duracao = 700) {
  if (!som || som.paused) return;
  const steps = 15;
  const decrement = som.volume / steps;
  let atual = som.volume;
  const intervalo = setInterval(() => {
    atual -= decrement;
    som.volume = Math.max(atual, 0);
    if (som.volume <= 0) {
      som.pause();
      clearInterval(intervalo);
    }
  }, duracao / steps);
}

// Sons de combo
export function tocarCombo2() {
  tocar(combo2, 0.6);
}
export function tocarCombo3() {
  tocar(combo3, 0.65);
}
export function tocarComboFinal() {
  const config = localStorage.getItem('acessibilidade');
  const ativarVoz = config ? JSON.parse(config).sonsAgudos : true;
  if (ativarVoz && somAtivo()) {
    fadeInVoz(comboFinal, 0.7);
    setTimeout(() => fadeOutVoz(comboFinal, 800), 1200);
  }
}

// Som de bónus com fade-out suave
export function tocarBonus(volume = 0.7) {
  if (!somAtivo() || !bonus) return;
  bonus.currentTime = 0;
  bonus.volume = volume;
  bonus.play();
  setTimeout(() => fadeOutVoz(bonus, 800), 1500);
}

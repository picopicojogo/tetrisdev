// audio.js — gestão centralizada dos sons do jogo

// Obtém os elementos de áudio do HTML
const somRodar = document.getElementById('rodar');
const somColidir = document.getElementById('colidir');
const somPerdeu = document.getElementById('perdeu');
const musicaFundo = document.getElementById('musica-fundo');

/**
 * Reproduz o som de rotação da peça
 */
export function tocarSomRodar() {
  if (somRodar && typeof somRodar.play === 'function') {
    somRodar.currentTime = 0;
    somRodar.play();
  }
}

/**
 * Reproduz o som de colisão ao fixar peça
 */
export function tocarSomColidir() {
  if (somColidir && typeof somColidir.play === 'function') {
    somColidir.currentTime = 0;
    somColidir.play();
  }
}

/**
 * Reproduz som de fim de jogo
 */
export function tocarSomPerdeu() {
  if (somPerdeu && typeof somPerdeu.play === 'function') {
    somPerdeu.currentTime = 0;
    somPerdeu.play();
  }
}

/**
 * Inicia a música de fundo
 */
export function iniciarMusicaFundo() {
  if (musicaFundo && typeof musicaFundo.play === 'function') {
    musicaFundo.play();
  }
}

/**
 * Pausa a música de fundo
 */
export function pararMusicaFundo() {
  if (musicaFundo && typeof musicaFundo.pause === 'function') {
    musicaFundo.pause();
  }
}

/**
 * audio.js
 *
 * Módulo responsável por gerir os efeitos sonoros e a música de fundo do jogo.
 * Inclui funções para tocar sons específicos e controlar o áudio ambiente.
 */

// Obtém os elementos de áudio definidos no HTML
const somColidir = document.getElementById('som-colidir');
const somPerdeu = document.getElementById('som-perdeu');
const musicaFundo = document.getElementById('musica-fundo');

/**
 * Toca o som de colisão quando a peça é fixada
 */
export function tocarSomColidir() {
  if (somColidir) {
    somColidir.currentTime = 0;
    somColidir.play();
  }
}

/**
 * Toca o som de derrota quando o jogo termina
 */
export function tocarSomPerdeu() {
  if (somPerdeu) {
    somPerdeu.currentTime = 0;
    somPerdeu.play();
  }
}

/**
 * Inicia a música de fundo do jogo
 */
export function iniciarMusicaFundo() {
  if (musicaFundo && musicaFundo.paused) {
    musicaFundo.volume = 0.4;
    musicaFundo.loop = true;
    musicaFundo.play();
  }
}

/**
 * Para a música de fundo
 */
export function pararMusicaFundo() {
  if (musicaFundo && !musicaFundo.paused) {
    musicaFundo.pause();
  }
}

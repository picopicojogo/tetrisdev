// Seleção dos elementos <audio> existentes no HTML
const somRodar     = document.getElementById('rodar');
const somColidir   = document.getElementById('colidir');
const somPerdeu    = document.getElementById('perdeu');
const musicaFundo  = document.getElementById('musica-fundo');

/**
 * Toca um elemento de som, reiniciando o tempo de reprodução
 * @param {HTMLAudioElement} som - elemento de áudio
 */
function tocar(som) {
  if (som && typeof som.play === 'function') {
    som.currentTime = 0;
    som.play().catch(erro => console.warn('Erro ao tocar som:', erro));
  }
}

/**
 * Toca o som de rotação da peça
 */
export function tocarSomRodar() {
  tocar(somRodar);
}

/**
 * Toca o som ao fixar a peça no tabuleiro
 */
export function tocarSomColidir() {
  tocar(somColidir);
}

/**
 * Toca o som de fim de jogo
 */
export function tocarSomPerdeu() {
  tocar(somPerdeu);
}

/**
 * Inicia a música de fundo em loop
 */
export function iniciarMusicaFundo() {
  if (musicaFundo && typeof musicaFundo.play === 'function') {
    musicaFundo.play().catch(() => {});
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

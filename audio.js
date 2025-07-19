// Seleção dos elementos de som definidos no HTML
const somRodar     = document.getElementById('rodar');
const somColidir   = document.getElementById('colidir');
const somPerdeu    = document.getElementById('perdeu');
const musicaFundo  = document.getElementById('musica-fundo');

/**
 * Toca um elemento de som, reiniciando a reprodução
 * @param {HTMLAudioElement} som - elemento <audio> a reproduzir
 */
function tocar(som) {
  if (som && typeof som.play === 'function') {
    som.pause();              // interrompe qualquer reprodução anterior
    som.currentTime = 0;      // reinicia no início
    som.play().catch(erro => {
      console.warn('Erro ao tocar som:', erro);
    });
  }
}

/**
 * Toca o som ao rodar a peça
 */
export function tocarSomRodar() {
  tocar(somRodar);
}

/**
 * Toca o som ao colidir ou fixar a peça no tabuleiro
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
 * Inicia a música de fundo com volume moderado e em loop
 */
export function iniciarMusicaFundo() {
  if (musicaFundo && typeof musicaFundo.play === 'function') {
    musicaFundo.volume = 0.5;
    musicaFundo.loop = true;
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

/**
 * Alterna entre música ligada e desligada
 */
export function alternarMusica() {
  if (!musicaFundo) return;
  if (musicaFundo.paused) {
    iniciarMusicaFundo();
  } else {
    pararMusicaFundo();
  }
}

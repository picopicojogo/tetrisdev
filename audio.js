// Efeitos sonoros
const somRodar = new Audio('rodar.mp3');
const somColidir = new Audio('colidir.mp3');
const somPerdeu = new Audio('perdeu.mp3');

// Música de fundo (controlada via elemento <audio> no index.html)
export function iniciarMusicaFundo() {
  const musica = document.getElementById('musica-fundo');
  if (musica) {
    musica.volume = 0.5;
    musica.play();
  }
}

export function pararMusicaFundo() {
  const musica = document.getElementById('musica-fundo');
  if (musica) {
    musica.pause();
  }
}

// Sons de acção
export function tocarSomRodar() {
  somRodar.currentTime = 0;
  somRodar.play();
}

export function tocarSomColidir() {
  somColidir.currentTime = 0;
  somColidir.play();
}

export function tocarSomPerdeu() {
  somPerdeu.currentTime = 0;
  somPerdeu.play();
}

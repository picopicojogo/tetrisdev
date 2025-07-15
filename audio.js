// Módulo de áudio: música de fundo e efeitos sonoros principais
let somAtivo = true;

// Referência à música de fundo
const musicaFundo = document.getElementById("musica-fundo");

// Referências aos efeitos sonoros com os IDs correspondentes aos ficheiros.mp3
const sons = {
  rodar: document.getElementById("rodar"),
  colidir: document.getElementById("colidir"),
  perdeu: document.getElementById("perdeu")
};

/**
 * Toca o som com o nome especificado, caso o mesmo esteja activo
 * @param {string} nome - 'rodar', 'colidir' ou 'perdeu'
 */
export function tocarSom(nome) {
  if (!somAtivo) return;

  const audio = sons[nome];
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

/**
 * Actualiza o estado da música de fundo (play ou pause)
 */
export function atualizarMusica() {
  if (somAtivo) {
    musicaFundo.play();
  } else {
    musicaFundo.pause();
  }
}

/**
 * Alterna entre os modos ligado e desligado, e actualiza botão visual
 */
export function alternarSom() {
  somAtivo = !somAtivo;
  const btn = document.getElementById("toggle-sound");
  btn.textContent = somAtivo ? "🔊 Som" : "🔇 Silenciar";
  atualizarMusica();
}

/**
 * Verifica se o som está actualmente ativo
 * @returns {boolean}
 */
export function somLigado() {
  return somAtivo;
}

// Módulo de audio: musica de fundo e efeitos sonoros

let somAtivo = true;

const musicaFundo = document.getElementById("musica-fundo");

const sons = {
  rodar: document.getElementById("som-rodar"),
  colidir: document.getElementById("som-colidir"),
  pontos: document.getElementById("som-pontos"),
  perdeu: document.getElementById("som-perdeu")
};

/**
 * Toca o som especificado, se activo
 * @param {string} nome - chave do som ("rodar", "colidir", etc.)
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
 * Liga ou pausa a musica de fundo
 */
export function atualizarMusica() {
  if (somAtivo) {
    musicaFundo.play();
  } else {
    musicaFundo.pause();
  }
}

/**
 * Alterna entre som ligado/desligado
 */
export function alternarSom() {
  somAtivo = !somAtivo;
  const btn = document.getElementById("toggle-sound");
  btn.textContent = somAtivo ? "🔊 Som" : "🔇 Silenciar";
  atualizarMusica();
}

/**
 * Verifica se o som esta activo
 * @returns {boolean}
 */
export function somLigado() {
  return somAtivo;
}

// Módulo de áudio: efeitos sonoros e música de fundo

// Estado global do som (ligado/desligado)
let somAtivo = true;

// Referências aos elementos de áudio no HTML
const musicaFundo = document.getElementById("musica-fundo");
const sons = {
  rodar: document.getElementById("som-rodar"),
  colidir: document.getElementById("som-colidir"),
  pontos: document.getElementById("som-pontos"),
  perdeu: document.getElementById("som-perdeu")
};

/**
 * Toca o som correspondente à acção
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
 * Actualiza o estado da música de fundo consoante o somAtivo
 */
export function atualizarMusica() {
  if (somAtivo) {
    musicaFundo.play();
  } else {
    musicaFundo.pause();
  }
}

/**
 * Alterna entre som ligado/desligado e actualiza o botão visual
 */
export function alternarSom() {
  somAtivo = !somAtivo;

  const btn = document.getElementById("toggle-sound");
  btn.textContent = somAtivo ? "🔊 Som" : "🔇 Silenciar";

  atualizarMusica();
}

/**
 * Devolve o estado atual do som
 * @returns {boolean}
 */
export function somLigado() {
  return somAtivo;
}

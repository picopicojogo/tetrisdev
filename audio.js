// Módulo de áudio: efeitos sonoros e música de fundo

// Variável global que indica se o som está activo
let somAtivo = true;

// Referências aos elementos de áudio definidos no HTML
const musicaFundo = document.getElementById("musica-fundo");
const sons = {
  rodar: document.getElementById("som-rodar"),
  colidir: document.getElementById("som-colidir"),
  pontos: document.getElementById("som-pontos"),
  perdeu: document.getElementById("som-perdeu")
};

/**
 * Toca o efeito sonoro indicado, se o som estiver activo
 * @param {string} nome - nome da acção (ex: "rodar", "colidir")
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
 * Inicia ou pausa a música de fundo consoante o estado do som
 */
export function atualizarMusica() {
  if (somAtivo) {
    musicaFundo.play();
  } else {
    musicaFundo.pause();
  }
}

/**
 * Alterna entre som activo e desactivado
 * Actualiza o botão visualmente e ajusta a música de fundo
 */
export function alternarSom() {
  somAtivo = !somAtivo;
  const btn = document.getElementById("toggle-sound");
  btn.textContent = somAtivo ? "🔊 Som" : "🔇 Silenciar";
  atualizarMusica();
}

/**
 * Verifica se o som está activado (usado por outros módulos)
 * @returns {boolean}
 */
export function somLigado() {
  return somAtivo;
}
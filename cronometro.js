/**
 * cronometro.js
 *
 * Módulo responsável por controlar o tempo de jogo.
 * Inclui funções para iniciar, parar e reiniciar o cronómetro.
 * O tempo é exibido no formato MM:SS no elemento com ID 'time'.
 */

let segundos = 0;
let cronometroID = null;

/**
 * Formata os segundos como MM:SS
 */
function formatarTempo(segundosTotais) {
  const mm = String(Math.floor(segundosTotais / 60)).padStart(2, '0');
  const ss = String(segundosTotais % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Atualiza o cronómetro no DOM
 */
function atualizarDisplay() {
  const elemento = document.getElementById('time');
  if (elemento) {
    elemento.textContent = formatarTempo(segundos);
  }
}

/**
 * Inicia o cronómetro se ainda não estiver ativo
 */
export function iniciarCronometro() {
  if (cronometroID) return;

  cronometroID = setInterval(() => {
    segundos++;
    atualizarDisplay();

    // Opcional: efeitos visuais/sonoros a cada minuto
    if (segundos % 60 === 0) {
      const config = localStorage.getItem('acessibilidade');
      const ativarFlash = config ? JSON.parse(config).flash : true;
      if (ativarFlash) {
        const tabuleiro = document.getElementById('board');
        tabuleiro?.classList.add('flash');
        setTimeout(() => tabuleiro?.classList.remove('flash'), 300);
      }
    }
  }, 1000);
}

/**
 * Para o cronómetro
 */
export function pararCronometro() {
  clearInterval(cronometroID);
  cronometroID = null;
}

/**
 * Reinicia o cronómetro para 00:00
 */
export function reiniciarCronometro() {
  segundos = 0;
  atualizarDisplay();
}

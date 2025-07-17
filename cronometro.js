/**
 * cronometro.js
 *
 * Módulo responsável por controlar o tempo de jogo.
 * Inclui funções para iniciar, parar e reiniciar o cronómetro.
 * O tempo é exibido no formato MM:SS no elemento com ID 'time'.
 */

// Estado interno do cronómetro
let segundos = 0;
let cronometroID = null;

/**
 * Inicia o cronómetro e atualiza o tempo a cada segundo
 */
export function iniciarCronometro() {
  if (cronometroID) return; // Evita múltiplos intervalos

  cronometroID = setInterval(() => {
    segundos++;
    const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
    const ss = String(segundos % 60).padStart(2, '0');
    document.getElementById('time').textContent = `${mm}:${ss}`;
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
  document.getElementById('time').textContent = '00:00';
}

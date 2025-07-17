// Variáveis internas para controlar o tempo
let segundos = 0;
let cronometroID = null;

/**
 * Inicia o cronómetro e actualiza o tempo a cada segundo
 */
export function iniciarCronometro() {
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

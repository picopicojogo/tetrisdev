/**
 * Mostra uma mensagem de celebração no centro do ecrã
 * Aplica classe visual se for um combo
 * @param {string} texto - texto a mostrar ("LINHA!" ou "COMBO!")
 * @param {string} classe - nome da classe CSS a aplicar (ex: "combo")
 */
export function mostrarCelebracao(texto, classe = '') {
  const celebracao = document.getElementById('celebracao');
  celebracao.textContent = texto;
  celebracao.className = classe;
  celebracao.style.display = 'block';

  setTimeout(() => {
    celebracao.style.display = 'none';
    celebracao.className = '';
    celebracao.textContent = 'LINHA!';
  }, 1000);
}

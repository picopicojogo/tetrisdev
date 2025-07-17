/**
 * Mostra uma mensagem de celebração no centro do ecrã
 * Aplica classe visual especial se for um combo
 * @param {string} texto - Texto a mostrar ("LINHA!" ou "COMBO!")
 * @param {string} classe - Nome da classe CSS a aplicar (ex: "combo")
 */
export function mostrarCelebracao(texto, classe = '') {
  // Obtém o elemento HTML responsável pela celebração
  const celebracao = document.getElementById('celebracao');

  // Define o texto da celebração (ex: "COMBO!" ou "LINHA!")
  celebracao.textContent = texto;

  // Aplica a classe visual (ex: animação especial para combo)
  celebracao.className = classe;

  // Torna o elemento visível no ecrã
  celebracao.style.display = 'block';

  // Após 1 segundo, esconde o elemento e limpa a classe aplicada
  setTimeout(() => {
    celebracao.style.display = 'none';
    celebracao.className = '';
  }, 1000);
}

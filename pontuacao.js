/**
 * pontuacao.js
 *
 * Módulo responsável por gerir a pontuação, os combos, o ranking dos jogadores
 * e as mensagens de celebração no ecrã durante o jogo.
 *
 * Inclui funções para:
 * - Calcular a pontuação com base nas linhas eliminadas
 * - Aplicar bónus por combos consecutivos
 * - Reiniciar o estado de pontuação e combo
 * - Atualizar visualmente a tabela de ranking
 * - Apresentar mensagens temporárias ("LINHA!" ou "COMBO!") de celebração
 *
 * Utilizado por cerebro.js para acompanhar o desempenho do jogador
 * e fornecer feedback visual de forma clara e reativa.
 */
// Estado da pontuação e do combo
export let pontuacao = 0;
export let comboContador = 0;

/**
 * Calcula e atualiza a pontuação com base nas linhas eliminadas
 * Aplica bónus de combo se estiver em sequência
 * @param {number} eliminadas - número de linhas eliminadas
 * @returns {number} - valor do bónus aplicado
 */
export function calcularPontuacao(eliminadas) {
  pontuacao += eliminadas * 100;
  comboContador++;

  const bonus = comboContador > 1 ? comboContador * 50 : 0;
  pontuacao += bonus;

  document.getElementById('score').textContent = pontuacao;
  return bonus;
}

/**
 * Reinicia a pontuação e o contador de combo
 */
export function resetarPontuacao() {
  pontuacao = 0;
  comboContador = 0;
  document.getElementById('score').textContent = pontuacao;
}

/**
 * Atualiza visualmente a lista de ranking no ecrã
 * @param {Array} ranking - lista de jogadores com nome, pontuação e data
 */
export function atualizarRankingVisual(ranking) {
  const lista = document.getElementById('ranking-list');
  lista.innerHTML = '';

  ranking.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item.nome} — ${item.pontuacao} pts (${item.data})`;
    lista.appendChild(li);
  });
}

/**
 * Mostra uma mensagem de celebração no centro do ecrã
 * Aplica classe visual especial se for um combo
 * @param {string} texto - Texto a mostrar ("LINHA!" ou "COMBO!")
 * @param {string} classe - Nome da classe CSS a aplicar (ex: "combo")
 */
export function mostrarCelebracao(texto, classe = '') {
  const celebracao = document.getElementById('celebracao');
  celebracao.textContent = texto;
  celebracao.className = classe;
  celebracao.style.display = 'block';

  setTimeout(() => {
    celebracao.style.display = 'none';
    celebracao.className = '';
  }, 1000);
}

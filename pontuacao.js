// Estado da pontuação e combo
export let pontuacao = 0;
export let comboContador = 0;

/**
 * Calcula e actualiza a pontuação com base nas linhas eliminadas
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

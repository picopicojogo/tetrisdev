/**
 * Actualiza visualmente a lista de ranking no ecrã
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

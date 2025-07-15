// Módulo de interface do utilizador: pontuação, tempo, modal e ranking

/**
 * Actualiza os elementos visuais de pontuação e nível
 * @param {number} score - pontuação atual
 * @param {number} level - nível atual
 */
export function atualizarPontuacao(score, level) {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
}

/**
 * Actualiza o cronómetro com base nos segundos decorridos
 * @param {HTMLElement} elTempo - elemento HTML que mostra o tempo
 * @param {number} segundos - tempo total decorrido (em segundos)
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Mostra o modal de fim de jogo com a pontuação final
 * @param {number} pontuacao - pontuação final alcançada
 */
export function mostrarModalFim(pontuacao) {
  document.getElementById("final-score").textContent = `Pontuação: ${pontuacao}`;
  document.getElementById("modal").classList.add("show");
}

/**
 * Actualiza a lista de ranking visualmente
 * @param {Array<{name: string, score: number}>} listaScores - top jogadores
 */
export function atualizarRanking(listaScores) {
  const medalhas = ["🥇", "🥈", "🥉"];
  const ul = document.getElementById("ranking-list");

  ul.innerHTML = listaScores.map((item, i) =>
    `<li>${medalhas[i] || `${i + 1}.`} ${item.name} - ${item.score}</li>`
  ).join("");
}

/**
 * Carrega as pontuações guardadas do localStorage e actualiza o ranking
 */
export function carregarRankingGuardado() {
  const guardados = JSON.parse(localStorage.getItem("scores") || "[]");
  atualizarRanking(guardados);
}

/**
 * Guarda a pontuação introduzida pelo jogador e actualiza o ranking
 * @param {number} pontuacao - pontuação final
 */
export function guardarPontuacao(pontuacao) {
  const nome = document.getElementById("player-name").value.trim();
  if (!nome) {
    alert("Por favor, insere o teu nome.");
    return;
  }

  const lista = JSON.parse(localStorage.getItem("scores") || "[]");
  lista.push({ name: nome, score: pontuacao });
  lista.sort((a, b) => b.score - a.score);
  lista.splice(10); // mantém apenas o top 10

  localStorage.setItem("scores", JSON.stringify(lista));
  atualizarRanking(lista);
  document.getElementById("modal").classList.remove("show");
}

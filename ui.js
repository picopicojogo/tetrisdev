// Módulo de interface: pontuacao, tempo, ranking, modal

/**
 * Actualiza pontuacao e nivel na interface
 * @param {number} pontuacao
 * @param {number} nivel
 */
export function atualizarPontuacao(pontuacao, nivel) {
  document.getElementById("score").textContent = pontuacao;
  document.getElementById("level").textContent = nivel;
}

/**
 * Actualiza o cronometro com base nos segundos
 * @param {HTMLElement} elTempo
 * @param {number} segundos
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Mostra o modal com pontuacao final
 * @param {number} pontuacao
 */
export function mostrarModalFim(pontuacao) {
  document.getElementById("final-score").textContent = `Pontuacao: ${pontuacao}`;
  document.getElementById("modal").classList.add("show");
}

/**
 * Actualiza a lista do ranking
 * @param {Array<{name: string, score: number}>} listaScores
 */
export function atualizarRanking(listaScores) {
  const medalhas = ["🥇", "🥈", "🥉"];
  const ul = document.getElementById("ranking-list");

  ul.innerHTML = listaScores.map((item, i) =>
    `<li>${medalhas[i] || `${i + 1}.`} ${item.name} - ${item.score}</li>`
  ).join("");
}

/**
 * Carrega pontuacoes guardadas do localStorage
 */
export function carregarRankingGuardado() {
  const guardados = JSON.parse(localStorage.getItem("scores") || "[]");
  atualizarRanking(guardados);
}

/**
 * Guarda pontuacao do jogador e actualiza o ranking
 * @param {number} pontuacao
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
  lista.splice(10); // limita ao top 10

  localStorage.setItem("scores", JSON.stringify(lista));
  atualizarRanking(lista);
  document.getElementById("modal").classList.remove("show");
}

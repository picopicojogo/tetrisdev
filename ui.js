// Módulo de interface do utilizador: modal, pontuação, tempo e ranking

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
 * Actualiza o cronómetro com base no tempo decorrido
 * @param {HTMLElement} elTempo - elemento HTML do tempo
 * @param {number} elapsed - segundos decorridos
 */
export function atualizarTempo(elTempo, elapsed) {
  const minutos = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const segundos = String(elapsed % 60).padStart(2, "0");
  elTempo.textContent = `${minutos}:${segundos}`;
}

/**
 * Mostra o modal de fim de jogo com pontuação final
 * @param {number} pontuacao - pontuação final do jogador
 */
export function mostrarModalFim(pontuacao) {
  document.getElementById("final-score").textContent = `Pontuação: ${pontuacao}`;
  document.getElementById("modal").classList.add("show");
}

/**
 * Actualiza visualmente o ranking dos melhores jogadores
 * @param {Array<{name: string, score: number}>} listaScores
 */
export function atualizarRanking(listaScores) {
  const medalhas = ["🥇", "🥈", "🥉"];
  const ul = document.getElementById("ranking-list");
  ul.innerHTML = listaScores
    .map((item, i) => `<li>${medalhas[i] || (i + 1)}. ${item.name} - ${item.score}</li>`)
    .join("");
}

/**
 * Carrega o ranking guardado do localStorage
 */
export function carregarRankingGuardado() {
  const guardados = JSON.parse(localStorage.getItem("scores") || "[]");
  atualizarRanking(guardados);
}

/**
 * Guarda a pontuação actual no localStorage e actualiza o ranking
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
  lista.splice(10); // mantém o top 10
  localStorage.setItem("scores", JSON.stringify(lista));

  atualizarRanking(lista);
  document.getElementById("modal").classList.remove("show");
}
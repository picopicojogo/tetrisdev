// Estado interno do jogo
let pontuacao = 0;
let nivel = 1;
let comboAtivo = false;

/**
 * Processa a pontuação consoante o número de linhas eliminadas
 * @param {number} linhasFeitas - número de linhas removidas após fixação da peça
 * @returns {{pontuacao: number, nivel: number}} - pontuação e nível actuais
 */
export function processarLinhas(linhasFeitas) {
  let pontosGanhos = 0;

  if (linhasFeitas >= 1) {
    if (linhasFeitas === 1) pontosGanhos = 100;
    else if (linhasFeitas === 2) pontosGanhos = 200;
    else if (linhasFeitas === 3) pontosGanhos = 300;
    else pontosGanhos = linhasFeitas * 100;

    if (linhasFeitas >= 2 && comboAtivo) {
      mostrarCelebracao("Combo!");
    } else {
      mostrarCelebracao("Linha!");
    }

    comboAtivo = true;
  } else {
    comboAtivo = false;
  }

  pontuacao += pontosGanhos;
  nivel = 1 + Math.floor(pontuacao / 500);

  atualizarPontuacao(pontuacao, nivel);

  return { pontuacao, nivel };
}

/**
 * Reinicia a pontuação e o estado de combo
 */
export function reiniciarPontuacao() {
  pontuacao = 0;
  nivel = 1;
  comboAtivo = false;
  atualizarPontuacao(pontuacao, nivel);
}

/**
 * Mostra uma breve mensagem visual no topo do ecrã
 * @param {string} texto - texto da celebração ("Linha!" ou "Combo!")
 */
function mostrarCelebracao(texto) {
  const el = document.getElementById("celebracao");
  if (!el) return;

  el.textContent = texto;
  el.style.opacity = "1";
  el.style.transform = "scale(1.1)";
  el.style.transition = "opacity 0.4s ease, transform 0.3s ease";

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "scale(1)";
  }, 800);
}

/**
 * Actualiza visualmente os elementos de pontuação e nível
 * @param {number} pontos - pontuação actual
 * @param {number} nivelActual - nível actual
 */
function atualizarPontuacao(pontos, nivelActual) {
  const elPontos = document.getElementById("score");
  const elNivel = document.getElementById("level");
  if (elPontos) elPontos.textContent = pontos;
  if (elNivel) elNivel.textContent = nivelActual;
}

/**
 * Guarda a pontuação no localStorage e actualiza o ranking
 * @param {number} pontuacaoFinal - pontuação final a registar
 */
export function guardarPontuacao(pontuacaoFinal) {
  const nome = document.getElementById("player-name")?.value.trim();
  if (!nome) {
    alert("Por favor, insere o teu nome.");
    return;
  }

  const agora = new Date();
  const data = agora.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const novoJogador = {
    name: nome,
    score: pontuacaoFinal,
    date: data
  };

  const lista = JSON.parse(localStorage.getItem("scores") || "[]");
  lista.push(novoJogador);
  lista.sort((a, b) => b.score - a.score);
  lista.splice(10); // mantém apenas os 10 melhores resultados
  localStorage.setItem("scores", JSON.stringify(lista));

  atualizarRanking(lista);

  // Fecha o modal após guardar
  document.getElementById("modal")?.classList.remove("show");

  // Torna o painel de ranking visível
  document.getElementById("ranking-container")?.classList.add("visivel");
}

/**
 * Actualiza a lista visual do ranking no elemento HTML
 * @param {Array<{name: string, score: number, date: string}>} lista - lista de jogadores
 */
function atualizarRanking(lista) {
  const ul = document.getElementById("ranking-list");
  if (!ul) return;

  ul.innerHTML = lista.map((jogador, i) =>
    `<li>${i + 1}. ${jogador.name} - ${jogador.score} pts (${jogador.date})</li>`
  ).join("");
}

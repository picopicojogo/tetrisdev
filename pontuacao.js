// Estado interno do jogo
let pontuacao = 0;
let nivel = 1;
let comboAtivo = false;

/**
 * Processa a pontuação consoante número de linhas eliminadas
 * @param {number} linhasFeitas - número de linhas removidas após fixação da peça
 * @returns {{pontuacao: number, nivel: number}} - pontuação atual e nível
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
 * Mostra uma mensagem visual animada no topo do ecrã
 * @param {string} texto - mensagem a apresentar ("Linha!" ou "Combo!")
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
 * Atualiza os elementos visuais de pontuação e nível
 * @param {number} pontos - pontuação atual
 * @param {number} nivelAtual - nível atual
 */
function atualizarPontuacao(pontos, nivelAtual) {
  const elPontos = document.getElementById("score");
  const elNivel = document.getElementById("level");
  if (elPontos) elPontos.textContent = pontos;
  if (elNivel) elNivel.textContent = nivelAtual;
}

/**
 * Guarda pontuação no localStorage e atualiza o ranking visual
 * @param {number} pontuacaoFinal - pontuação a guardar
 */
export function guardarPontuacao(pontuacaoFinal) {
  const nome = document.getElementById("player-name").value.trim();
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
  lista.splice(10); // mantém os 10 melhores
  localStorage.setItem("scores", JSON.stringify(lista));

  atualizarRanking(lista);
  document.getElementById("modal")?.classList.remove("show");
}

/**
 * Atualiza a lista visual de ranking no elemento HTML
 * @param {Array<{name: string, score: number, date: string}>} lista
 */
function atualizarRanking(lista) {
  const ul = document.getElementById("ranking-list");
  if (!ul) return;

  ul.innerHTML = lista.map((jogador, i) =>
    `<li>${i + 1}. ${jogador.name} - ${jogador.score} pts (${jogador.date})</li>`
  ).join("");
}

// Estado interno da pontuação
let pontuacao = 0;
let nivel = 1;
let comboAtivo = false;

/**
 * Processa a pontuação com base nas linhas eliminadas
 * @param {number} linhasFeitas - número de linhas removidas após fixar a peça
 * @returns {{pontuacao: number, nivel: number}} - pontuação total e nível atual
 */
export function processarLinhas(linhasFeitas) {
  let pontosGanhos = 0;

  // Pontuação consoante o número de linhas
  if (linhasFeitas >= 1) {
    if (linhasFeitas === 1) pontosGanhos = 100;
    else if (linhasFeitas === 2) pontosGanhos = 200;
    else if (linhasFeitas === 3) pontosGanhos = 300;
    else pontosGanhos = linhasFeitas * 100;

    // Se já houve uma linha antes, ativa combo visual
    if (linhasFeitas >= 2 && comboAtivo) {
      mostrarCelebracao("Combo!");
    } else {
      mostrarCelebracao("Linha!");
    }

    comboAtivo = true;
  } else {
    comboAtivo = false;
  }

  // Acumula pontuação e atualiza nível
  pontuacao += pontosGanhos;
  nivel = 1 + Math.floor(pontuacao / 500);

  atualizarPontuacao(pontuacao, nivel);

  return { pontuacao, nivel };
}

/**
 * Reinicia a pontuação e o estado do jogo
 */
export function reiniciarPontuacao() {
  pontuacao = 0;
  nivel = 1;
  comboAtivo = false;
  atualizarPontuacao(pontuacao, nivel);
}

/**
 * Mostra mensagem de celebração animada no topo do ecrã
 * @param {string} texto - mensagem a apresentar (ex. "Linha!", "Combo!")
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
 * Atualiza os valores da pontuação e do nível no interface
 * @param {number} pontos - valor atual de pontos
 * @param {number} nivelAtual - valor atual do nível
 */
function atualizarPontuacao(pontos, nivelAtual) {
  const elPontos = document.getElementById("score");
  const elNivel = document.getElementById("level");
  if (elPontos) elPontos.textContent = pontos;
  if (elNivel) elNivel.textContent = nivelAtual;
}

/**
 * Estado interno da pontuação
 */
let pontuacao = 0;
let nivel = 1;
let comboAtivo = false;

/**
 * Atualiza pontuação com base em número de linhas e combo
 * @param {number} linhasFeitas
 * @returns {{pontuacao: number, nivel: number}}
 */
export function processarLinhas(linhasFeitas) {
  if (linhasFeitas === 0) {
    comboAtivo = false;
    return { pontuacao, nivel };
  }

  let pontosGanhos = linhasFeitas * 100;

  if (comboAtivo && linhasFeitas >= 2) {
    pontosGanhos += 200;
    mostrarCelebracao("Combo!");
  } else {
    mostrarCelebracao("Linha!");
  }

  pontuacao += pontosGanhos;

  // Atualiza nível a cada 500 pontos
  const novoNivel = 1 + Math.floor(pontuacao / 500);
  nivel = novoNivel;

  comboAtivo = true;

  atualizarPontuacao(pontuacao, nivel);

  return { pontuacao, nivel };
}

/**
 * Reinicia a pontuação e estado interno
 */
export function reiniciarPontuacao() {
  pontuacao = 0;
  nivel = 1;
  comboAtivo = false;
  atualizarPontuacao(pontuacao, nivel);
}

/**
 * Função utilitária para mostrar mensagem no ecrã
 * @param {string} texto
 */
function mostrarCelebracao(texto) {
  const el = document.getElementById("celebracao");
  if (!el) return;

  el.textContent = texto;
  el.style.opacity = "1";

  setTimeout(() => {
    el.style.opacity = "0";
  }, 1000);
}

/**
 * Função externa para atualizar visual de pontuação (canvas.js)
 * Substitui esta importação em contexto real:
 * import { atualizarPontuacao } from './canvas.js'
 */
function atualizarPontuacao(pontos, nivel) {
  document.getElementById("score").textContent = pontos;
  document.getElementById("level").textContent = nivel;
}

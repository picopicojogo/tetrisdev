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

import {
  tocarCombo2,
  tocarCombo3,
  tocarComboFinal,
  tocarBonus
} from './audio.js';

import { aplicarEfeitosTabuleiro } from './canvas.js';

/**
 * Calcula e atualiza a pontuação com base nas linhas eliminadas.
 * Aplica bónus se o jogador estiver em sequência de combos.
 * @param {number} eliminadas - número de linhas eliminadas
 * @returns {number} - valor total de bónus aplicado
 */
export function calcularPontuacao(eliminadas) {
  if (eliminadas <= 0) return 0;

  pontuacao += eliminadas * 100;
  comboContador++;

  const bonus = comboContador > 1 ? comboContador * 50 : 0;
  pontuacao += bonus;

  const elemento = document.getElementById('score');
  if (elemento) elemento.textContent = pontuacao;

  aplicarCelebracao(eliminadas, comboContador, bonus);
  return bonus;
}

/**
 * Reinicia a pontuação e o contador de combo.
 */
export function resetarPontuacao() {
  pontuacao = 0;
  comboContador = 0;
  const elemento = document.getElementById('score');
  if (elemento) elemento.textContent = pontuacao;
}

/**
 * Mostra feedback visual e toca som apropriado para cada nível de combo.
 * @param {number} linhas - número de linhas eliminadas
 * @param {number} comboNivel - sequência atual de combos
 * @param {number} bonus - valor do bónus aplicado
 */
function aplicarCelebracao(linhas, comboNivel, bonus) {
  aplicarEfeitosTabuleiro(); // Flash ou vibração (se ativado)

  let texto = 'LINHA!';
  let classe = 'celebracao';

  if (comboNivel >= 3) {
    texto = 'ULTRA COMBO!';
    classe = 'combo-final';
    tocarComboFinal();
    tocarBonus();
  } else if (comboNivel === 2) {
    texto = 'SUPER COMBO!';
    classe = 'combo2';
    tocarCombo2();
  } else if (comboNivel === 1 && linhas >= 2) {
    texto = 'COMBO!';
    classe = 'combo';
    tocarCombo3();
  }

  mostrarCelebracao(texto, classe);
}

/**
 * Atualiza visualmente o ranking no ecrã.
 * @param {Array} ranking - lista de objetos com nome, pontuação, nível e data
 */
export function atualizarRankingVisual(ranking) {
  const lista = document.getElementById('ranking-list');
  if (!lista) return;
  lista.innerHTML = '';

  ranking.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item.nome} — ${item.pontuacao} pts — Nível ${item.nivel} (${item.data})`;
    lista.appendChild(li);
  });
}

/**
 * Mostra uma mensagem de celebração no centro do ecrã.
 * Aplica uma classe visual se definida.
 * @param {string} texto - mensagem a apresentar ("COMBO!", "LINHA!", etc.)
 * @param {string} classe - classe CSS a aplicar (ex: "combo-final")
 */
export function mostrarCelebracao(texto, classe = '') {
  const celebracao = document.getElementById('celebracao');
  if (!celebracao) return;
  celebracao.textContent = texto;
  celebracao.className = classe;
  celebracao.style.display = 'block';

  setTimeout(() => {
    celebracao.style.display = 'none';
    celebracao.className = '';
  }, 1000);
}

// canvas.js — desenho do tabuleiro principal e da próxima peça
import { COLUNAS, LINHAS, CORES } from "./motor.js";

/**
 * Desenha o tabuleiro e a peça atual no canvas principal
 */
export function desenharJogo(ctx, largura, altura, tabuleiro, peca, posicao) {
  ctx.clearRect(0, 0, largura, altura);
  const larguraBloco = largura / COLUNAS;
  const alturaBloco = altura / LINHAS;

  // Blocos fixos
  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      const valor = tabuleiro[y][x];
      if (valor) {
        desenharBloco(ctx, x, y, larguraBloco, alturaBloco, valor);
      }
    }
  }

  // Peça atual
  for (let y = 0; y < peca.length; y++) {
    for (let x = 0; x < peca[y].length; x++) {
      const valor = peca[y][x];
      if (valor) {
        const px = posicao.x + x;
        const py = posicao.y + y;
        if (py >= 0 && py < LINHAS) {
          desenharBloco(ctx, px, py, larguraBloco, alturaBloco, valor);
        }
      }
    }
  }
}

/**
 * Desenha a próxima peça centrada no canvas lateral
 */
export function desenharProxima(ctx, proxima) {
  const largura = ctx.canvas.width;
  const altura = ctx.canvas.height;
  ctx.clearRect(0, 0, largura, altura);

  const larguraBloco = largura / 4;
  const alturaBloco = altura / 4;

  const offsetX = (largura - proxima[0].length * larguraBloco) / 2;
  const offsetY = (altura - proxima.length * alturaBloco) / 2;

  for (let y = 0; y < proxima.length; y++) {
    for (let x = 0; x < proxima[y].length; x++) {
      const valor = proxima[y][x];
      if (valor) {
        const posX = offsetX + x * larguraBloco;
        const posY = offsetY + y * alturaBloco;
        desenharBlocoAbsoluto(ctx, posX, posY, larguraBloco, alturaBloco, valor);
      }
    }
  }
}

/**
 * Desenha um bloco com base nas coordenadas da grelha
 */
function desenharBloco(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(Math.floor(x * largura), Math.floor(y * altura), largura, altura);
}

/**
 * Desenha um bloco com coordenadas absolutas (canvas lateral)
 */
function desenharBlocoAbsoluto(ctx, x, y, largura, altura, valor) {
  ctx.fillStyle = obterCor(valor);
  ctx.fillRect(x, y, largura, altura);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, largura, altura);
}

/**
 * Cor por tipo de peça
 */
function obterCor(valor) {
  return CORES[valor] || "#FFFFFF";
}

//
// 🎮 Funções visuais do jogo — antigas do ui.js
//

export function atualizarPontuacao(pontuacao, nivel) {
  document.getElementById("score").textContent = pontuacao;
  document.getElementById("level").textContent = nivel;
}

/**
 * Atualiza o cronómetro MM:SS
 */
export function atualizarTempo(elTempo, segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  elTempo.textContent = `${min}:${seg}`;
}

/**
 * Mostra modal final
 */
export function mostrarModalFim(pontuacao) {
  const elPontuacao = document.getElementById("final-score");
  if (elPontuacao) {
    elPontuacao.textContent = `Pontuação: ${pontuacao}`;
  }
  document.getElementById("modal").classList.add("show");
}

/**
 * Atualiza visualmente a lista de ranking
 */
export function atualizarRanking(lista) {
  const medalhas = ["🥇", "🥈", "🥉"];
  const ul = document.getElementById("ranking-list");

  ul.innerHTML = lista.map((item, i) =>
    `<li>${medalhas[i] || `${i + 1}.`} ${item.name} - ${item.score}</li>`
  ).join("");
}

/**
 * Carrega ranking guardado
 */
export function carregarRankingGuardado() {
  const guardados = JSON.parse(localStorage.getItem("scores") || "[]");
  atualizarRanking(guardados);
}

/**
 * Guarda pontuação atual
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
  lista.splice(10);
  localStorage.setItem("scores", JSON.stringify(lista));

  atualizarRanking(lista);
  document.getElementById("modal").classList.remove("show");
}

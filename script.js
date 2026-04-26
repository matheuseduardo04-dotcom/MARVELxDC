const API = "";

// ── Navigation ──────────────────────────────
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach((b) => b.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelector(`[data-page="${id}"]`).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Load Popular Heroes ─────────────────────
async function loadHeroes() {
  const grid = document.getElementById("heroGrid");
  grid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const res = await fetch(`${API}/herois/`);
    if (!res.ok) throw new Error("Erro ao carregar heróis");
    const data = await res.json();
    renderHeroGrid(data.herois, grid);
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--text-2);text-align:center;grid-column:1/-1">Erro ao carregar heróis. Verifique se o servidor está rodando.</p>`;
  }
}

function renderHeroGrid(herois, container) {
  container.innerHTML = herois
    .map(
      (h) => `
    <div class="hero-card" onclick="openHeroModal('${h.nome.replace(/'/g, "\\'")}')">
      <img src="${h.foto_url}" alt="${h.nome}" class="hero-card-img" loading="lazy">
      <div class="hero-card-info">
        <span class="hero-card-name">${h.nome}</span>
        <span class="hero-card-publisher ${h.editora === 'Marvel Comics' ? 'marvel' : 'dc'}">${h.editora === 'Marvel Comics' ? 'MARVEL' : 'DC'}</span>
      </div>
    </div>`
    )
    .join("");
}

// ── Hero Modal ──────────────────────────────
async function openHeroModal(nome) {
  const modal = document.getElementById("heroModal");
  const body = document.getElementById("modalBody");
  modal.style.display = "flex";
  body.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  document.body.style.overflow = "hidden";

  try {
    const res = await fetch(`${API}/herois/${encodeURIComponent(nome)}`);
    if (!res.ok) throw new Error("Herói não encontrado");
    const h = res.ok ? await res.json() : null;
    if (!h) throw new Error("Herói não encontrado");

    const isMarvel = h.editora === "Marvel Comics";
    const accent = isMarvel ? "var(--marvel)" : "var(--dc)";

    body.innerHTML = `
      <div class="modal-hero">
        <div class="modal-hero-header">
          <img src="${h.foto_url}" alt="${h.nome}" class="modal-hero-img">
          <div class="modal-hero-title">
            <h2>${h.nome}</h2>
            <span class="hero-card-publisher ${isMarvel ? 'marvel' : 'dc'}">${isMarvel ? 'MARVEL' : 'DC'}</span>
            ${h.biografia?.["full-name"] ? `<p class="modal-real-name">${h.biografia["full-name"]}</p>` : ""}
          </div>
        </div>
        <div class="modal-stats">
          ${renderStat("Inteligência", h.inteligencia, accent)}
          ${renderStat("Força", h.forca, accent)}
          ${renderStat("Velocidade", h.velocidade, accent)}
          ${renderStat("Durabilidade", h.durabilidade, accent)}
          ${renderStat("Poder", h.poder, accent)}
          ${renderStat("Combate", h.combate, accent)}
        </div>
        ${h.biografia?.["place-of-birth"] ? `<p class="modal-bio-item"><strong>Origem:</strong> ${h.biografia["place-of-birth"]}</p>` : ""}
        ${h.biografia?.["first-appearance"] ? `<p class="modal-bio-item"><strong>1ª Aparição:</strong> ${h.biografia["first-appearance"]}</p>` : ""}
        ${h.biografia?.aliases?.length ? `<p class="modal-bio-item"><strong>Aliases:</strong> ${Array.isArray(h.biografia.aliases) ? h.biografia.aliases.join(", ") : h.biografia.aliases}</p>` : ""}
      </div>
    `;
  } catch (err) {
    body.innerHTML = `<p class="error-box">${err.message}</p>`;
  }
}

function renderStat(label, value, color) {
  const num = parseInt(value) || 0;
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar" style="width:${num}%;background:${color}"></div>
      </div>
      <span class="stat-value">${value || "?"}</span>
    </div>`;
}

function closeModal() {
  document.getElementById("heroModal").style.display = "none";
  document.body.style.overflow = "";
}

document.getElementById("heroModal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) closeModal();
});

// ── Search ──────────────────────────────────
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  searchHero();
});

async function searchHero() {
  const nome = document.getElementById("searchInput").value.trim();
  const errBox = document.getElementById("searchError");
  const loading = document.getElementById("searchLoading");
  const result = document.getElementById("searchResult");

  errBox.style.display = "none";
  result.style.display = "none";

  if (!nome) {
    errBox.textContent = "Digite o nome de um herói.";
    errBox.style.display = "block";
    return;
  }

  loading.style.display = "flex";

  try {
    const res = await fetch(`${API}/herois/${encodeURIComponent(nome)}`);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Herói não encontrado");
    }
    const h = await res.json();
    renderSearchResult(h);
  } catch (err) {
    errBox.textContent = err.message;
    errBox.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

function renderSearchResult(h) {
  const result = document.getElementById("searchResult");
  const isMarvel = h.editora === "Marvel Comics";
  const accent = isMarvel ? "var(--marvel)" : "var(--dc)";

  result.innerHTML = `
    <div class="search-result-card">
      <div class="modal-hero-header">
        <img src="${h.foto_url}" alt="${h.nome}" class="modal-hero-img">
        <div class="modal-hero-title">
          <h2>${h.nome}</h2>
          <span class="hero-card-publisher ${isMarvel ? 'marvel' : 'dc'}">${isMarvel ? 'MARVEL' : 'DC'}</span>
          ${h.biografia?.["full-name"] ? `<p class="modal-real-name">${h.biografia["full-name"]}</p>` : ""}
        </div>
      </div>
      <div class="modal-stats">
        ${renderStat("Inteligência", h.inteligencia, accent)}
        ${renderStat("Força", h.forca, accent)}
        ${renderStat("Velocidade", h.velocidade, accent)}
        ${renderStat("Durabilidade", h.durabilidade, accent)}
        ${renderStat("Poder", h.poder, accent)}
        ${renderStat("Combate", h.combate, accent)}
      </div>
    </div>
  `;
  result.style.display = "block";
}

// ── Battle ──────────────────────────────────
const battleHeroes = [null, null];

async function searchBattleHero(slot, event) {
  event.preventDefault();
  const input = document.getElementById(`battleInput${slot}`);
  const container = document.getElementById(`battleHero${slot}`);
  const errBox = document.getElementById("battleError");
  const nome = input.value.trim();

  errBox.style.display = "none";

  if (!nome) {
    errBox.textContent = "Digite o nome de um herói.";
    errBox.style.display = "block";
    return;
  }

  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const res = await fetch(`${API}/herois/${encodeURIComponent(nome)}`);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Herói não encontrado");
    }
    const h = await res.json();
    battleHeroes[slot - 1] = h;

    const isMarvel = h.editora === "Marvel Comics";
    container.innerHTML = `
      <div class="battle-hero-card">
        <img src="${h.foto_url}" alt="${h.nome}" class="battle-hero-img">
        <h4>${h.nome}</h4>
        <span class="hero-card-publisher ${isMarvel ? 'marvel' : 'dc'}">${isMarvel ? 'MARVEL' : 'DC'}</span>
      </div>
    `;

    document.getElementById("battleStartBtn").disabled = !(battleHeroes[0] && battleHeroes[1]);
  } catch (err) {
    container.innerHTML = "";
    errBox.textContent = err.message;
    errBox.style.display = "block";
  }
}

async function startBattle() {
  const btn = document.getElementById("battleStartBtn");
  const errBox = document.getElementById("battleError");
  const narBox = document.getElementById("narrationBox");

  btn.disabled = true;
  btn.textContent = "⏳ NARRANDO...";
  errBox.style.display = "none";
  narBox.style.display = "none";

  const h1 = battleHeroes[0];
  const h2 = battleHeroes[1];

  const prompt = `Narre uma batalha épica entre ${h1.nome} (${h1.editora}) e ${h2.nome} (${h2.editora}).
Stats de ${h1.nome}: Inteligência ${h1.inteligencia}, Força ${h1.forca}, Velocidade ${h1.velocidade}, Durabilidade ${h1.durabilidade}, Poder ${h1.poder}, Combate ${h1.combate}.
Stats de ${h2.nome}: Inteligência ${h2.inteligencia}, Força ${h2.forca}, Velocidade ${h2.velocidade}, Durabilidade ${h2.durabilidade}, Poder ${h2.poder}, Combate ${h2.combate}.
Baseie o resultado nos stats. Narração curta, dramática, em português.`;

  try {
    const res = await fetch(`${API}/herois/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: prompt }),
    });
    if (!res.ok) throw new Error("Erro ao gerar narração");
    const data = await res.json();
    showNarration(data.resposta);
  } catch (err) {
    errBox.textContent = err.message;
    errBox.style.display = "block";
  } finally {
    btn.disabled = false;
    btn.textContent = "⚔ BATALHAR";
  }
}

function showNarration(text) {
  const box = document.getElementById("narrationBox");
  box.style.display = "block";
  box.innerHTML = "";
  box.className = "narration-box";

  let i = 0;
  const speed = 20;
  function type() {
    if (i < text.length) {
      box.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── Quiz ────────────────────────────────────
let quizData = [];
let quizIndex = 0;
let quizScore = 0;

document.getElementById("quizForm").addEventListener("submit", (e) => {
  e.preventDefault();
  generateQuiz();
});

async function generateQuiz() {
  const nome = document.getElementById("quizInput").value.trim();
  const errBox = document.getElementById("quizError");
  const loading = document.getElementById("quizLoading");
  const content = document.getElementById("quizContent");
  const btn = document.getElementById("quizBtn");

  errBox.style.display = "none";
  content.innerHTML = "";

  if (!nome) {
    errBox.textContent = "Digite o nome de um herói.";
    errBox.style.display = "block";
    return;
  }

  loading.style.display = "flex";
  btn.disabled = true;

  const prompt = `Crie um quiz de 5 perguntas sobre o herói ${nome} (Marvel ou DC).
Responda APENAS com um JSON array, sem markdown, sem explicação. Formato:
[{"pergunta":"texto","opcoes":["a","b","c","d"],"correta":0}]
onde "correta" é o índice (0-3) da opção certa.`;

  try {
    const res = await fetch(`${API}/herois/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: prompt }),
    });
    if (!res.ok) throw new Error("Erro ao gerar quiz");
    const data = await res.json();

    let jsonStr = data.resposta;
    const match = jsonStr.match(/\[[\s\S]*\]/);
    if (match) jsonStr = match[0];
    quizData = JSON.parse(jsonStr);
    quizIndex = 0;
    quizScore = 0;
    renderQuestion();
  } catch (err) {
    errBox.textContent = "Erro ao gerar quiz. Tente novamente.";
    errBox.style.display = "block";
  } finally {
    loading.style.display = "none";
    btn.disabled = false;
  }
}

function renderQuestion() {
  const content = document.getElementById("quizContent");
  const q = quizData[quizIndex];

  content.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">Pergunta ${quizIndex + 1} de ${quizData.length}</div>
      <h3 class="quiz-question">${q.pergunta}</h3>
      <div class="quiz-options">
        ${q.opcoes.map((o, i) => `<button class="quiz-option" onclick="selectAnswer(${i})">${o}</button>`).join("")}
      </div>
    </div>
  `;
}

function selectAnswer(idx) {
  const q = quizData[quizIndex];
  const buttons = document.querySelectorAll(".quiz-option");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correta) btn.classList.add("correct");
    if (i === idx && idx !== q.correta) btn.classList.add("wrong");
  });

  if (idx === q.correta) quizScore++;

  setTimeout(() => nextQuestion(), 1200);
}

function nextQuestion() {
  quizIndex++;
  if (quizIndex < quizData.length) {
    renderQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const content = document.getElementById("quizContent");
  const pct = Math.round((quizScore / quizData.length) * 100);
  let emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👏" : pct >= 40 ? "😅" : "💀";

  content.innerHTML = `
    <div class="quiz-result">
      <span class="quiz-emoji">${emoji}</span>
      <h3>Você acertou ${quizScore} de ${quizData.length}</h3>
      <p class="quiz-pct">${pct}%</p>
      <button class="btn-primary" onclick="resetQuiz()">JOGAR NOVAMENTE</button>
    </div>
  `;
}

function resetQuiz() {
  quizData = [];
  quizIndex = 0;
  quizScore = 0;
  document.getElementById("quizContent").innerHTML = "";
  document.getElementById("quizInput").value = "";
}

// ── Init ────────────────────────────────────
loadHeroes();

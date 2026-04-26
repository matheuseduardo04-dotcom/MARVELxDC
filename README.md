<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg" alt="Marvel" height="60">
  &nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/VS-111111?style=for-the-badge" alt="VS">
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/DC_Comics_logo.svg" alt="DC" height="60">
</p>

<h1 align="center">MARVEL × DC</h1>

<p align="center">
  <b>Explore heróis, simule batalhas épicas narradas por IA e teste seus conhecimentos com quizzes interativos.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Anthropic-191919?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

---

## Sobre o Projeto

**Marvel x DC** é uma aplicação web fullstack que combina dados reais de super-heróis com inteligência artificial para criar uma experiência interativa e imersiva. Busque heróis da Marvel e DC, coloque-os frente a frente em batalhas narradas por IA e desafie seus conhecimentos com quizzes gerados dinamicamente.

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Catálogo de Heróis** | Grid com 22 heróis populares de Marvel e DC, com fotos e powerstats |
| **Busca Inteligente** | Busca por nome em inglês ou português (ex: "Homem-Aranha" → Spider-Man) |
| **Batalha Épica** | Escolha dois heróis e receba uma narração dramatizada gerada por IA |
| **Quiz de Trivia** | Perguntas de múltipla escolha sobre qualquer herói, geradas em tempo real |
| **Cache Local** | Banco SQLite para evitar chamadas repetidas à API externa |

## Arquitetura

```
marvelXdc/
├── app/
│   ├── main.py                 # FastAPI app + lifespan
│   ├── config.py               # Variáveis de ambiente
│   ├── rotas/
│   │   ├── herois.py           # CRUD e chat de heróis
│   │   ├── batalha.py          # Endpoint de batalha
│   │   └── quiz.py             # Endpoint de quiz
│   └── servicos/
│       ├── superhero_servico.py  # Integração com SuperHero API
│       ├── claude_servico.py     # Integração com Claude (Anthropic)
│       └── db_servico.py         # Cache SQLite (aiosqlite)
├── frontend/
│   ├── index.html              # SPA com navegação por seções
│   ├── style.css               # Design dark theme Marvel/DC
│   ├── script.js               # Lógica do frontend
│   └── public/                 # Imagens (logos, banner)
├── requirements.txt
├── .env.example
└── .gitignore
```

## Stack Utilizada

### Back-end

| Tecnologia | Uso |
|---|---|
| <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"> | Linguagem principal |
| <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"> | Framework web assíncrono |
| <img src="https://img.shields.io/badge/Uvicorn-4051B5?style=flat-square&logo=gunicorn&logoColor=white"> | Servidor ASGI |
| <img src="https://img.shields.io/badge/Anthropic_Claude-191919?style=flat-square&logo=anthropic&logoColor=white"> | IA para narrações, quizzes e chat |
| <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white"> | Banco de dados local (cache) |
| <img src="https://img.shields.io/badge/HTTPX-3776AB?style=flat-square&logo=python&logoColor=white"> | Cliente HTTP assíncrono |

### Front-end

| Tecnologia | Uso |
|---|---|
| <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"> | Estrutura da SPA |
| <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"> | Estilização com design system dark |
| <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> | Lógica e interatividade |
| <img src="https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white"> | Tipografia (Bebas Neue + Inter) |

### APIs Externas

| API | Uso |
|---|---|
| <img src="https://img.shields.io/badge/SuperHero_API-FF6600?style=flat-square&logo=zap&logoColor=white"> | Dados reais dos heróis (stats, biografia, imagens) |
| <img src="https://img.shields.io/badge/Claude_API-191919?style=flat-square&logo=anthropic&logoColor=white"> | Geração de texto (narrações, quiz, chat) |

## Como Rodar

### Pre-requisitos

- Python 3.11+
- Chave da [SuperHero API](https://superheroapi.com)
- Chave da [Anthropic API](https://console.anthropic.com)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/marvelXdc.git
cd marvelXdc

# Crie e ative o ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves
```

### Execução

```bash
uvicorn app.main:app --reload
```

Acesse **http://localhost:8000** no navegador.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/saude` | Health check |
| `GET` | `/herois/` | Lista heróis populares |
| `GET` | `/herois/{nome}` | Busca herói por nome |
| `POST` | `/herois/chat` | Chat sobre heróis via IA |
| `GET` | `/batalha/{heroi1}/{heroi2}` | Narra batalha entre dois heróis |
| `GET` | `/quiz/{nome_heroi}` | Gera quiz sobre um herói |

A documentação interativa está disponível em **http://localhost:8000/docs** (Swagger UI).

## Preview

<p align="center">
  <img src="https://img.shields.io/badge/DARK_THEME-080808?style=for-the-badge" alt="Dark Theme">
  <img src="https://img.shields.io/badge/MARVEL-E62429?style=for-the-badge" alt="Marvel Red">
  <img src="https://img.shields.io/badge/DC-0476F2?style=for-the-badge" alt="DC Blue">
  <img src="https://img.shields.io/badge/RESPONSIVE-22C55E?style=for-the-badge" alt="Responsive">
</p>

---

<p align="center">
  Feito com <img src="https://img.shields.io/badge/❤-E62429?style=flat-square" alt="love"> e <img src="https://img.shields.io/badge/☕-F5A623?style=flat-square" alt="coffee"> por <b>Matheus</b>
</p>


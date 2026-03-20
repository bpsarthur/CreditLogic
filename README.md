# CreditLogic - Motor de Decisao para Aprovacao de Credito

Projeto academico fullstack que implementa um Motor de Decisao baseado em Tabela Verdade com 12 proposicoes logicas para analise de aprovacao de credito.

---

## Sumario

1. [Visao Geral](#visao-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnologica](#stack-tecnologica)
4. [Instalacao e Execucao](#instalacao-e-execucao)
5. [Acesso pela Rede Local](#acesso-pela-rede-local)
6. [Regras de Decisao](#regras-de-decisao)
7. [API Backend](#api-backend)
8. [Estrutura do Backend](#estrutura-do-backend)
9. [Estrutura do Frontend](#estrutura-do-frontend)
10. [Painel Administrativo](#painel-administrativo)
11. [Fluxo do Usuario](#fluxo-do-usuario)
12. [Banco de Dados](#banco-de-dados)
13. [Estilizacao](#estilizacao)

---

## Visao Geral

O CreditLogic e um sistema de analise de credito que avalia 12 proposicoes logicas sobre um solicitante e determina se o credito deve ser **APROVADO** ou **REPROVADO** com base em uma tabela verdade simplificada.

O sistema possui:
- Interface publica com formulario passo a passo (wizard) para analise de credito
- Pagina de resultado com expressao logica avaliada
- Pagina explicativa da tabela verdade e regras
- Painel administrativo com dashboard, listagem de analises, logs de acesso e estatisticas com graficos

---

## Arquitetura

```
+-------------------+        HTTP/JSON        +-------------------+
|                   | <---------------------> |                   |
|  Frontend (React) |                         |  Backend (Django) |
|  Vite Dev Server  |                         |  REST Framework   |
|  Porta: 5173      |                         |  Porta: 8000      |
|                   |                         |                   |
+-------------------+                         +--------+----------+
                                                       |
                                                       v
                                              +-------------------+
                                              |  SQLite Database  |
                                              |  db.sqlite3       |
                                              +-------------------+
```

- **Frontend** faz requisicoes HTTP (Axios) para a API REST do backend
- **Backend** processa a logica de decisao, persiste dados e retorna JSON
- **CORS** habilitado para permitir comunicacao entre portas diferentes
- **Sessoes Django** usadas para autenticacao do painel admin

---

## Stack Tecnologica

### Backend
| Tecnologia | Versao | Funcao |
|---|---|---|
| Python | 3.x | Linguagem do backend |
| Django | 4.x | Framework web |
| Django REST Framework | - | Construcao da API REST |
| django-cors-headers | - | Controle de CORS |
| Faker | - | Geracao de dados ficticios para testes |
| SQLite | 3 | Banco de dados |

### Frontend
| Tecnologia | Versao | Funcao |
|---|---|---|
| React | 19.2.4 | Biblioteca de UI |
| React Router DOM | 7.13.1 | Roteamento SPA |
| Axios | 1.13.6 | Cliente HTTP |
| Recharts | 3.8.0 | Graficos e visualizacoes |
| Vite | 8.0.0 | Bundler e dev server |

---

## Instalacao e Execucao

### Pre-requisitos
- Python 3.8+
- Node.js 18+
- npm 9+

### Backend

```bash
cd creditlogic/backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed        # (Opcional) Gera 50 analises ficticias
python manage.py runserver
```

O backend roda em `http://localhost:8000`

### Frontend

```bash
cd creditlogic/frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`

---

## Acesso pela Rede Local

Para que outros dispositivos na mesma rede acessem o sistema:

### Backend
```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend
O script `dev` ja inclui a flag `--host`, expondo o servidor na rede.

### Configuracoes aplicadas
- `ALLOWED_HOSTS = ["*"]` no Django (settings.py)
- `CORS_ALLOW_ALL_ORIGINS = True` no Django (settings.py)
- O frontend detecta o hostname do navegador automaticamente para montar a URL da API (`window.location.hostname`)

Outros usuarios acessam via `http://<SEU_IP>:5173`

---

## Regras de Decisao

### As 12 Proposicoes

| # | Descricao | Obrigatoria |
|---|-----------|:-----------:|
| P1 | Renda mensal >= R$ 2.000 | Sim |
| P2 | Nao possui restricoes no CPF (SPC/Serasa) | Sim |
| P3 | Idade entre 18 e 65 anos | Sim |
| P4 | Tempo de emprego >= 6 meses | Nao |
| P5 | Nao possui emprestimo ativo em atraso | Nao |
| P6 | Score de credito >= 500 | Sim |
| P7 | Possui conta bancaria ativa | Nao |
| P8 | Residencia estavel (mesmo endereco >= 1 ano) | Nao |
| P9 | Nao e reu em acao judicial financeira | Nao |
| P10 | Renda comprometida < 30% | Nao |
| P11 | Possui ao menos 1 referencia pessoal verificavel | Nao |
| P12 | Documentacao completa e valida | Sim |

### Formula de Decisao

```
(P1 ^ P2 ^ P3 ^ P6 ^ P12) ^ (total_verdadeiras >= 8)
```

**APROVADO** se e somente se:
1. Todas as 5 proposicoes obrigatorias (P1, P2, P3, P6, P12) sao VERDADEIRAS
2. Pelo menos 8 das 12 proposicoes totais sao VERDADEIRAS

Caso contrario: **REPROVADO**

---

## API Backend

### Endpoints Publicos

#### `POST /api/analise/`
Cria uma nova analise de credito.

**Request body:**
```json
{
  "nome_solicitante": "Joao da Silva",
  "p1": true, "p2": true, "p3": true, "p4": false,
  "p5": true, "p6": true, "p7": true, "p8": true,
  "p9": false, "p10": true, "p11": false, "p12": true
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome_solicitante": "Joao da Silva",
  "p1": true, "p2": true, "...": "...", "p12": true,
  "total_verdadeiras": 9,
  "resultado": "APROVADO",
  "expressao_logica": "(P1=V ^ P2=V ^ ... ^ P12=V)\nObrigatorias ... = V\nTotal verdadeiras = 9/12 ...",
  "ip_address": "192.168.1.10",
  "user_agent": "Mozilla/5.0 ...",
  "criado_em": "2026-03-16T14:30:00-03:00"
}
```

#### `GET /api/tabela-verdade/`
Retorna as proposicoes e regras de decisao.

**Response (200):**
```json
{
  "proposicoes": [
    {"id": "p1", "descricao": "Renda mensal >= R$ 2.000", "obrigatoria": true},
    "..."
  ],
  "regras": {
    "obrigatorias": ["p1", "p2", "p3", "p6", "p12"],
    "minimo_verdadeiras": 8,
    "total_proposicoes": 12,
    "formula": "(P1 ^ P2 ^ P3 ^ P6 ^ P12) ^ (total_verdadeiras >= 8)"
  }
}
```

### Endpoints Admin (requerem autenticacao por sessao)

#### `POST /api/admin/login/`
Realiza login do administrador.

**Request body:**
```json
{"username": "admin", "password": "creditlogic2026"}
```

**Response (200):** `{"message": "Login realizado com sucesso"}`
**Response (401):** `{"error": "Credenciais invalidas"}`

#### `POST /api/admin/logout/`
Encerra a sessao do administrador.

**Response (200):** `{"message": "Logout realizado"}`

#### `GET /api/admin/check/`
Verifica se o usuario esta autenticado.

**Response (200):** `{"authenticated": true}`
**Response (401):** `{"authenticated": false}`

#### `GET /api/admin/dashboard/`
Retorna estatisticas resumidas e as 5 ultimas analises.

**Response (200):**
```json
{
  "total_analises": 50,
  "aprovados": 12,
  "reprovados": 38,
  "taxa_aprovacao": 24.0,
  "ultimas_analises": ["...array de objetos Analise..."]
}
```

#### `GET /api/admin/analises/`
Lista todas as analises com paginacao e filtros.

**Query params:**
| Param | Tipo | Descricao |
|---|---|---|
| `page` | int | Numero da pagina (padrao: 1) |
| `page_size` | int | Itens por pagina (padrao: 20) |
| `resultado` | string | Filtro: "APROVADO" ou "REPROVADO" |
| `busca` | string | Busca por nome do solicitante |

**Response (200):**
```json
{
  "results": ["...array de analises..."],
  "total": 50,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

#### `GET /api/admin/logs/`
Lista logs de acesso HTTP com paginacao e filtro.

**Query params:**
| Param | Tipo | Descricao |
|---|---|---|
| `page` | int | Numero da pagina (padrao: 1) |
| `page_size` | int | Itens por pagina (padrao: 20) |
| `metodo` | string | Filtro por metodo HTTP (GET, POST, etc.) |

**Response (200):**
```json
{
  "results": ["...array de logs..."],
  "total": 200,
  "page": 1,
  "page_size": 20,
  "total_pages": 10
}
```

#### `GET /api/admin/stats/`
Retorna estatisticas avancadas para graficos.

**Response (200):**
```json
{
  "total": 50,
  "aprovados": 12,
  "reprovados": 38,
  "taxa_aprovacao": 24.0,
  "por_dia": [{"data": "2026-03-16", "total": 5, "aprovados": 2}],
  "distribuicao_proposicoes": [{"total_verdadeiras": 8, "count": 3}],
  "proposicoes_stats": {
    "p1": {"verdadeiras": 30, "falsas": 20, "taxa": 60.0}
  }
}
```

---

## Estrutura do Backend

```
backend/
|-- manage.py                          # Utilitario de gerenciamento Django
|-- requirements.txt                   # Dependencias Python
|-- db.sqlite3                         # Banco de dados SQLite
|-- creditlogic/
|   |-- __init__.py
|   |-- settings.py                    # Configuracoes do Django
|   |-- urls.py                        # URLs raiz (inclui core.urls)
|   |-- wsgi.py                        # Entry point WSGI
|   |-- asgi.py                        # Entry point ASGI
|-- core/
    |-- __init__.py
    |-- apps.py                        # Configuracao do app Django
    |-- admin.py                       # Django admin (vazio)
    |-- models.py                      # Modelos: Analise, AcessoLog
    |-- views.py                       # Views publicas da API
    |-- admin_views.py                 # Views do painel admin
    |-- serializers.py                 # Serializadores DRF
    |-- logic.py                       # Motor de decisao (tabela verdade)
    |-- middleware.py                   # Middleware de log de acessos
    |-- urls.py                        # Rotas da API
    |-- management/
        |-- commands/
            |-- seed.py                # Comando para gerar dados ficticios
```

### Descricao dos Modulos

#### `core/logic.py` - Motor de Decisao
Contem a lista `PROPOSICOES` com as 12 proposicoes e a funcao `avaliar_credito()`.

A funcao `avaliar_credito(p1, p2, ..., p12)`:
1. Recebe 12 valores booleanos como parametros
2. Conta o total de proposicoes verdadeiras
3. Verifica se as obrigatorias (P1, P2, P3, P6, P12) sao todas verdadeiras
4. Verifica se o total de verdadeiras >= 8
5. Retorna dicionario com `resultado`, `expressao_logica` e `total_verdadeiras`

#### `core/models.py` - Modelos de Dados

**Analise** - Armazena cada analise de credito realizada:
- `nome_solicitante` (CharField, max 200) - Nome do solicitante
- `p1` a `p12` (BooleanField) - Valor de cada proposicao
- `total_verdadeiras` (IntegerField) - Contagem de proposicoes verdadeiras
- `resultado` (CharField) - "APROVADO" ou "REPROVADO"
- `expressao_logica` (TextField) - Expressao logica completa avaliada
- `ip_address` (GenericIPAddressField) - IP do solicitante
- `user_agent` (TextField) - User-Agent do navegador
- `criado_em` (DateTimeField) - Data/hora da criacao (automatico)
- Ordenacao padrao: mais recente primeiro (`-criado_em`)

**AcessoLog** - Registra cada requisicao HTTP ao sistema:
- `ip_address` (GenericIPAddressField) - IP do visitante
- `user_agent` (TextField) - User-Agent do navegador
- `pagina_acessada` (CharField, max 500) - Path da URL acessada
- `metodo_http` (CharField, max 10) - Metodo HTTP (GET, POST, etc.)
- `criado_em` (DateTimeField) - Data/hora do acesso (automatico)
- Ordenacao padrao: mais recente primeiro (`-criado_em`)

#### `core/views.py` - Views Publicas

**`criar_analise(request)`** - POST /api/analise/
1. Valida os dados recebidos com `AnaliseInputSerializer`
2. Extrai as 12 proposicoes do payload validado
3. Chama `avaliar_credito()` para obter o resultado
4. Cria registro `Analise` no banco com todos os dados + IP e User-Agent
5. Retorna o objeto criado serializado com status 201

**`tabela_verdade(request)`** - GET /api/tabela-verdade/
1. Retorna a lista de proposicoes (de `PROPOSICOES` em logic.py)
2. Retorna as regras de decisao (obrigatorias, minimo, formula)

#### `core/serializers.py` - Serializadores

- **AnaliseInputSerializer** - Valida entrada: `nome_solicitante` (string) + `p1` a `p12` (boolean, default False)
- **AnaliseSerializer** - Serializa modelo Analise completo (todos os campos)
- **AcessoLogSerializer** - Serializa modelo AcessoLog completo (todos os campos)

#### `core/admin_views.py` - Views do Painel Admin

Autenticacao por sessao Django com credenciais hardcoded:
- Usuario: `admin`
- Senha: `creditlogic2026`

O decorator `@admin_required` protege as views verificando `request.session["admin_logged_in"]`.

**Views:**
- `admin_login` - Valida credenciais e cria sessao
- `admin_logout` - Destroi sessao
- `admin_check` - Retorna status de autenticacao
- `admin_dashboard` - Calcula totais, taxa de aprovacao e retorna ultimas 5 analises
- `admin_analises` - Lista analises com paginacao manual e filtros (resultado, busca por nome)
- `admin_logs` - Lista logs de acesso com paginacao e filtro por metodo HTTP
- `admin_stats` - Calcula estatisticas avancadas: analises por dia, distribuicao de proposicoes verdadeiras, taxa individual de cada proposicao

#### `core/middleware.py` - Middleware de Log

**AcessoLogMiddleware** intercepta todas as requisicoes HTTP (exceto `/static/`) e registra:
- IP (com suporte a X-Forwarded-For para proxies)
- User-Agent
- Path acessado
- Metodo HTTP
- Timestamp automatico

#### `core/management/commands/seed.py` - Seed de Dados

Comando `python manage.py seed` que gera 50 analises ficticias usando:
- `Faker("pt_BR")` para nomes brasileiros, IPs e user agents
- Valores aleatorios (True/False) para cada proposicao
- Avaliacao real pela funcao `avaliar_credito()`

---

## Estrutura do Frontend

```
frontend/
|-- index.html                         # HTML base do SPA
|-- package.json                       # Dependencias e scripts npm
|-- vite.config.js                     # Configuracao do Vite
|-- eslint.config.js                   # Configuracao do ESLint
|-- src/
    |-- main.jsx                       # Entry point React (StrictMode)
    |-- App.jsx                        # Roteador e rotas protegidas
    |-- services/
    |   |-- api.js                     # Cliente Axios e funcoes de API
    |-- components/
    |   |-- Navbar.jsx                 # Barra de navegacao
    |   |-- ToggleSwitch.jsx           # Componente toggle (legado)
    |-- pages/
    |   |-- Home.jsx                   # Formulario wizard passo a passo
    |   |-- Resultado.jsx              # Exibicao do resultado
    |   |-- TabelaVerdade.jsx          # Explicacao das regras
    |   |-- admin/
    |       |-- AdminLogin.jsx         # Tela de login admin
    |       |-- AdminDashboard.jsx     # Dashboard com metricas
    |       |-- AdminAnalises.jsx      # Listagem de analises
    |       |-- AdminLogs.jsx          # Listagem de logs
    |       |-- AdminStats.jsx         # Graficos e estatisticas
    |-- styles/
        |-- global.css                 # Estilos globais (tema escuro)
```

### Descricao dos Modulos

#### `src/App.jsx` - Roteador Principal

Define todas as rotas da aplicacao usando React Router:

| Rota | Componente | Protegida |
|---|---|---|
| `/` | Home | Nao |
| `/resultado` | Resultado | Nao |
| `/tabela-verdade` | TabelaVerdade | Nao |
| `/admin/login` | AdminLogin | Nao |
| `/admin` | AdminDashboard | Sim |
| `/admin/analises` | AdminAnalises | Sim |
| `/admin/logs` | AdminLogs | Sim |
| `/admin/stats` | AdminStats | Sim |

O componente `ProtectedRoute` envolve rotas admin:
1. Chama `GET /api/admin/check/` ao montar
2. Se autenticado, renderiza o componente filho
3. Se nao, redireciona para `/admin/login`

#### `src/services/api.js` - Cliente HTTP

Instancia Axios configurada com:
- `baseURL`: `http://<hostname_do_navegador>:8000` (dinamico)
- `withCredentials: true` (envia cookies de sessao)
- `Content-Type: application/json`

Funcoes exportadas:
| Funcao | Metodo | Endpoint |
|---|---|---|
| `criarAnalise(data)` | POST | `/api/analise/` |
| `getTabelaVerdade()` | GET | `/api/tabela-verdade/` |
| `adminLogin(data)` | POST | `/api/admin/login/` |
| `adminLogout()` | POST | `/api/admin/logout/` |
| `adminCheck()` | GET | `/api/admin/check/` |
| `adminDashboard()` | GET | `/api/admin/dashboard/` |
| `adminAnalises(params)` | GET | `/api/admin/analises/` |
| `adminLogs(params)` | GET | `/api/admin/logs/` |
| `adminStats()` | GET | `/api/admin/stats/` |

#### `src/components/Navbar.jsx` - Navegacao

Barra de navegacao fixa no topo com comportamento condicional:
- **Usuarios publicos** veem: "Analisar", "Tabela Verdade", "Admin"
- **Quando em /admin/*** veem: "Dashboard", "Analises", "Logs", "Estatisticas"
- Link ativo destacado com classe CSS `active`
- Logo "CreditLogic" sempre visivel

#### `src/pages/Home.jsx` - Formulario Wizard

Formulario de analise de credito em formato passo a passo (wizard) com 14 etapas:

**Etapa 0 - Nome do Solicitante:**
- Campo de texto para nome completo
- Validacao: campo obrigatorio
- Tecla Enter avanca para proxima etapa

**Etapas 1 a 12 - Proposicoes:**
- Uma proposicao por tela
- Exibe o ID (P1, P2, etc.), descricao e badge "Obrigatoria" quando aplicavel
- Botoes "Sim" e "Nao" para resposta (sem valor padrao, forca escolha explicita)
- Destaque visual no botao selecionado (verde para Sim, vermelho para Nao)
- Botao "Proximo" habilitado somente apos selecionar resposta

**Etapa 13 - Resumo:**
- Lista todas as respostas (nome + 12 proposicoes)
- Cada linha e clicavel para voltar a etapa correspondente e editar
- Botao "Analisar Credito" para enviar

**Elementos de UI:**
- Barra de progresso animada no topo (0% a 100%)
- Indicador "Pergunta X de 13" / "Resumo"
- Botao "Voltar" (todas as etapas exceto a primeira)
- Botao "Proximo" / "Ver Resumo" / "Analisar Credito"

**Estado (hooks):**
- `step` - Etapa atual (0-13)
- `nome` - Nome do solicitante
- `proposicoes` - Array de proposicoes carregadas da API
- `valores` - Objeto com respostas {p1: true, p2: false, ...}
- `loading` - Flag de carregamento durante envio
- `error` - Mensagem de erro de validacao

#### `src/pages/Resultado.jsx` - Pagina de Resultado

Exibe o resultado da analise apos envio:
- Card com borda verde (APROVADO) ou vermelha (REPROVADO)
- Icone de check ou X
- Nome do solicitante
- Total de proposicoes verdadeiras (X/12)
- Expressao logica completa avaliada (bloco `<pre>`)
- Botoes: "Nova Analise" (volta ao Home) e "Ver Regras" (vai para TabelaVerdade)
- Se acessada sem dados (direto pela URL), mostra mensagem e link para voltar

#### `src/pages/TabelaVerdade.jsx` - Regras de Decisao

Pagina explicativa com tres secoes:
1. **Formula de Decisao** - Exibe a formula logica em destaque
2. **Proposicoes** - Lista todas as 12 proposicoes com badges de obrigatoriedade, cards com borda vermelha para obrigatorias e azul para opcionais
3. **Fluxo de Decisao** - Explicacao numerada do processo de avaliacao

#### `src/pages/admin/AdminLogin.jsx` - Login

Formulario simples com campos de usuario e senha. Apos login bem-sucedido, redireciona para `/admin`.

#### `src/pages/admin/AdminDashboard.jsx` - Dashboard

Visao geral com:
- 4 cards de metricas: Total de Analises, Aprovados, Reprovados, Taxa de Aprovacao (%)
- Tabela com as 5 analises mais recentes (ID, Nome, Resultado, Verdadeiras, Data)

#### `src/pages/admin/AdminAnalises.jsx` - Listagem de Analises

Tabela paginada com todas as analises:
- Filtros: por resultado (APROVADO/REPROVADO) e busca por nome
- Colunas: ID, Nome, Resultado (badge colorido), Verdadeiras, IP, Data
- Paginacao com botoes de pagina

#### `src/pages/admin/AdminLogs.jsx` - Logs de Acesso

Tabela paginada com logs de requisicoes HTTP:
- Filtro: por metodo HTTP (GET, POST, etc.)
- Colunas: ID, Metodo (badge colorido), Pagina Acessada, IP, Data
- Paginacao com botoes de pagina

#### `src/pages/admin/AdminStats.jsx` - Estatisticas

Pagina com visualizacoes avancadas usando Recharts:
- 4 cards de metricas (mesmo do dashboard)
- **Grafico de Pizza** - Distribuicao Aprovados vs Reprovados
- **Grafico de Barras** - Taxa de verdadeiras por proposicao (P1 a P12)
- **Grafico de Linha** - Analises por dia (ultimos 30 dias)
- **Grafico de Barras** - Distribuicao de quantidade de proposicoes verdadeiras

---

## Painel Administrativo

### Credenciais
- **URL:** `http://localhost:5173/admin`
- **Usuario:** `admin`
- **Senha:** `creditlogic2026`

### Funcionalidades
1. **Dashboard** - Visao geral rapida com metricas e analises recentes
2. **Analises** - Consulta completa de todas as analises com busca e filtros
3. **Logs** - Registro de todos os acessos HTTP ao sistema
4. **Estatisticas** - Graficos interativos com distribuicoes e tendencias

---

## Fluxo do Usuario

### Fluxo de Analise de Credito

```
1. Acessa http://localhost:5173
2. Preenche nome do solicitante
3. Responde Sim/Nao para cada uma das 12 proposicoes (uma por vez)
4. Revisa todas as respostas no resumo
5. (Opcional) Clica em qualquer resposta para editar
6. Clica "Analisar Credito"
7. Frontend envia POST /api/analise/ com dados
8. Backend avalia com avaliar_credito()
9. Backend salva Analise no banco
10. Backend retorna resultado
11. Frontend navega para /resultado com dados
12. Usuario ve APROVADO ou REPROVADO com expressao logica
```

### Fluxo do Administrador

```
1. Acessa http://localhost:5173/admin
2. Redirecionado para /admin/login
3. Insere credenciais (admin / creditlogic2026)
4. POST /api/admin/login/ cria sessao
5. Redirecionado para /admin (dashboard)
6. Navega entre Dashboard, Analises, Logs e Estatisticas
7. Todas as requisicoes admin enviam cookie de sessao
```

---

## Banco de Dados

O sistema usa **SQLite** (`db.sqlite3`) com duas tabelas:

### Tabela `core_analise`
| Coluna | Tipo | Descricao |
|---|---|---|
| id | INTEGER PK | Identificador unico |
| nome_solicitante | VARCHAR(200) | Nome do solicitante |
| p1 a p12 | BOOLEAN | Valor de cada proposicao |
| total_verdadeiras | INTEGER | Contagem de verdadeiras |
| resultado | VARCHAR(10) | APROVADO ou REPROVADO |
| expressao_logica | TEXT | Expressao avaliada |
| ip_address | VARCHAR(39) | IP do solicitante |
| user_agent | TEXT | Navegador do solicitante |
| criado_em | DATETIME | Data/hora de criacao |

### Tabela `core_acessolog`
| Coluna | Tipo | Descricao |
|---|---|---|
| id | INTEGER PK | Identificador unico |
| ip_address | VARCHAR(39) | IP do visitante |
| user_agent | TEXT | Navegador do visitante |
| pagina_acessada | VARCHAR(500) | Path da URL |
| metodo_http | VARCHAR(10) | GET, POST, etc. |
| criado_em | DATETIME | Data/hora do acesso |

### Comando Seed
```bash
python manage.py seed
```
Gera 50 registros ficticios na tabela `core_analise` com nomes brasileiros (Faker) e proposicoes aleatorias.

---

## Estilizacao

O frontend usa um tema escuro inspirado no GitHub, definido em `src/styles/global.css`.

### Variaveis CSS
```css
--bg-primary: #0d1117      /* Fundo principal */
--bg-secondary: #161b22    /* Fundo de cards */
--bg-tertiary: #21262d     /* Fundo de elementos internos */
--text-primary: #c9d1d9    /* Texto principal */
--text-secondary: #8b949e  /* Texto secundario */
--accent: #58a6ff          /* Azul destaque */
--success: #3fb950         /* Verde (aprovado) */
--danger: #f85149          /* Vermelho (reprovado) */
--warning: #d29922         /* Amarelo (avisos) */
--border: #30363d          /* Bordas */
--radius: 8px              /* Raio de borda padrao */
```

### Responsividade
Breakpoint em `768px` (mobile):
- Grid de toggles: 2 colunas para 1
- Grid de stats: 4 colunas para 2
- Filtros: horizontal para vertical
- Navbar: horizontal para empilhada
- Tabelas: fonte reduzida

# 3rd-Route Frontend

Modern, responsive React-based local user interface for **3rd-Route** (Sovereign Multimodal Multi-Agent AI Workbench).

The frontend interface is inspired by:
- **`1st.png`**: The main chatbot interface (ice-blue sidebar, traffic light window controls, model selector pill, card input with attachments, audio, and upward send button, rich whitespace).
- **`2nd.png`**: The authentication interface (clean centered login/signup card with email/password and social login providers), rebranded from "ChatGPT" to **"3rd-Route"**.

---

## Architecture Overview

3rd-Route is designed as a **local-first application**. It is intended to run directly on the user's computer and be distributed via release archives (`.zip`, `.tar.gz`) rather than permanently hosted on third-party cloud platforms.

```
User's Computer
┌─────────────────────────────────┐       HTTP (REST)       ┌──────────────────────────────────────┐
│  3rd-Route React Frontend       ├────────────────────────►│  Local Python Server (server.py)      │
│  (Vite + React + TypeScript)    │◄────────────────────────┤  (FastAPI + Uvicorn on :8000)        │
└────────────────┬────────────────┘                         └──────────────────┬───────────────────┘
                 │                                                             │
                 │ Authenticate (OAuth/OIDC)                                   │
                 ▼                                                             ▼
         Auth0 Cloud Service                                     Multi-Stage MMAR Pipeline:
    (Universal Login / Tokens)                                    - Router: cactus-needle (local)
                                                                  - Vision: OpenRouter (free tier)
                                                                  - Reasoning: OpenRouter + Web + FTS5
                                                                  - Coding: Ollama Cloud (gpt-oss:20b)
                                                                  - Knowledge: SQLite FTS5 (knowledge.db)
```

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: 3.10+ (with project dependencies installed)

---

## 2. Installing Dependencies

Inside the `frontend/` directory:

```bash
npm install
```

---

## 3. Configuring Environment Variables

Copy the example environment file:

```bash
# On Windows (PowerShell):
Copy-Item .env.example .env.local

# On macOS / Linux:
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Local Python Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Auth0 Authentication Configuration
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://api.3rd-route.local
```

> **Note on Local Development**: If you do not configure Auth0 immediately, 3rd-Route will run in **Local Demo Mode** by default. You can test the application, UI, and backend communication immediately using the "Instant Local Demo Login" button.

---

## 4. Auth0 Configuration for Localhost

When using Auth0, configure your Auth0 Application (Single Page Web Application) in the [Auth0 Dashboard](https://manage.auth0.com/) with these settings:

- **Allowed Callback URLs**: `http://localhost:5173, http://localhost:4173, http://127.0.0.1:5173`
- **Allowed Logout URLs**: `http://localhost:5173, http://localhost:4173, http://127.0.0.1:5173`
- **Allowed Web Origins**: `http://localhost:5173, http://localhost:4173, http://127.0.0.1:5173`

Do **NOT** put Auth0 client secrets into the React frontend. Only the Client ID and Domain are public client identifiers.

---

## 5. Running the Application Locally

### Step A: Start the Python Backend Server
From the project root:

```powershell
# Windows (PowerShell):
python server.py
```

```bash
# macOS / Linux:
python3 server.py
```

The API server will listen on `http://127.0.0.1:8000`.

### Step B: Start the React Frontend
In a separate terminal, inside the `frontend/` directory:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 6. Discovered and Connected Backend Endpoints

The frontend communicates with the Python backend via the centralized API client in [`src/api/client.ts`](src/api/client.ts):

| Endpoint | Method | Purpose | Backend Python Module |
|---|---|---|---|
| `/api/status` | `GET` | Health check, active model roster, and indexed document counts | `config.py`, `knowledge.py` |
| `/api/chat` | `POST` | Executes full multi-model pipeline (accepts text prompt and image upload) | `modelrouter.run()`, `vision.analyze_image()`, `reasoning.reason()`, `coding.generate_code()` |
| `/api/chat/json` | `POST` | Alternative JSON payload endpoint for text queries | `modelrouter.run()` |
| `/api/coding/chat` | `POST` | Multi-turn coding conversation with Ollama Cloud | `coding.chat()` |
| `/api/knowledge/documents` | `GET` | Returns total indexed document count | `knowledge.document_count()` |
| `/api/knowledge/search` | `POST` | Performs SQLite FTS5 prefix search with SQL `LIKE` fallback | `knowledge.search()` |
| `/api/knowledge/ingest` | `POST` | Uploads PDF, performs OCR fallback, chunks text (8000 chars), and indexes in FTS5 | `knowledge.ingest_pdf()` |

---

## 7. Assumptions & Technical Decisions

1. **Standalone API Server (`server.py`)**:
   - The original repository provided CLI scripts and modular Python functions (`modelrouter.py`, `knowledge.py`, `coding.py`, etc.) without an HTTP server or server port.
   - To adhere to the rule of **not breaking or modifying any existing Python pipeline code**, `server.py` was created in the root directory. It imports and wraps the existing modules and functions cleanly using FastAPI and Uvicorn.
2. **Stateless Multi-Model Routing**:
   - `modelrouter.run()` is inherently a single-pass multi-stage pipeline (Vision → Reasoning → Coding).
   - Conversation sessions are tracked on the client using `localStorage`, allowing users to maintain multiple chat histories, rename, or delete chats just like in modern AI chat interfaces.
3. **Graceful Auth0 Fallback**:
   - If `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are not configured in `.env.local`, the frontend automatically provides a local mock provider so developers can immediately test the workbench offline without an external auth blocker.

---

## 8. Production Build & Distribution

To create a static production bundle for offline distribution:

```bash
npm run build
```

The compiled files will be output to `frontend/dist/`.

To preview the production build locally:

```bash
npm run preview
```

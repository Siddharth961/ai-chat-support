# Nova Store — AI Chat Support Agent

A lightweight customer support chat app powered by an LLM backend. Users can ask questions about Nova Store's policies and get instant AI-generated replies. Conversations are persisted across page reloads.

---

## Tech Stack

- **Backend** — Node.js + TypeScript, Express, better-sqlite3
- **Frontend** — React + TypeScript, Vite
- **Database** — SQLite (via better-sqlite3)
- **LLM** — OpenAI-compatible API (works with OpenAI keys or Groq keys)

---

## Local Setup

### Prerequisites
- Node.js 18+
- An OpenAI API key **or** a Groq API key

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ai-chat-agent
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=3000
OPENAI_API_KEY=your_key_here ( can use Openai or Groq key)
```

>  Groq's API is OpenAI-compatible so the same code works.

Start the backend:

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

### 3. Database setup

No manual migration step needed. On first run, the backend automatically creates a `chat.db` SQLite file and runs `CREATE TABLE IF NOT EXISTS` for both tables.

If you want to start fresh, just delete `chat.db` and restart the server:

```bash
rm backend/chat.db
```

### 4. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Architecture Overview

```
backend/
│   ├── index.ts          # Entry point — Express app, middleware
│   ├── routes/
│   │   └── chat.ts       # POST /chat/message, GET /chat/history/:sessionId
│   ├── services/
│   │   └── llm.ts        # LLM integration — generateReply()
│   └── db/
│       ├── client.ts     # SQLite connection, runs migrations on startup
│       ├── schema.ts     # CREATE TABLE statements
│       └── queries.ts    # All DB reads/writes (no SQL outside this file)

frontend/
├── src/
│   ├── api/
│   │   └── chatApi.ts    # fetch wrappers for backend endpoints
│   ├── hooks/
│   │   └── useChat.ts    # all state and logic (messages, loading, session)
│   ├── components/
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputBar.tsx
│   └── App.tsx           # composes components, calls useChat
```

### Layers

- **Routes** — validate input, orchestrate the flow (session → DB → LLM → DB → response). No business logic.
- **Services** — `llm.ts` is the only file that knows about the LLM provider. Swap providers by editing one file.
- **DB queries** — all SQL is in `queries.ts`. Routes never write raw SQL.

### Interesting design decisions

- **SQLite over PostgreSQL** — no setup, no running server, no connection strings. The DB is a single file (`chat.db`). More than sufficient for this use case and makes local setup a one-step process.
- **Auto-migration on startup** — `CREATE TABLE IF NOT EXISTS` runs every time the server starts. No migration tooling needed for a project this size.
- **Session via localStorage** — no auth required. A `sessionId` (UUID) is generated on first message, stored in the browser, and sent with every request. On reload, history is fetched using that ID.
- **Optimistic UI** — user message appears in the chat immediately before the API responds, so the UI feels instant.

---

## LLM Notes

### Provider

OpenAI-compatible API. Works with :
- **OpenAI** 
- **Groq** 

Groq was used during development — it's faster and the free tier is generous.

### Prompting

A system prompt is passed with every request that gives the model its identity and store knowledge:

```
You are a helpful support agent for "Nova Store".
- Returns: accepted within 30 days, unused condition
- Shipping: free over $50, $5 flat fee otherwise. Ships to US, UK, Canada.
- Support hours: Mon–Fri 9am–6pm EST
- Email: support@novastore.com
Be concise, friendly, and honest. If unsure, say so.
```

The last 10 messages of conversation history are included with each request so replies are contextual.

### Token limits

`max_tokens` is capped at 500 per reply — enough for support answers, keeps costs low. History is capped at the last 10 messages to avoid large context windows.

---

## Trade-offs & If I Had More Time

### Trade-offs made

- **SQLite instead of PostgreSQL** — fine for a single-server app, but SQLite doesn't support concurrent writes well. A real production deployment would use Postgres.
- **No auth** — sessions are identified by a UUID in localStorage. Anyone with the `sessionId` can read that conversation. Acceptable for this exercise, not for production.
- **Store knowledge is hardcoded in the prompt** — simple and fast to implement. Doesn't scale if the knowledge base grows.
- **History capped at 10 messages** — keeps token usage low but the model loses context in very long conversations.

### If I had more time

- **Move store knowledge to DB** — so it can be updated without touching code
- **Better error recovery** — retry logic on transient LLM failures (timeouts, 503s) before surfacing an error to the user
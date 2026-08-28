# Caissa

Local-first chess AI agent harness. LLMs + chess books + Stockfish + memory, routed through cheap/free models.

## What it does

Ask a chess question, get an answer grounded in real book passages and engine analysis — not just pretrained knowledge.

## Stack

- Go — agent runtime, tools, orchestration
- Wails v2 — desktop app
- React + TypeScript — UI
- PostgreSQL + pgvector — persistence + semantic search
- Redis — optional
- Stockfish — chess analysis

## Project structure

```
frontend/               React + TypeScript UI
internal/
  agent/                agent loop / orchestration
  gateway/              multi-provider LLM routing
  tools/
    stockfish/          engine analysis
    books/              book ingestion + lookup
    games/              PGN/game analysis
    memory/             conversation + user memory
  retrieval/            embedding + pgvector search
  storage/              PostgreSQL access
```

## Getting started

> Early stage — scaffolding in progress. Build commands not yet wired up.

### Prerequisites

- Go 1.26+
- PostgreSQL + pgvector extension
- Stockfish (for engine analysis)
- Node.js (for frontend)

### Setup

```bash
# Coming soon: DB setup, go build, wails dev
```

## How it works

```
User question
    ↓
Orchestrator builds context
    ↓
Model Gateway picks best free/cheap model
    ↓
Model reasons, calls tools if needed
    ↓
Tools: Stockfish | Books | PGN | Web search
    ↓
Answer with source context
```

The gateway routes tasks by complexity — cheap models for retrieval, strong models for deep chess reasoning.

## License

TBD

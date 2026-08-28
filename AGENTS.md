# Caissa

Local-first chess AI agent harness: agents that use chess books, engines (Stockfish), games, and memory to answer questions and analyze games. Built for research and experimentation, not production.

## Stack

- **Go** (`module caissa`) — application, agent runtime, tools, orchestration
- **Wails v2** — desktop app
- **React + TypeScript** — UI (`frontend/`)
- **PostgreSQL + pgvector** — persistence and semantic retrieval
- **Redis** — optional, only when needed
- **Stockfish** — chess analysis

## Layout

```text
frontend/               React + TypeScript UI
internal/
  agent/                agent runtime / orchestration loop
  gateway/              model gateway: multi-provider LLM abstraction,
                        task-based model routing (cheap models for
                        retrieval/classification/memory, strong models
                        for chess reasoning)
  tools/
    stockfish/          engine analysis tool
    books/              book ingestion + lookup
    games/              PGN/game analysis
    memory/             conversation/user memory
  retrieval/            embedding + pgvector search
  storage/              PostgreSQL access; schema lives here too
```

`main.go` + `wails.json` sit at repo root once scaffolding lands.

## Ground rules

- Single modular Go application. No microservices, no extra services/infrastructure until experimentation demands it.
- Smallest working harness. No speculative abstractions; tools are a simple interface so new ones slot in easily.
- Answers should be grounded in retrieved book passages, not just pretrained knowledge.

## Current milestone

1. Load a chess book → ask the agent a chess question → retrieve relevant passages → reason over them → answer with source context.
2. Then: Stockfish tool + game analysis.

## Commands

Not yet scaffolded. Add `go build`, `wails dev`, DB setup, and test commands here as they land.

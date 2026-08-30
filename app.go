package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sync"
)

// AgentService abstracts the agent interaction layer.
// Replace mock implementations with real ones when backend infra is ready.
type AgentService interface {
	SendMessage(ctx context.Context, sessionID, text string) (*AgentResponse, error)
	GetSessions(ctx context.Context) ([]Session, error)
}

// PersonaService abstracts persona/SOUL.md management.
type PersonaService interface {
	GetPersona(ctx context.Context) (string, error)
	SavePersona(ctx context.Context, content string) error
}

// SettingsService abstracts app settings.
type SettingsService interface {
	GetSettings(ctx context.Context) (*Settings, error)
	SaveSettings(ctx context.Context, s *Settings) error
}

// --- Types ---

type AgentResponse struct {
	Message    string       `json:"message"`
	ToolCalls  []ToolCallInfo `json:"toolCalls,omitempty"`
}

type ToolCallInfo struct {
	Tool   string `json:"tool"`
	Detail string `json:"detail"`
}

type Session struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	CreatedAt string `json:"createdAt"`
}

type Settings struct {
	Notifications bool   `json:"notifications"`
	ModelMode     string `json:"modelMode"` // "fast" or "quality"
	Theme         string `json:"theme"`
}

// --- App (Wails entrypoint) ---

type App struct {
	ctx       context.Context
	agent     AgentService
	persona   PersonaService
	settings  SettingsService
	mu        sync.RWMutex
	sessions  []Session
}

func NewApp() *App {
	dataDir := dataDir()

	return &App{
		agent:    &mockAgent{},
		persona:  &filePersona{dir: dataDir},
		settings: &mockSettings{},
		sessions: []Session{
			{ID: "1", Title: "Fried Liver Analysis", CreatedAt: "2026-08-28"},
			{ID: "2", Title: "London System Prep", CreatedAt: "2026-08-27"},
			{ID: "3", Title: "Endgame Review", CreatedAt: "2026-08-25"},
		},
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// --- Agent bindings ---

func (a *App) SendMessage(sessionID, text string) (*AgentResponse, error) {
	return a.agent.SendMessage(a.ctx, sessionID, text)
}

func (a *App) GetSessions() ([]Session, error) {
	return a.agent.GetSessions(a.ctx)
}

// --- Persona bindings ---

func (a *App) GetPersona() (string, error) {
	return a.persona.GetPersona(a.ctx)
}

func (a *App) SavePersona(content string) error {
	return a.persona.SavePersona(a.ctx, content)
}

// --- Settings bindings ---

func (a *App) GetSettings() (*Settings, error) {
	return a.settings.GetSettings(a.ctx)
}

func (a *App) SaveSettings(s *Settings) error {
	return a.settings.SaveSettings(a.ctx, s)
}

// --- Helpers ---

func dataDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return "."
	}
	d := filepath.Join(home, ".config", "caissa")
	os.MkdirAll(d, 0o755)
	return d
}

// --- Mock implementations (replace with real ones) ---

type mockAgent struct{}

func (m *mockAgent) SendMessage(_ context.Context, _, text string) (*AgentResponse, error) {
	// Mock: echo back with simulated tool calls
	return &AgentResponse{
		Message: fmt.Sprintf("I've analyzed your question about \"%s\". Based on my review of the position, I'd suggest looking at the pawn structure in the center. The key tactical motif here involves the pin on the f7 square.", text),
		ToolCalls: []ToolCallInfo{
			{Tool: "stockfish", Detail: "Depth 20, eval +0.42"},
			{Tool: "books", Detail: "Consulting MCO for Italian Game lines"},
		},
	}, nil
}

func (m *mockAgent) GetSessions(_ context.Context) ([]Session, error) {
	return []Session{
		{ID: "1", Title: "Fried Liver Analysis", CreatedAt: "2026-08-28"},
		{ID: "2", Title: "London System Prep", CreatedAt: "2026-08-27"},
		{ID: "3", Title: "Endgame Review", CreatedAt: "2026-08-25"},
	}, nil
}

type mockSettings struct{}

func (m *mockSettings) GetSettings(_ context.Context) (*Settings, error) {
	return &Settings{
		Notifications: true,
		ModelMode:     "fast",
		Theme:         "dark",
	}, nil
}

func (m *mockSettings) SaveSettings(_ context.Context, s *Settings) error {
	return nil // mock: discard
}

// --- File-based persona (reads/writes SOUL.md) ---

type filePersona struct {
	dir string
}

func (f *filePersona) path() string {
	return filepath.Join(f.dir, "SOUL.md")
}

func (f *filePersona) GetPersona(_ context.Context) (string, error) {
	data, err := os.ReadFile(f.path())
	if err != nil {
		// Return default persona if file doesn't exist
		return defaultPersona, nil
	}
	return string(data), nil
}

func (f *filePersona) SavePersona(_ context.Context, content string) error {
	return os.WriteFile(f.path(), []byte(content), 0o644)
}

const defaultPersona = `# Caissa Identity Core

NAME: Caissa
VOICE: Encouraging, tactical, witty
ROLE: AI Chess Second & Analyst

## Behavioral Directives
- Use chess terminology naturally
- Focus on psychological aspects of the user's game
- If a move is a 'blunder', call it out but explain why
- Reference classical games when relevant
`

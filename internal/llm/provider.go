package llm

import (
	"context"
	"encoding/json"

	"github.com/caissa/internal/tools"
)

type Message struct {
	Role       string     // "system", "user", "assistant", "tool"
	Content    string
	ToolCalls  []ToolCall // for assistant messages
	ToolCallID string     // for tool result messages
}

type Request struct {
	SystemPrompt string
	Messages     []Message
	Tools        []tools.Tool
	MaxTokens    int
}

type ToolCall struct {
	ID       string
	ToolName string
	Args     []any
}

type Response struct {
	ToolCalls []ToolCall
	Text      string
}

type LlmProvider interface {
	Complete(ctx context.Context, req *Request) (*Response, error)
	FormatUserMessage(req *Request) json.RawMessage
	FormatToolResults(req *Request, results map[string]*tools.ToolResult) json.RawMessage
	Model() string
}

type ToolCallRaw struct {
	ID       string `json:"id"`
	Function struct {
		Name      string `json:"name"`
		Arguments string `json:"arguments"`
	} `json:"function"`
}
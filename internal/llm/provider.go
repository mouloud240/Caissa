package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/caissa/internal/tools"
)

// Types

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

// OpenAI-compatible provider

type OpenAICompatibleProvider struct {
	name         string
	apiKey       string
	model        string
	baseURL      string
	client       *http.Client
	extraHeaders map[string]string
}

func NewOpenRouter(apiKey, model string) *OpenAICompatibleProvider {
	if model == "" {
		model = "anthropic/claude-3.5-sonnet"
	}
	return &OpenAICompatibleProvider{
		name:    "openrouter",
		apiKey:  apiKey,
		model:   model,
		baseURL: "https://openrouter.ai/api/v1",
		client:  newHTTPClient(),
		extraHeaders: map[string]string{
			"HTTP-Referer": "https://github.com/caissa",
			"X-Title":      "Caissa Chess Agent",
		},
	}
}

func NewGroq(apiKey, model string) *OpenAICompatibleProvider {
	if model == "" {
		model = "llama-3.1-8b-instant"
	}
	return &OpenAICompatibleProvider{
		name:    "groq",
		apiKey:  apiKey,
		model:   model,
		baseURL: "https://api.groq.com/openai/v1",
		client:  newHTTPClient(),
	}
}

func newHTTPClient() *http.Client {
	return &http.Client{
		Timeout: 60 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) > 0 && via[0].URL.Scheme == "https" && req.URL.Scheme != "https" {
				return fmt.Errorf("redirect downgrade from HTTPS to %s", req.URL.Scheme)
			}
			return nil
		},
	}
}

func (p *OpenAICompatibleProvider) Model() string {
	return p.model
}

func (p *OpenAICompatibleProvider) Complete(ctx context.Context, req *Request) (*Response, error) {
	messages := p.buildMessages(req)

	body := map[string]any{
		"model":       p.model,
		"messages":    messages,
		"max_tokens":  req.MaxTokens,
		"temperature": 0.2,
	}
	if len(req.Tools) > 0 {
		body["tools"] = p.formatTools(req.Tools)
		body["tool_choice"] = "auto"
	}

	resp, err := p.post(ctx, "/chat/completions", body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Choices []struct {
			Message struct {
				Content   string        `json:"content"`
				ToolCalls []ToolCallRaw `json:"tool_calls"`
			} `json:"message"`
		} `json:"choices"`
		Error *struct {
			Message string `json:"message"`
		} `json:"error"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if result.Error != nil {
		return nil, fmt.Errorf("%s: %s", p.name, result.Error.Message)
	}
	if len(result.Choices) == 0 {
		return nil, fmt.Errorf("%s: no choices returned", p.name)
	}

	choice := result.Choices[0]

	var toolCalls []ToolCall
	for _, tc := range choice.Message.ToolCalls {
		toolCalls = append(toolCalls, ToolCall{
			ID:       tc.ID,
			ToolName: tc.Function.Name,
			Args:     []any{tc.Function.Arguments},
		})
	}

	return &Response{
		Text:      choice.Message.Content,
		ToolCalls: toolCalls,
	}, nil
}

func (p *OpenAICompatibleProvider) FormatUserMessage(req *Request) json.RawMessage {
	msg := map[string]any{
		"role":    "user",
		"content": req.SystemPrompt,
	}
	b, _ := json.Marshal(msg)
	return b
}

func (p *OpenAICompatibleProvider) FormatToolResults(req *Request, results map[string]*tools.ToolResult) json.RawMessage {
	var msgs []map[string]any
	for id, result := range results {
		content := ""
		for _, c := range result.Content {
			if c.Type == "text" {
				content += c.Text
			}
		}
		msgs = append(msgs, map[string]any{
			"role":         "tool",
			"tool_call_id": id,
			"content":      content,
		})
	}
	b, _ := json.Marshal(msgs)
	return b
}

func (p *OpenAICompatibleProvider) buildMessages(req *Request) []map[string]any {
	var msgs []map[string]any

	for _, m := range req.Messages {
		switch m.Role {
		case "system":
			msgs = append(msgs, map[string]any{"role": "system", "content": m.Content})
		case "user":
			msgs = append(msgs, map[string]any{"role": "user", "content": m.Content})
		case "assistant":
			msg := map[string]any{
				"role":    "assistant",
				"content": m.Content,
			}
			if len(m.ToolCalls) > 0 {
				var toolCalls []map[string]any
				for _, tc := range m.ToolCalls {
					toolCalls = append(toolCalls, map[string]any{
						"id":   tc.ID,
						"type": "function",
						"function": map[string]any{
							"name":      tc.ToolName,
							"arguments": tc.Args[0],
						},
					})
				}
				msg["tool_calls"] = toolCalls
			}
			msgs = append(msgs, msg)
		case "tool":
			msgs = append(msgs, map[string]any{
				"role":         "tool",
				"tool_call_id": m.ToolCallID,
				"content":      m.Content,
			})
		}
	}

	return msgs
}

func (p *OpenAICompatibleProvider) formatTools(tls []tools.Tool) []map[string]any {
	var out []map[string]any
	for _, t := range tls {
		out = append(out, map[string]any{
			"type": "function",
			"function": map[string]any{
				"name":        t.GetName(),
				"description": t.GetDescription(),
				"parameters":  t.GetInputSchema(),
			},
		})
	}
	return out
}

func (p *OpenAICompatibleProvider) post(ctx context.Context, path string, body map[string]any) (*http.Response, error) {
	buf, _ := json.Marshal(body)
	req, _ := http.NewRequestWithContext(ctx, "POST", p.baseURL+path, bytes.NewReader(buf))
	req.Header.Set("Authorization", "Bearer "+p.apiKey)
	req.Header.Set("Content-Type", "application/json")
	for k, v := range p.extraHeaders {
		req.Header.Set(k, v)
	}
	return p.client.Do(req)
}

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

type OpenRouterProvider struct {
	apiKey  string
	model   string
	baseURL string
	client  *http.Client
}

func NewOpenRouterProvider(apiKey, model string) *OpenRouterProvider {
	return NewOpenRouterProviderWithBaseURL(apiKey, model, "https://openrouter.ai/api/v1")
}

func NewOpenRouterProviderWithBaseURL(apiKey, model, baseURL string) *OpenRouterProvider {
	if model == "" {
		model = "anthropic/claude-3.5-sonnet"
	}
	if baseURL == "" {
		baseURL = "https://openrouter.ai/api/v1"
	}
	return &OpenRouterProvider{
		apiKey:  apiKey,
		model:   model,
		baseURL: baseURL,
		client:  &http.Client{Timeout: 60 * time.Second},
	}
}

func (o *OpenRouterProvider) Model() string {
	return o.model
}

func (o *OpenRouterProvider) Complete(ctx context.Context, req *Request) (*Response, error) {
	messages := o.buildMessages(req)

	body := map[string]any{
		"model":       o.model,
		"messages":    messages,
		"max_tokens":  req.MaxTokens,
		"temperature": 0.2,
	}
	if len(req.Tools) > 0 {
		body["tools"] = o.formatTools(req.Tools)
		body["tool_choice"] = "auto"
	}

	resp, err := o.post(ctx, "/chat/completions", body)
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
		return nil, fmt.Errorf("openrouter: %s", result.Error.Message)
	}
	if len(result.Choices) == 0 {
		return nil, fmt.Errorf("openrouter: no choices returned")
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

func (o *OpenRouterProvider) FormatUserMessage(req *Request) json.RawMessage {
	msg := map[string]any{
		"role":    "user",
		"content": req.SystemPrompt,
	}
	b, _ := json.Marshal(msg)
	return b
}

func (o *OpenRouterProvider) FormatToolResults(req *Request, results map[string]*tools.ToolResult) json.RawMessage {
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

func (o *OpenRouterProvider) buildMessages(req *Request) []map[string]any {
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

func (o *OpenRouterProvider) formatTools(tls []tools.Tool) []map[string]any {
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

func (o *OpenRouterProvider) post(ctx context.Context, path string, body map[string]any) (*http.Response, error) {
	buf, _ := json.Marshal(body)
	req, _ := http.NewRequestWithContext(ctx, "POST", o.baseURL+path, bytes.NewReader(buf))
	req.Header.Set("Authorization", "Bearer "+o.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "https://github.com/caissa")
	req.Header.Set("X-Title", "Caissa Chess Agent")
	return o.client.Do(req)
}
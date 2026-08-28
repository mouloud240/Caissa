package agent

import (
	"context"
	"encoding/json"
	"log"

	"github.com/caissa/internal/llm"
	"github.com/caissa/internal/tools"
)

const MAX_TOKENS = 2000
const MAX_LOOPS = 5

type Agent struct {
	provider   llm.LlmProvider
	registry   *tools.Registry
	systemPrompt string
}

func NewAgent(provider llm.LlmProvider, registry *tools.Registry, systemPrompt string) *Agent {
	return &Agent{
		provider:      provider,
		registry:      registry,
		systemPrompt:  systemPrompt,
	}
}

func (a *Agent) Run(ctx context.Context, userPrompt string) (string, error) {
	messages := []llm.Message{
		{Role: "system", Content: a.systemPrompt},
		{Role: "user", Content: userPrompt},
	}

	for i := 0; i < MAX_LOOPS; i++ {
		req := &llm.Request{
			SystemPrompt: a.systemPrompt,
			Messages:     messages,
			Tools:        a.registry.GetTools(),
			MaxTokens:    MAX_TOKENS,
		}

		resp, err := a.provider.Complete(ctx, req)
		if err != nil {
			return "", err
		}

		log.Printf("LLM Response: %s", resp.Text)
		if len(resp.ToolCalls) == 0 {
			return resp.Text, nil
		}

		assistantMsg := llm.Message{
			Role:      "assistant",
			Content:   resp.Text,
			ToolCalls: resp.ToolCalls,
		}
		messages = append(messages, assistantMsg)

		toolResults := make(map[string]*tools.ToolResult)
		for _, tc := range resp.ToolCalls {
			tool, err := a.registry.GetTool(tc.ToolName)
			if err != nil {
				toolResults[tc.ID] = &tools.ToolResult{
					Content: []tools.ToolContent{{Type: "text", Text: err.Error()}},
					IsError: true,
				}
				continue
			}

			var args map[string]any
			if len(tc.Args) > 0 {
if s, ok := tc.Args[0].(string); ok {
        if err := json.Unmarshal([]byte(s), &args); err != nil {
            return "", err
        }
    }			}

			if args == nil {
				args = make(map[string]any)
			}


			result, err := tool.Execute(ctx, args)
			if err != nil {
				result = &tools.ToolResult{
					Content: []tools.ToolContent{{Type: "text", Text: err.Error()}},
					IsError: true,
				}
			}
			toolResults[tc.ID] = result

			var content string
			for _, c := range result.Content {
				if c.Type == "text" {
					content += c.Text
				}
			}
			messages = append(messages, llm.Message{
				Role:       "tool",
				Content:    content,
				ToolCallID: tc.ID,
			})
		}

		_ = toolResults
	}

	return "", nil
}

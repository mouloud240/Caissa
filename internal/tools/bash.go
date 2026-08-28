package tools

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"regexp"
)

const dangerousPatterns = "rm -rf|sudo|wget|curl|chmod|dd|mkfs|:(){:|:&};:"

type BashTool struct {
	name string
}

func NewBashTool() *BashTool {
	return &BashTool{name: "bash"}
}

func (b *BashTool) GetName() string {
	return "bash"
}

func (b *BashTool) GetDescription() string {
	return "Execute a bash command and return the output"
}

func (b *BashTool) GetInputSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"command": map[string]any{
				"type":        "string",
				"description": "The bash command to execute",
			},
		},
		"required": []string{"command"},
	}
}

func (b *BashTool) GetOutputSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"output": map[string]any{
				"type": "string",
			},
		},
	}
}

func shouldRequestPermission(cmd string) bool {
	if cmd == "" {
		return false
	}
	matched, _ := regexp.MatchString(dangerousPatterns, cmd)
	return matched
}

func (b *BashTool) Execute(ctx context.Context, args map[string]any) (*ToolResult, error) {
	log.Printf("Executing bash command with args: %v", args)
	cmdStr, ok := args["command"].(string)
	if !ok {
		return &ToolResult{
			Content: []ToolContent{{Type: "text", Text: "invalid command argument"}},
			IsError: true,
		}, nil
	}

	if shouldRequestPermission(cmdStr) {
		return &ToolResult{
			Content: []ToolContent{{Type: "text", Text: fmt.Sprintf("permission required for: %s", cmdStr)}},
			IsError: true,
		}, nil
	}

	cmd := exec.CommandContext(ctx, "bash", "-c", cmdStr)
	output, err := cmd.CombinedOutput()

	result := &ToolResult{
		Content: []ToolContent{{Type: "text", Text: string(output)}},
		IsError: err != nil,
	}
	return result, nil
}

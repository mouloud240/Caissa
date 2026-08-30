package tools

import (
	"context"
	"maps"
	"slices"

	common "github.com/caissa/internal/common/errors"
)

type Tool interface {
	GetName() string
	GetDescription() string
	GetInputSchema() map[string]any
	GetOutputSchema() map[string]any
	Execute(ctx context.Context, args map[string]any) (*ToolResult, error)
}

type Registry struct {
	tools map[string]Tool
}

func NewRegistry() *Registry {
	return &Registry{tools: make(map[string]Tool)}
}

func (r *Registry) GetTool(name string) (Tool, error) {
	if _, ok := r.tools[name]; !ok {
		return nil, common.NewToolNotFoundError(name)
	}
	return r.tools[name], nil
}

func (r *Registry) GetToolsName() []string {
	return slices.Collect(maps.Keys(r.tools))
}

func (r *Registry) GetTools() []Tool {
	return slices.Collect(maps.Values(r.tools))
}

func (r *Registry) RegisterTool(name string, tool Tool) {
	r.tools[name] = tool
}

func (r *Registry) ExecuteTool(ctx context.Context, name string, args map[string]any) (*ToolResult, error) {
	tool, err := r.GetTool(name)
	if err != nil {
		return nil, err
	}
	return tool.Execute(ctx, args)
}
package tools

import (
	"maps"
	"slices"

	common "github.com/caissa/internal/common/errors"
)


type Tool interface{
	execute(args ...any) (any, error)
	getName() string
}
//Tools Registry 
type Registry struct {
	tools map[string]Tool
}
func NewRegistry() *Registry {
	return &Registry{}
}

func (r *Registry) GetTool(name string) (Tool, error) {
	if _, ok := r.tools[name]; !ok {
		return nil, common.NewToolNotFoundError(name)
	}
	return r.tools[name],nil
}



func (r *Registry) GetTools() []string {
	return slices.Collect(maps.Keys(r.tools))
}


func (r *Registry) RegisterTool(name string, tool Tool){
		r.tools[name] = tool
}


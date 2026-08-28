package common

import "fmt"


type PermissionRequestError struct {
	toolName string
	args 	 []string
}
func NewPermissionRequestError(toolName string, args []string) *PermissionRequestError {
	return &PermissionRequestError{
		toolName: toolName,
		args:     args,
	}
}
func (e *PermissionRequestError) Error() string {
	return "Permission request error: The tool '" + e.toolName + "' was invoked with potentially dangerous arguments: " + fmt.Sprint(e.args)
}



type ToolNotFoundError struct {
	toolName string
}
func NewToolNotFoundError(toolName string) *ToolNotFoundError {
	return &ToolNotFoundError{
		toolName: toolName,
	}
}
func (e *ToolNotFoundError) Error() string {
	return "Tool not found error: The tool '" + e.toolName + "' was not found in the registry."
}
type ToolExecutionError struct {
	toolName string
	args     []string
	err      error
}
func NewToolExecutionError(toolName string, args []string, err error) *ToolExecutionError {
	return &ToolExecutionError{
		toolName: toolName,
		args:     args,
		err:      err,
	}
}
func (e *ToolExecutionError) Error() string {
	return "Tool execution error: The tool '" + e.toolName + "' failed to execute with arguments: " + fmt.Sprint(e.args) + ". Error: " + e.err.Error()
}

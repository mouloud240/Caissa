package tools

import (
	"fmt"
	"os/exec"
	"regexp"

	common "github.com/caissa/internal/common/errors"
)

//TODO : refine this
const dangerousPatters="rm -rf|sudo|wget|curl|chmod|dd|mkfs|:(){:|:&};:"
type BashTool struct {
	name string
}

func NewBashTool() *BashTool {
	return &BashTool{name: "bash"}
}

func shouldRequestPermission(cmd string) bool {
	if cmd == "" {
		return false
	}
	// Check for dangerous patterns in the command
	if matched, _ := regexp.MatchString(dangerousPatters, cmd); matched {
		return true
	}
	return false
	
}
func (b *BashTool) Execute(arg ...string) (string, error) {
	

	cmd := exec.Command("bash",fmt.Sprintf("%s", arg))
	if shouldRequestPermission(fmt.Sprintf("%s", arg)) {
		return "", common.NewPermissionRequestError(b.name, arg)
	}
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", common.NewToolExecutionError(b.name, arg, err)
	}
	return string(output), nil
}

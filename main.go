package main

import (
	"context"
	"fmt"
	"os"

	"github.com/caissa/internal/agent"
	"github.com/caissa/internal/llm"
	"github.com/caissa/internal/tools"
	"github.com/joho/godotenv"
)

func main() {
	if err:=godotenv.Load(); err != nil {
		panic("Error loading .env file"+err.Error())
	}
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		fmt.Println("Set GROQ_API_KEY env var first")
		os.Exit(1)
	}

	provider := llm.NewOpenRouterProviderWithBaseURL(apiKey, "inclusionai/ling-3.0-flash-fin:free", "https://openrouter.ai/api/v1")

	registry := tools.NewRegistry()
	registry.RegisterTool("bash", tools.NewBashTool())

	ag := agent.NewAgent(provider, registry, "You are a helpful assistant with access to a bash tool.")

	result, err := ag.Run(context.Background(), "Run 'echo hello world' and 'cat ./text.txt' and then 'rm -rf ./text.txt' and concatenate the results.")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Response: %s\n", result)
}

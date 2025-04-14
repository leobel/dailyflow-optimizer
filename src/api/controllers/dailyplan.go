package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"dailyflow-optimizer/api/models"

	"github.com/sashabaranov/go-openai"
)

func GetSchedule(openaiAPIKey string, openaiModel string, promptTemplate string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.TaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Generate schedule using OpenAI
		schedule, err := generateScheduleWithAI(r.Context(), req.Tasks, openaiAPIKey, openaiModel, promptTemplate)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error generating schedule: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(schedule)
	}
}

func generateScheduleWithAI(ctx context.Context, tasks []string, openaiAPIKey string, openaiModel string, promptTemplate string) (*models.ScheduleResponse, error) {
	client := openai.NewClient(openaiAPIKey)

	// Prepare the prompt
	prompt := fmt.Sprintf(promptTemplate, strings.Join(tasks, "\n"))

	// Make the API call
	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openaiModel,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant that creates optimal daily schedules.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.7,
		},
	)
	if err != nil {
		return nil, err
	}

	// Parse the response
	var schedule models.ScheduleResponse
	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &schedule); err != nil {
		return nil, err
	}

	return &schedule, nil
}

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type TaskRequest struct {
	Tasks string `json:"tasks"`
}

type ScheduleItem struct {
	Time        string `json:"time"`
	Task        string `json:"task"`
	Explanation string `json:"explanation"`
}

type ScheduleResponse struct {
	Items []ScheduleItem `json:"items"`
}

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using default environment variables")
	}

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("ALLOWED_ORIGIN")},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Create a new mux
	mux := http.NewServeMux()

	// API routes using method-specific handlers
	mux.Handle("POST /plan", http.HandlerFunc(handlePlan))

	// Serve static files in production
	if os.Getenv("DAILYFLOW_OPTIMIZER_ENV") == "production" {
		mux.Handle("GET /", http.HandlerFunc(handleRoot))
	}

	// Wrap the mux with CORS middleware
	handler := c.Handler(mux)

	fmt.Printf("Server starting on port %s...\n", port)
	http.ListenAndServe(":"+port, handler)
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	// In production, serve the built frontend files
	http.ServeFile(w, r, "../webapp/dist/index.html")
}

func handlePlan(w http.ResponseWriter, r *http.Request) {
	// Simulate latency
	time.Sleep(5 * time.Second)

	var req TaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate schedule using OpenAI
	schedule, err := generateScheduleWithAI(r.Context(), req.Tasks)
	if err != nil {
		http.Error(w, "Error generating schedule", http.StatusInternalServerError)
		log.Printf("Error generating schedule: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ScheduleResponse{Items: schedule})
}

func generateScheduleWithAI(ctx context.Context, tasks string) ([]ScheduleItem, error) {
	// 	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	// 	// Prepare the prompt
	// 	prompt := fmt.Sprintf(`I need help scheduling these tasks for today: %s

	// Please provide a schedule with:
	// 1. Optimal time for each task
	// 2. Brief explanation for the timing
	// 3. Consider task dependencies and energy levels throughout the day

	// Format the response as a JSON array of objects with these fields:
	// - time: string (e.g., "9:00 AM")
	// - task: string (the task or tasks to perform)
	// - explanation: string (why this time is optimal)

	// Example format:
	// [
	//   {
	//     "time": "9:00 AM",
	//       "task": "Task 1",
	//       "explanation": "Explanation 1"
	//   }
	// ]`, tasks)

	// Make the API call
	// resp, err := client.CreateChatCompletion(
	// 	ctx,
	// 	openai.ChatCompletionRequest{
	// 		Model: os.Getenv("OPENAI_MODEL"),
	// 		Messages: []openai.ChatCompletionMessage{
	// 			{
	// 				Role:    openai.ChatMessageRoleSystem,
	// 				Content: "You are a helpful assistant that creates optimal daily schedules.",
	// 			},
	// 			{
	// 				Role:    openai.ChatMessageRoleUser,
	// 				Content: prompt,
	// 			},
	// 		},
	// 		Temperature: 0.7,
	// 	},
	// )
	// if err != nil {
	// 	return nil, fmt.Errorf("OpenAI API error: %v", err)
	// }

	// // Parse the response
	// var schedule []ScheduleItem
	// if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &schedule); err != nil {
	// 	return nil, fmt.Errorf("failed to parse OpenAI response: %v", err)
	// }
	schedule := []ScheduleItem{
		{
			Time:        "7:00 AM",
			Task:        "Go for a 20-minute run",
			Explanation: "Starting the day with a run will help boost energy levels and set a positive tone for the day.",
		},
		{
			Time:        "8:00 AM",
			Task:        "Mow the lawn",
			Explanation: "It's best to do outdoor tasks like mowing the lawn in the morning before it gets too hot.",
		},
		{
			Time:        "10:00 AM",
			Task:        "Prepare for meeting with Jessica at work",
			Explanation: "By mid-morning, you'll be mentally awake and focused, making it a good time to prepare for a work meeting.",
		},
		{
			Time:        "3:00 PM",
			Task:        "Help daughter with science project",
			Explanation: "In the afternoon, you'll have more time and energy to dedicate to helping your daughter with her science project.",
		},
	}
	return schedule, nil
}

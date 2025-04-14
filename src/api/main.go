package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
	Schedule []ScheduleItem `json:"schedule"`
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
	var req TaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// In a real application, you would call the OpenAI API here
	// For now, we'll use a mock response
	schedule := generateMockSchedule(req.Tasks)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ScheduleResponse{Schedule: schedule})
}

func generateMockSchedule(tasks string) []ScheduleItem {
	// Split tasks by newline
	taskList := strings.Split(tasks, "\n")

	// Simple mock schedule generation
	// In a real application, this would be replaced with OpenAI API calls
	schedule := []ScheduleItem{
		{
			Time:        "9:00 AM",
			Task:        taskList[0],
			Explanation: "Starting with the most important task of the day",
		},
		{
			Time:        "11:00 AM",
			Task:        taskList[1],
			Explanation: "Taking a break from the first task to handle this important item",
		},
		{
			Time:        "2:00 PM",
			Task:        taskList[2],
			Explanation: "Afternoon is a good time for this task",
		},
		{
			Time:        "4:00 PM",
			Task:        taskList[3],
			Explanation: "Wrapping up the day with this final task",
		},
	}

	return schedule
}

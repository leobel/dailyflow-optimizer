package main

import (
	"dailyflow-optimizer/api/controllers"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var (
	openaiAPIKey   string
	openaiModel    string
	promptTemplate string
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using default environment variables")
	}

	// Validate and set required environment variables
	requiredEnvVars := map[string]*string{
		"OPENAI_API_KEY":  &openaiAPIKey,
		"OPENAI_MODEL":    &openaiModel,
		"PROMPT_TEMPLATE": &promptTemplate,
	}

	for envVar, value := range requiredEnvVars {
		*value = os.Getenv(envVar)
		if *value == "" {
			log.Printf("Error: Required environment variable %s is not set", envVar)
			os.Exit(1)
		}
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
	mux.Handle("POST /schedule", controllers.GetSchedule(openaiAPIKey, openaiModel, promptTemplate))

	// Serve static files in production
	if os.Getenv("DAILYFLOW_OPTIMIZER_ENV") == "production" {
		mux.Handle("GET /", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// In production, serve the built frontend files
			http.ServeFile(w, r, "../webapp/dist/index.html")
		}))
	}

	// Wrap the mux with CORS middleware
	handler := c.Handler(mux)

	fmt.Printf("Server starting on port %s...\n", port)
	http.ListenAndServe(":"+port, handler)
}

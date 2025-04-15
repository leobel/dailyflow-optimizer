package main

import (
	"dailyflow-optimizer/api/controllers"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

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
	envFile := ".env"
	if os.Getenv("DAILYFLOW_OPTIMIZER_ENV") == "production" {
		envFile = ".env.production"
	}

	if err := godotenv.Load(envFile); err != nil {
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
		AllowedOrigins:   strings.Split(os.Getenv("ALLOWED_ORIGIN"), ","),
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
		staticDir := "../webapp/dist"
		fs := http.FileServer(http.Dir(filepath.Join(staticDir, "assets")))

		// Serve static files
		mux.Handle("/assets/", http.StripPrefix("/assets/", fs))

		mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// In production, serve the built frontend files
			http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
		}))
	}

	// Wrap the mux with CORS middleware
	handler := c.Handler(mux)

	fmt.Printf("Server starting on port %s...\n", port)
	http.ListenAndServe(":"+port, handler)
}

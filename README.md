# Daily Flow Optimizer

A responsive web application that helps users optimize their daily tasks using AI-powered scheduling.

## Project Structure

```
dailyflow-optimizer/
├── src/
│   ├── webapp/          # React frontend
│   │   ├── src/         # React source files
│   │   └── package.json # Frontend dependencies
│   └── api/             # Go backend
│       └── main.go      # Backend server
└── README.md
```

## Features

- Responsive design that works on both desktop and mobile devices
- Simple task input interface
- AI-powered task scheduling
- Visual progress indicator
- Detailed schedule with explanations

## Setup

### Frontend Setup

1. Navigate to the webapp directory:
```bash
cd src/webapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the api directory:
```bash
cd src/api
```

2. Run the Go server:
```bash
go run main.go
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter your tasks for the day (one per line)
3. Click "Optimize My Day"
4. View your optimized schedule with explanations

## Technology Stack

- Frontend: React with TypeScript, styled-components
- Backend: Go (net/http)
- AI: OpenAI GPT-3.5-turbo (to be implemented)

## Note

The current version uses mock data for scheduling. To enable AI-powered scheduling, you'll need to:
1. Sign up for an OpenAI API key
2. Add your API key to the backend
3. Uncomment and configure the OpenAI API calls in the backend code 
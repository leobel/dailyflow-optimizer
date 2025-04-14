# Daily Flow Optimizer

A responsive web application that helps users optimize their daily tasks using AI-powered scheduling.

## Project Structure

```
dailyflow-optimizer/
├── .git/
├── .gitignore
├── README.md
└── src/
    ├── api/
    │   ├── main.go
    │   ├── .env
    │   ├── .env.production
    │   ├── go.mod
    │   ├── go.sum
    │   ├── controllers/
    │   └── models/
    └── webapp/
        ├── src/
        ├── package.json
        ├── package-lock.json
        ├── node_modules/
        ├── .env
        ├── .env.production
        ├── vite.config.ts
        ├── index.html
        ├── tsconfig.json
        └── tsconfig.node.json
```

## Setup

Before you can run both frontend and backend appliactions you'll need to create `.env` files on both `api` and `webapp` folders.

The structure for `webapp` is like this:

```
VITE_API_URL=http://localhost:8080
```

and for `api`:

```
DAILYFLOW_OPTIMIZER_ENV=development
PORT=8080
ALLOWED_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-proj...
OPENAI_MODEL=gpt-3.5-turbo
PROMPT_TEMPLATE=your prompt...
```

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

To enable AI-powered scheduling, you'll need to:
1. Sign up for an OpenAI API key
2. Add your API key to the backend (variable `OPENAI_API_KEY`)
3. Add your prompt for getting responses from the model (default: `gpt-3.5-turbo`)

Here the prompt example used during development:

```
I need help scheduling these tasks for today: %s\n\nPlease create a daily schedule under the following guidelines:\n1. If a task includes a specific time (e.g., "prepare for interview at noon"), schedule it at that exact time.\n2. Ensure that tasks follow a natural daily order. For instance, if a task should logically come after another (like brushing teeth after eating lunch), then the schedule should reflect that dependency.\n3. Consider natural energy levels throughout the day and allocate tasks to times when they are most likely to be performed efficiently. For example, plan physically demanding tasks or intellectually challenging ones when energy is high.\n4. If multiple tasks lack explicit time information, assign them optimal times based on realistic daily routines and dependencies.\n5. Provide a detailed explanation that justifies each scheduling decision by relating them to the actual tasks. Explain, using common sense and everyday reasoning, why you placed each task at its assigned time. For example, mention that walking the dog is best done in the cooler morning hours, or that a midday interview requires prep time earlier in the day.\n\nFormat the response as a JSON object with the following structure:\n{\n\t"explanation": "Detailed explanation justifying the schedule, with references to the tasks and practical considerations (e.g., energy levels, routines, dependencies)",\n\t"tasks": [\n\t\t{\n\t\t\t"time": "string (e.g., '9:00 AM')",\n\t\t\t"task": "string (name or description of the task)"\n\t\t},\n\t\t...\n\t]\n}\n\nExample:\n{\n\t"explanation": "This schedule places walking the dog early in the morning when it's cooler and the day is fresh, and takes advantage of the natural drop in energy after lunch for lighter tasks. The interview preparation is scheduled in a focused morning slot with ample time before the noon interview. Taking the kids to school is set at the appropriate time, ensuring that they are well-prepared for the day.",\n\t"tasks": [\n\t\t{\n\t\t\t"time": "7:00 AM",\n\t\t\t"task": "Walk the dog"\n\t\t},\n\t\t{\n\t\t\t"time": "8:00 AM",\n\t\t\t"task": "Take kids to school"\n\t\t}\n\t]\n} 
```

when formating it looks like this:

```
I need help scheduling these tasks for today: %s 
 
Please create a daily schedule under the following guidelines: 
1. If a task includes a specific time (e.g., "prepare for interview at noon"), schedule it at that exact time. 
2. Ensure that tasks follow a natural daily order. For instance, if a task should logically come after another (like brushing teeth after eating lunch), then the schedule should reflect that dependency. 
3. Consider natural energy levels throughout the day and allocate tasks to times when they are most likely to be performed efficiently. For example, plan physically demanding tasks or intellectually challenging ones when energy is high. 
4. If multiple tasks lack explicit time information, assign them optimal times based on realistic daily routines and dependencies. 
5. Provide a detailed explanation that justifies each scheduling decision by relating them to the actual tasks. Explain, using common sense and everyday reasoning, why you placed each task at its assigned time. For example, mention that walking the dog is best done in the cooler morning hours, or that a midday interview requires prep time earlier in the day. 
 
Format the response as a JSON object with the following structure: 
{ 
 "explanation": "Detailed explanation justifying the schedule, with references to the tasks and practical considerations (e.g., energy levels, routines, dependencies)", 
 "tasks": [ 
  { 
   "time": "string (e.g., '9:00 AM')", 
   "task": "string (name or description of the task)" 
  }, 
  ... 
 ] 
} 
 
Example: 
{ 
 "explanation": "This schedule places walking the dog early in the morning when it's cooler and the day is fresh, and takes advantage of the natural drop in energy after lunch for lighter tasks. The interview preparation is scheduled in a focused morning slot with ample time before the noon interview. Taking the kids to school is set at the appropriate time, ensuring that they are well-prepared for the day.", 
 "tasks": [ 
  { 
   "time": "7:00 AM", 
   "task": "Walk the dog" 
  }, 
  { 
   "time": "8:00 AM", 
   "task": "Take kids to school" 
  } 
 ] 
}
```
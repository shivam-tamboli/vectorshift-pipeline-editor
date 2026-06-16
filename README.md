# VectorShift Pipeline Editor

A visual drag-and-drop pipeline builder where you can design AI workflows by connecting nodes on a canvas — no code required. Built as part of the VectorShift Frontend Technical Assessment.

---

## What it does

You open the app, drag blocks (nodes) onto a canvas, connect them with arrows, and hit Submit. The backend then tells you how many nodes and edges your pipeline has and whether it's logically valid — meaning it flows in one direction without looping back on itself.

The idea is similar to tools like n8n or LangFlow, where instead of writing code to define an AI workflow, you draw it.

---

## Features

- **Drag and drop canvas** — pull any node from the toolbar and drop it onto the canvas
- **9 node types** — Input, Output, LLM, Text, Filter, API Request, Transform, Merge, and Note
- **Connect nodes** — draw arrows between nodes by dragging from one connection point to another
- **Smart Text node** — type `{{variable_name}}` inside a Text node and a new input handle appears automatically for that variable
- **Auto-resize** — the Text node grows in height as you type more content
- **Pipeline validation** — click Submit to get the node count, edge count, and whether the pipeline is a valid DAG (no circular loops)
- **Result modal** — clean popup showing the analysis results with a clear valid/invalid indicator
- **Dark theme** — fully styled dark UI across the entire app

---

## Tech Stack

**Frontend**
- React 18
- ReactFlow 11 — handles the canvas, drag/drop, node connections
- Zustand — state management for nodes and edges

**Backend**
- Python 3
- FastAPI
- Pydantic — request body validation

---

## Getting Started

You need two terminals — one for the frontend, one for the backend.

### Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`

### Backend

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

Runs at `http://localhost:8000`

Make sure both are running before you click Submit — the button sends the pipeline data to the backend and displays the response.

---

## How to use it

1. **Drag nodes** from the toolbar at the top onto the canvas
2. **Connect nodes** by hovering over a node's edge until you see a dot, then dragging to another node's dot
3. **Fill in fields** inside each node (name, type, condition, URL, etc.)
4. **Try the Text node** — type something like `Hello {{name}}, your order {{id}} is ready` and watch new input handles appear for each variable
5. **Click Submit** at the bottom — a modal shows your pipeline stats and whether it's valid

---

## Node Types

| Node | Inputs | Outputs | What it's for |
|---|---|---|---|
| Input | — | 1 | Entry point for data coming into the pipeline |
| Output | 1 | — | Final destination for the pipeline result |
| LLM | 2 (system, prompt) | 1 | Sends prompts to a language model |
| Text | dynamic | 1 | Holds text with optional `{{variable}}` placeholders |
| Filter | 1 | 2 (pass, fail) | Routes data based on a condition |
| API Request | 1 | 1 | Makes an HTTP request to an external endpoint |
| Transform | 1 | 1 | Applies a transformation (uppercase, trim, etc.) |
| Merge | 2 | 1 | Combines two inputs into one |
| Note | — | — | A sticky note on the canvas, no connections |

---

## API

### `POST /pipelines/parse`

Send your pipeline nodes and edges to validate the structure.

**Request body**
```json
{
  "nodes": [{ "id": "customInput-1", ... }],
  "edges": [{ "source": "customInput-1", "target": "llm-1" }]
}
```

**Response**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

`is_dag` is `true` if the pipeline has no circular connections — meaning it will execute from start to finish without getting stuck in a loop.

---

## Project Structure

```
frontend_technical_assessment/
├── frontend/
│   └── src/
│       ├── nodes/
│       │   ├── BaseNode.js       ← shared abstraction all nodes use
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js       ← auto-resize + variable handles
│       │   ├── filterNode.js
│       │   ├── apiNode.js
│       │   ├── transformNode.js
│       │   ├── mergeNode.js
│       │   └── noteNode.js
│       ├── App.js
│       ├── ui.js                 ← ReactFlow canvas
│       ├── toolbar.js            ← draggable node buttons
│       ├── store.js              ← Zustand state
│       ├── submit.js             ← Submit button + result modal
│       └── index.css             ← dark theme styles
└── backend/
    └── main.py                   ← FastAPI + DAG validation
```

---

## DAG Validation

When you click Submit, the backend runs a depth-first search on your pipeline graph to check for cycles. A valid pipeline (DAG) means data flows in one direction — from inputs through processing nodes to outputs — without any node depending on its own output downstream.

If there's a loop, you'll see a clear warning in the result modal telling you to remove the circular connection.

# VectorShift Pipeline Editor

A visual drag-and-drop pipeline builder where you design AI workflows by connecting nodes on a canvas. When you're done, hit **Validate Pipeline** to check whether your pipeline is structurally valid.

**Live:** [vectorshift-pipeline-editor-tau.vercel.app](https://vectorshift-pipeline-editor-tau.vercel.app)  
**API:** [vectorshift-pipeline-editor.onrender.com](https://vectorshift-pipeline-editor.onrender.com)

---

## Screenshots

**Canvas with connected nodes**  
![Pipeline Canvas](./screenshots/pipeline-canvas.png)

**Valid pipeline — no cycles detected**  
![Valid Result](./screenshots/valid-pipeline.png)

**Invalid pipeline — loop detected**  
![Invalid Result](./screenshots/invalid-pipeline.png)

---

## What I built

This is my submission for the VectorShift Frontend Technical Assessment. It covers all four parts:

### Part 1 — Node Abstraction

I created `BaseNode.js` as a shared component that all nine node types extend. It handles renders, handles (inputs/outputs), hover toolbar, selection glow, and layout in one place. Adding a new node is now 10–15 lines — just pass a type, color, icon, and handle config.

There are two layout modes inside BaseNode:
- **CompactNode** — 80×80 square icon card, used by most nodes
- **WideNode** — rectangular card with a header and body, used by TextNode so the textarea is visible on the canvas

Original nodes: Input, Output, LLM, Text  
Five new nodes I added: **Filter**, **API Request**, **Transform**, **Merge**, **Note**

### Part 2 — Styling

Full dark UI built with Tailwind CSS and inline styles. Components covered:
- Top bar with logo and editable pipeline name
- Left sidebar with node catalog, search, and collapsible categories
- Canvas with dot grid, bezier edges, mini-map, and controls
- Right config panel that slides open when you click a node
- Bottom submit bar showing node/edge counts and the validate button

Nodes glow green when selected, edges connected to a selected node turn green, and hover reveals a quick-action toolbar (delete, duplicate, configure, quick-connect).

### Part 3 — Text Node Logic

Two behaviors added to the Text node:

1. **Auto-resize** — the node width is calculated from the longest line of text, and height grows with `scrollHeight` as you type more lines.

2. **Variable handles** — typing `{{variable_name}}` inside the text area extracts the variable name with a regex and creates a new input handle on the left side of the node for it. Multiple unique variables each get their own handle. These update live as you type.

### Part 4 — Backend Integration

`submit.js` sends the current nodes and edges as JSON to `POST /pipelines/parse` on the FastAPI backend. The backend returns:

```json
{ "num_nodes": 3, "num_edges": 2, "is_dag": true }
```

The frontend shows the result in a modal with a clear valid/invalid status and a plain-English explanation.

On the backend, `main.py` runs a DFS-based cycle detection algorithm. It builds an adjacency list from the edges and walks the graph — if it finds a back edge (a node it's already visiting in the current path), it flags the pipeline as invalid.

---

## Running it locally

You need two terminals open at the same time.

**Frontend**
```bash
cd frontend
npm install
npm start
```
Runs at `http://localhost:3000`

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs at `http://localhost:8000`

If the frontend can't reach the backend, check that `REACT_APP_API_URL` is either unset (defaults to `http://localhost:8000`) or set to the correct URL.

---

## Using the app

1. Drag a node from the left sidebar onto the canvas
2. Hover a node's edge until a dot appears, then drag from that dot to another node
3. Try the **Text node** — type `Hello {{name}}, your order is {{id}}` and watch handles appear for `name` and `id`
4. Click **Validate Pipeline** in the bottom bar
5. A modal shows the node count, edge count, and whether the pipeline is a valid DAG

Right-click the canvas or any node for more options.

---

## Node reference

| Node | Inputs | Outputs | What it does |
|---|---|---|---|
| Input | — | 1 | Entry point for data flowing into the pipeline |
| Output | 1 | — | Terminal node that receives the final result |
| LLM | 2 (system, prompt) | 1 | Sends a prompt to a language model |
| Text | dynamic | 1 | Text template with `{{variable}}` input handles |
| Filter | 1 | 2 (pass, fail) | Routes data based on a condition |
| API Request | 1 | 1 | Makes an HTTP request to an external endpoint |
| Transform | 1 | 1 | Applies a string transformation (uppercase, trim, etc.) |
| Merge | 2 | 1 | Combines two inputs into a single output |
| Note | — | — | Freeform annotation on the canvas, no connections |

---

## Project structure

```
frontend_technical_assessment/
├── frontend/
│   └── src/
│       ├── nodes/
│       │   ├── BaseNode.js        ← abstraction all nodes are built on
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js        ← auto-resize + {{variable}} handles
│       │   ├── filterNode.js      ← new
│       │   ├── apiNode.js         ← new
│       │   ├── transformNode.js   ← new
│       │   ├── mergeNode.js       ← new
│       │   └── noteNode.js        ← new
│       ├── App.js
│       ├── ui.js                  ← ReactFlow canvas
│       ├── sidebar.js             ← node catalog + search
│       ├── topBar.js              ← logo + pipeline name
│       ├── submit.js              ← validate button + result modal
│       ├── statusBar.js           ← node/edge count + zoom
│       ├── configPanel.js         ← per-node settings panel
│       ├── store.js               ← Zustand state
│       └── index.css
└── backend/
    ├── main.py                    ← FastAPI + DAG validation
    └── requirements.txt
```

---

## Tech stack

**Frontend** — React 18, ReactFlow 11, Zustand 4, Tailwind CSS 3, Radix UI, lucide-react  
**Backend** — Python 3, FastAPI, Pydantic

---

## Environment variables

**Backend (Render)**

| Variable | Value |
|---|---|
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend URLs (e.g. your Vercel URL) |

**Frontend (Vercel)**

| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | URL of the deployed backend |

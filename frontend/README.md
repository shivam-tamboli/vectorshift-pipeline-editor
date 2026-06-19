# Frontend

React 18 app built with Create React App.

## Setup

```bash
npm install
npm start
```

Runs at `http://localhost:3000`. The app expects the backend at `http://localhost:8000` by default. Set `REACT_APP_API_URL` to point at a different backend URL.

## Build

```bash
npm run build
```

Outputs a production build to the `build/` folder.

## Key files

- `src/nodes/BaseNode.js` — shared node abstraction
- `src/submit.js` — validate button and result modal
- `src/ui.js` — ReactFlow canvas
- `src/store.js` — Zustand state management

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# In production set ALLOWED_ORIGINS to your Vercel URL e.g.
# ALLOWED_ORIGINS=https://your-app.vercel.app
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def check_is_dag(nodes: list, edges: list) -> bool:
    graph = {node["id"]: [] for node in nodes}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in graph:
            graph[src].append(tgt)

    # DFS-based cycle detection: WHITE=0, GRAY=1 (in stack), BLACK=2 (done)
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node["id"]: WHITE for node in nodes}

    def dfs(node_id):
        color[node_id] = GRAY
        for neighbor in graph.get(node_id, []):
            if neighbor not in color:
                continue
            if color[neighbor] == GRAY:
                return False
            if color[neighbor] == WHITE and not dfs(neighbor):
                return False
        color[node_id] = BLACK
        return True

    for node in nodes:
        if color[node["id"]] == WHITE:
            if not dfs(node["id"]):
                return False
    return True


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    nodes = pipeline.nodes
    edges = pipeline.edges
    return {
        "num_nodes": len(nodes),
        "num_edges": len(edges),
        "is_dag": check_is_dag(nodes, edges),
    }

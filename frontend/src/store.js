// store.js

import { createWithEqualityFn as create } from "zustand/traditional";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],

    /* ── Selection ───────────────────────────────────── */
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    /* ── Connect mode ────────────────────────────────── */
    pendingConnectId: null,
    setPendingConnect: (id) => set({ pendingConnectId: id }),

    /* ── Node data ───────────────────────────────────── */
    updateNodeData: (nodeId, updates) =>
      set({
        nodes: get().nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
        ),
      }),

    /* ── Node lifecycle ──────────────────────────────── */
    deleteNode: (nodeId) =>
      set({
        nodes: get().nodes.filter((n) => n.id !== nodeId),
        edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      }),

    duplicateNode: (nodeId) => {
      const src = get().nodes.find((n) => n.id === nodeId);
      if (!src) return;
      const newId = `${src.type}-copy-${Date.now()}`;
      get().addNode({
        ...src,
        id: newId,
        position: { x: src.position.x + 40, y: src.position.y + 40 },
        data: { ...src.data, id: newId },
        selected: false,
      });
    },

    quickConnect: (sourceId, targetId) =>
      set({
        edges: addEdge(
          { source: sourceId, target: targetId, type: 'smoothstep', animated: true,
            markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } },
          get().edges
        ),
      }),

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));

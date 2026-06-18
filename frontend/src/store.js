import { createWithEqualityFn as create } from "zustand/traditional";
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

const EDGE_STYLE = {
  type: 'default',
  animated: true,
  style: { stroke: '#5c5c5c', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#5c5c5c', width: 14, height: 14 },
};

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  /* ── Selection ───────────────────────────────────── */
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  /* ── Connect mode ────────────────────────────────── */
  pendingConnectId: null,
  setPendingConnect: (id) => set({ pendingConnectId: id }),

  /* ── Pipeline meta ───────────────────────────────── */
  pipelineName: 'Untitled Pipeline',
  setPipelineName: (name) => set({ pipelineName: name }),

  rfInstance: null,
  setRfInstance: (instance) => set({ rfInstance: instance }),

  viewport: { x: 0, y: 0, zoom: 1 },
  setViewport: (vp) => set({ viewport: vp }),

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

  disconnectNode: (nodeId) =>
    set({ edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId) }),

  insertNodeOnEdge: (edgeId, position, nodeType) => {
    const edge = get().edges.find((e) => e.id === edgeId);
    if (!edge) return;
    const nodeId = get().getNodeID(nodeType);
    get().addNode({ id: nodeId, type: nodeType, position, data: { id: nodeId, nodeType } });
    set({
      edges: [
        ...get().edges.filter((e) => e.id !== edgeId),
        { id: `e-${edge.source}-${nodeId}`, source: edge.source, target: nodeId, ...EDGE_STYLE },
        { id: `e-${nodeId}-${edge.target}`, source: nodeId,  target: edge.target, ...EDGE_STYLE },
      ],
    });
  },

  /* ── Clipboard ───────────────────────────────────── */
  clipboard: null,
  copyToClipboard: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (node) set({ clipboard: node });
  },
  pasteFromClipboard: () => {
    const cb = get().clipboard;
    if (!cb) return;
    const newId = `${cb.type}-paste-${Date.now()}`;
    get().addNode({
      ...cb,
      id: newId,
      position: { x: cb.position.x + 60, y: cb.position.y + 60 },
      data: { ...cb.data, id: newId },
      selected: false,
    });
  },

  quickConnect: (sourceId, targetId) =>
    set({
      edges: addEdge(
        { source: sourceId, target: targetId, ...EDGE_STYLE },
        get().edges
      ),
    }),

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge({ ...connection, ...EDGE_STYLE }, get().edges),
    }),

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) node.data = { ...node.data, [fieldName]: fieldValue };
        return node;
      }),
    });
  },
}));

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { Link2 } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { ContextMenu } from './contextMenu';
import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';
import { FilterNode }    from './nodes/filterNode';
import { ApiNode }       from './nodes/apiNode';
import { TransformNode } from './nodes/transformNode';
import { MergeNode }     from './nodes/mergeNode';
import { NoteNode }      from './nodes/noteNode';

import 'reactflow/dist/style.css';

const gridSize   = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  apiRequest:   ApiNode,
  transform:    TransformNode,
  merge:        MergeNode,
  note:         NoteNode,
};

const selector = (state) => ({
  nodes:             state.nodes,
  edges:             state.edges,
  getNodeID:         state.getNodeID,
  addNode:           state.addNode,
  onNodesChange:     state.onNodesChange,
  onEdgesChange:     state.onEdgesChange,
  onConnect:         state.onConnect,
  setRfInstance:     state.setRfInstance,
  setViewport:       state.setViewport,
  pendingConnectId:  state.pendingConnectId,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [rfInst, setRfInst] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const {
    nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect,
    setRfInstance, setViewport, pendingConnectId,
  } = useStore(selector, shallow);

  const handleInit = useCallback((instance) => {
    setRfInst(instance);
    setRfInstance(instance);
  }, [setRfInstance]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    const { nodeType: type } = JSON.parse(raw);
    if (!type) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInst.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    const nodeID = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [rfInst, getNodeID, addNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((_e, clickedNode) => {
    const s = useStore.getState();
    if (s.pendingConnectId && s.pendingConnectId !== clickedNode.id) {
      s.quickConnect(s.pendingConnectId, clickedNode.id);
      s.setPendingConnect(null);
    } else if (!s.pendingConnectId) {
      s.setSelectedNodeId(clickedNode.id);
    }
  }, []);

  const onPaneClick = useCallback(() => {
    const s = useStore.getState();
    setContextMenu(null);
    if (s.pendingConnectId) s.setPendingConnect(null);
    else s.setSelectedNodeId(null);
  }, []);

  const onNodeContextMenu = useCallback((e, node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'node', nodeId: node.id });
  }, []);

  const onPaneContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'canvas' });
  }, []);

  const onMoveEnd = useCallback((_e, vp) => {
    setViewport(vp);
  }, [setViewport]);

  // Cancel connect mode on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') useStore.getState().setPendingConnect(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const isInput = () => ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    const onKey = (e) => {
      if (isInput()) return;
      const s = useStore.getState();

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const sel = s.nodes.find((n) => n.selected);
        if (sel) s.duplicateNode(sel.id);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        s.rfInstance?.fitView({ duration: 400 });
        return;
      }

      if (e.key === 'Escape') {
        s.setSelectedNodeId(null);
        s.setPendingConnect(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
      {pendingConnectId && (
        <div className="connect-banner">
          <Link2 size={13} />
          Click a node to connect &nbsp;—&nbsp;
          <kbd className="connect-kbd">Esc</kbd>&nbsp;to cancel
        </div>
      )}

      <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />

      <ReactFlow
        style={{ background: '#0f0f0f' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={handleInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="bezier"
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        fitView
      >
        <Background variant="dots" color="#1e2236" gap={20} size={1.2} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const c = {
              customInput: '#3b82f6', customOutput: '#10b981', llm: '#8b5cf6',
              text: '#f59e0b', filter: '#ef4444', apiRequest: '#06b6d4',
              transform: '#14b8a6', merge: '#ec4899', note: '#eab308',
            };
            return c[n.type] || '#6366f1';
          }}
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>
    </div>
  );
};

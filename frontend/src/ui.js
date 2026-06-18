import { useState, useRef, useCallback, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
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

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Defined outside component so ReactFlow doesn't re-mount nodes on re-render
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
  nodes:              state.nodes,
  edges:              state.edges,
  getNodeID:          state.getNodeID,
  addNode:            state.addNode,
  onNodesChange:      state.onNodesChange,
  onEdgesChange:      state.onEdgesChange,
  onConnect:          state.onConnect,
  setSelectedNodeId:  state.setSelectedNodeId,
  pendingConnectId:   state.pendingConnectId,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect,
          setSelectedNodeId, pendingConnectId } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Read state directly inside callback to avoid stale closure issues
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
    if (s.pendingConnectId) s.setPendingConnect(null);
    else s.setSelectedNodeId(null);
  }, []);

  // Cancel connect mode on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') useStore.getState().setPendingConnect(null);
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
          <kbd className="connect-kbd">Esc</kbd>
          &nbsp;to cancel
        </div>
      )}
      <ReactFlow
        style={{ background: '#0f1015' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        fitView
      >
        <Background variant="dots" color="#1e2236" gap={20} size={1.2} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const colorMap = {
              customInput: '#3b82f6', customOutput: '#10b981',
              llm: '#a78bfa', text: '#f59e0b', filter: '#f43f5e',
              apiRequest: '#06b6d4', transform: '#14b8a6',
              merge: '#ec4899', note: '#eab308',
            };
            return colorMap[n.type] || '#6366f1';
          }}
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>
    </div>
  );
};

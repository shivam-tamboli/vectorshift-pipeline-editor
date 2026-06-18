import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { Link2, LogIn, LogOut, Brain, FileText, Filter, Globe, Shuffle, GitMerge, StickyNote, MousePointerClick, Workflow, GitBranch } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { ContextMenu } from './contextMenu';
import { EdgeWithButton } from './edges/EdgeWithButton';
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

const gridSize   = 24;
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

const edgeTypes = { default: EdgeWithButton };

const INSERT_NODES = [
  { type: 'customInput',  label: 'Input',       color: '#3b82f6', icon: LogIn      },
  { type: 'customOutput', label: 'Output',      color: '#10b981', icon: LogOut     },
  { type: 'llm',          label: 'LLM',         color: '#8b5cf6', icon: Brain      },
  { type: 'text',         label: 'Text',        color: '#f59e0b', icon: FileText   },
  { type: 'filter',       label: 'Filter',      color: '#ef4444', icon: Filter     },
  { type: 'apiRequest',   label: 'API Request', color: '#06b6d4', icon: Globe      },
  { type: 'transform',    label: 'Transform',   color: '#14b8a6', icon: Shuffle    },
  { type: 'merge',        label: 'Merge',       color: '#ec4899', icon: GitMerge   },
  { type: 'note',         label: 'Note',        color: '#eab308', icon: StickyNote },
];

const selector = (state) => ({
  nodes:            state.nodes,
  edges:            state.edges,
  getNodeID:        state.getNodeID,
  addNode:          state.addNode,
  onNodesChange:    state.onNodesChange,
  onEdgesChange:    state.onEdgesChange,
  onConnect:        state.onConnect,
  setRfInstance:    state.setRfInstance,
  setViewport:      state.setViewport,
  pendingConnectId: state.pendingConnectId,
  selectedNodeId:   state.selectedNodeId,
  insertNodeOnEdge: state.insertNodeOnEdge,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [rfInst, setRfInst] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [insertMenu,  setInsertMenu]  = useState(null);

  const {
    nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect,
    setRfInstance, setViewport, pendingConnectId, selectedNodeId, insertNodeOnEdge,
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
    setInsertMenu(null);
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

  const handleEdgeAdd = useCallback((edgeId, canvasPos) => {
    if (!rfInst) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const vp = rfInst.getViewport();
    setInsertMenu({
      edgeId,
      canvasPos,
      x: bounds.left + canvasPos.x * vp.zoom + vp.x,
      y: bounds.top  + canvasPos.y * vp.zoom + vp.y,
    });
  }, [rfInst]);

  const displayEdges = useMemo(() => edges.map((e) => {
    const connected = selectedNodeId && (e.source === selectedNodeId || e.target === selectedNodeId);
    return {
      ...e,
      type: 'default',
      style: connected
        ? { stroke: '#22c55e', strokeWidth: 2.5, filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.5))' }
        : (e.style || { stroke: '#4a4a4a', strokeWidth: 2 }),
      markerEnd: connected ? { ...e.markerEnd, color: '#22c55e' } : e.markerEnd,
      data: { ...e.data, onAdd: handleEdgeAdd },
    };
  }), [edges, selectedNodeId, handleEdgeAdd]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        useStore.getState().setPendingConnect(null);
        setInsertMenu(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

      {insertMenu && (
        <div
          style={{
            position: 'fixed',
            left: insertMenu.x,
            top: insertMenu.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 3000,
            background: '#1c1c1c',
            border: '1px solid #2a2a2a',
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            maxWidth: 220,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ width: '100%', fontSize: 10, color: '#555', textAlign: 'center', marginBottom: 2, letterSpacing: '0.05em' }}>
            INSERT NODE
          </p>
          {INSERT_NODES.map(({ type, label, color, icon: Icon }) => (
            <button
              key={type}
              title={label}
              onClick={() => { insertNodeOnEdge(insertMenu.edgeId, insertMenu.canvasPos, type); setInsertMenu(null); }}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${color}20`, border: `1px solid ${color}40`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon size={16} color={color} strokeWidth={2} />
            </button>
          ))}
        </div>
      )}

      {/* Empty-canvas onboarding — disappears the moment a node is added */}
      {nodes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 5,
        }}>
          <div style={{
            background: 'rgba(20,20,20,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #2a2a2a',
            borderRadius: 16,
            padding: '32px 40px',
            textAlign: 'center',
            maxWidth: 400,
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Workflow size={24} color="#fff" strokeWidth={2} />
            </div>
            <p style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Start building your pipeline
            </p>
            <p style={{ color: '#555', fontSize: 12, marginBottom: 24, lineHeight: 1.5 }}>
              Follow these 3 steps to create your first pipeline
            </p>

            {[
              {
                step: '1',
                color: '#6366f1',
                icon: MousePointerClick,
                title: 'Drag a node',
                desc: 'Pick any node from the left sidebar and drag it onto this canvas',
              },
              {
                step: '2',
                color: '#22c55e',
                icon: Link2,
                title: 'Connect nodes',
                desc: 'Hover a node to see dots on its edges — drag between dots to connect',
              },
              {
                step: '3',
                color: '#f59e0b',
                icon: GitBranch,
                title: 'Validate',
                desc: 'Click "Validate Pipeline" in the top bar to check your work',
              },
            ].map(({ step, color, icon: Icon, title, desc }) => (
              <div key={step} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                textAlign: 'left', marginBottom: 16,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: `${color}20`, border: `1px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} color={color} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ color: '#c0c0c0', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{title}</p>
                  <p style={{ color: '#555', fontSize: 11, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}

            <p style={{ color: '#333', fontSize: 10, marginTop: 8 }}>
              Right-click the canvas for more options · Press&nbsp;<kbd style={{ background:'#2a2a2a',border:'1px solid #3a3a3a',borderRadius:4,padding:'1px 5px',color:'#888',fontSize:10 }}>?</kbd>&nbsp;for shortcuts
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        style={{ background: '#171717' }}
        nodes={nodes}
        edges={displayEdges}
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
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="bezier"
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        fitView
      >
        <Background variant="dots" color="#2d2d2d" gap={24} size={1.5} />
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

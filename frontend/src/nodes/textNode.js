import { useRef, useEffect, useCallback } from 'react';
import { FileText } from 'lucide-react';
import BaseNode from './BaseNode';
import { extractVariables } from '../lib/utils';
import { useStore } from '../store';

const COLOR = '#f59e0b';

// Computes how wide the node should be based on the longest line typed
const calcWidth = (text) => {
  const lines = (text || '').split('\n');
  const longest = Math.max(...lines.map((l) => l.length), 12);
  return Math.min(400, Math.max(220, longest * 8.5 + 48));
};

export const TextNode = ({ id, data }) => {
  const text = data?.text ?? '{{input}}';
  const variables = extractVariables(text);
  const varInputs = variables.map((v) => ({ id: v, label: v }));
  const taRef = useRef(null);

  const updateText = useCallback(
    (val) => useStore.getState().updateNodeData(id, { text: val }),
    [id]
  );

  // Auto-grow textarea height whenever text changes
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [text]);

  const minWidth = calcWidth(text);

  return (
    <BaseNode
      id={id}
      title="Text"
      color={COLOR}
      icon={FileText}
      inputs={varInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      minWidth={minWidth}
    >
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => updateText(e.target.value)}
        // nodrag / nopan prevents ReactFlow from starting a node-drag
        // while the user is typing or selecting text inside the textarea
        className="nodrag nopan"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        placeholder="Type text with {{variables}}…"
        rows={1}
        style={{
          width: '100%',
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: 6,
          color: '#e2e8f0',
          fontSize: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: 1.5,
          padding: '6px 8px',
          resize: 'none',
          outline: 'none',
          overflow: 'hidden',
          minHeight: 32,
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
          display: 'block',
        }}
        onFocus={(e) => { e.target.style.borderColor = COLOR; }}
        onBlur={(e)  => { e.target.style.borderColor = '#2a2a2a'; }}
      />
      {variables.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {variables.map((v) => (
            <span key={v} className="node-var-badge">{`{{${v}}}`}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

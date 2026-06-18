import { useEffect } from 'react';
import {
  X, LogIn, LogOut, Brain, FileText, Filter,
  Globe, Shuffle, GitMerge, StickyNote,
} from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { extractVariables } from './lib/utils';

/* ── Node metadata catalogue ──────────────────────────────────── */
const NODE_META = {
  customInput:  { label: 'Input',       color: '#3b82f6', icon: LogIn      },
  customOutput: { label: 'Output',      color: '#10b981', icon: LogOut     },
  llm:          { label: 'LLM',         color: '#a78bfa', icon: Brain      },
  text:         { label: 'Text',        color: '#f59e0b', icon: FileText   },
  filter:       { label: 'Filter',      color: '#f43f5e', icon: Filter     },
  apiRequest:   { label: 'API Request', color: '#06b6d4', icon: Globe      },
  transform:    { label: 'Transform',   color: '#14b8a6', icon: Shuffle    },
  merge:        { label: 'Merge',       color: '#ec4899', icon: GitMerge   },
  note:         { label: 'Note',        color: '#eab308', icon: StickyNote },
};

/* ── Reusable field wrapper ───────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="node-field">
    {label && <label className="node-label">{label}</label>}
    {children}
  </div>
);

/* ── Per-type field renderers ─────────────────────────────────── */
const renderFields = (node, onUpdate) => {
  const d = node.data || {};

  switch (node.type) {
    case 'customInput': {
      const name = d.inputName ?? node.id.replace('customInput-', 'input_');
      const type = d.inputType ?? 'Text';
      return (
        <>
          <Field label="Name">
            <input className="node-input" type="text" value={name}
                   onChange={(e) => onUpdate({ inputName: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className="node-select" value={type}
                    onChange={(e) => onUpdate({ inputType: e.target.value })}>
              <option value="Text">Text</option>
              <option value="File">File</option>
            </select>
          </Field>
        </>
      );
    }

    case 'customOutput': {
      const name = d.outputName ?? node.id.replace('customOutput-', 'output_');
      const type = d.outputType ?? 'Text';
      return (
        <>
          <Field label="Name">
            <input className="node-input" type="text" value={name}
                   onChange={(e) => onUpdate({ outputName: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className="node-select" value={type}
                    onChange={(e) => onUpdate({ outputType: e.target.value })}>
              <option value="Text">Text</option>
              <option value="Image">Image</option>
            </select>
          </Field>
        </>
      );
    }

    case 'llm':
      return (
        <p className="node-info-text">
          Wire a System Prompt and a User Prompt from the canvas, then connect the Response
          output to the next node. No fields needed here.
        </p>
      );

    case 'text': {
      const text      = d.text ?? '{{input}}';
      const variables = extractVariables(text);
      return (
        <>
          <Field label="Text Content">
            <textarea
              className="node-textarea"
              value={text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Type text with {{variables}}"
              rows={6}
              style={{ width: '100%', resize: 'vertical', minHeight: 120 }}
              autoFocus
            />
          </Field>
          {variables.length > 0 && (
            <Field label={`Variables detected (${variables.length})`}>
              <div className="node-vars">
                {variables.map((v) => (
                  <span key={v} className="node-var-badge">{`{{${v}}}`}</span>
                ))}
              </div>
              <p className="node-info-text" style={{ marginTop: 6 }}>
                Each variable creates an input handle on the canvas node.
              </p>
            </Field>
          )}
        </>
      );
    }

    case 'filter': {
      const condition = d.condition ?? '';
      return (
        <>
          <Field label="Condition">
            <input className="node-input" type="text" value={condition}
                   onChange={(e) => onUpdate({ condition: e.target.value })}
                   placeholder="e.g. value > 10" />
          </Field>
          <p className="node-info-text">
            Data that satisfies the condition routes to the Pass output;
            everything else goes to Fail.
          </p>
        </>
      );
    }

    case 'apiRequest': {
      const method = d.method ?? 'GET';
      const url    = d.url    ?? '';
      return (
        <>
          <Field label="Method">
            <select className="node-select" value={method}
                    onChange={(e) => onUpdate({ method: e.target.value })}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </Field>
          <Field label="URL">
            <input className="node-input" type="text" value={url}
                   onChange={(e) => onUpdate({ url: e.target.value })}
                   placeholder="https://api.example.com/endpoint" />
          </Field>
        </>
      );
    }

    case 'transform': {
      const operation = d.operation ?? 'uppercase';
      return (
        <Field label="Operation">
          <select className="node-select" value={operation}
                  onChange={(e) => onUpdate({ operation: e.target.value })}>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="trim">Trim Whitespace</option>
            <option value="reverse">Reverse</option>
            <option value="json_parse">Parse JSON</option>
          </select>
        </Field>
      );
    }

    case 'merge':
      return (
        <p className="node-info-text">
          Receives two inputs and combines them into a single merged output.
          No configuration needed — just connect the inputs on the canvas.
        </p>
      );

    case 'note': {
      const note = d.note ?? '';
      return (
        <Field label="Note">
          <textarea
            className="node-textarea"
            value={note}
            onChange={(e) => onUpdate({ note: e.target.value })}
            placeholder="Add a note or comment…"
            rows={6}
            style={{ width: '100%', resize: 'vertical', minHeight: 120 }}
            autoFocus
          />
        </Field>
      );
    }

    default:
      return null;
  }
};

/* ── Main panel component ─────────────────────────────────────── */
const selector = (s) => ({
  nodes:             s.nodes,
  selectedNodeId:    s.selectedNodeId,
  setSelectedNodeId: s.setSelectedNodeId,
  updateNodeData:    s.updateNodeData,
});

export const ConfigPanel = () => {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData } =
    useStore(selector, shallow);

  const node = nodes.find((n) => n.id === selectedNodeId);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedNodeId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSelectedNodeId]);

  if (!node) return null;

  const meta = NODE_META[node.type] ?? { label: node.type, color: '#6366f1', icon: null };
  const { label, color, icon: Icon } = meta;

  const onUpdate = (updates) => updateNodeData(node.id, updates);

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{
        width: 280,
        background: '#141620',
        borderLeft: '1px solid #1e2236',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{ height: 52, borderBottom: '1px solid #1e2236' }}
      >
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{ background: `${color}20` }}
        >
          {Icon && <Icon size={15} color={color} strokeWidth={2.5} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight" style={{ color: '#e2e8f0' }}>{label}</p>
          <p className="text-[10px] leading-tight mt-0.5 font-mono truncate" style={{ color: '#4a5068' }}>
            {node.id}
          </p>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{
            background: 'transparent',
            border: '1px solid #1e2236',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#252a3e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          title="Close (Esc)"
        >
          <X size={13} color="#8892a4" />
        </button>
      </div>

      {/* Fields */}
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2236 transparent' }}
      >
        {renderFields(node, onUpdate)}
      </div>
    </aside>
  );
};

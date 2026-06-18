import { useState } from 'react';
import { Maximize2, HelpCircle, X, MousePointer2, Move, Link2, Trash2, Copy, Keyboard } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges, viewport: s.viewport, rfInstance: s.rfInstance });

const SHORTCUTS = [
  { keys: ['Delete', 'Backspace'], desc: 'Delete selected node' },
  { keys: ['Ctrl', 'D'],          desc: 'Duplicate selected node' },
  { keys: ['Ctrl', 'A'],          desc: 'Select all nodes' },
  { keys: ['Ctrl', '⇧', 'F'],    desc: 'Fit canvas to view' },
  { keys: ['Esc'],                desc: 'Close panel / cancel connect' },
  { keys: ['Scroll'],             desc: 'Zoom in / out' },
];

const TIPS = [
  { icon: MousePointer2, color: '#6366f1', tip: 'Click a node to open its settings in the right panel' },
  { icon: Move,          color: '#22c55e', tip: 'Drag nodes freely — they snap to the grid' },
  { icon: Link2,         color: '#f59e0b', tip: 'Hover a node to see connection dots, then drag between them' },
  { icon: Trash2,        color: '#ef4444', tip: 'Hover a node → toolbar appears → click 🗑️ to delete' },
  { icon: Copy,          color: '#06b6d4', tip: 'Right-click anywhere on the canvas for more options' },
];

const Kbd = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: '#1e1e1e', border: '1px solid #3a3a3a',
    borderRadius: 5, padding: '2px 7px',
    fontSize: 10, color: '#a0a0a0', fontFamily: 'monospace',
    minWidth: 24,
  }}>
    {children}
  </span>
);

const HelpModal = ({ onClose }) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      padding: '0 16px 52px 0',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        background: '#141414', border: '1px solid #2a2a2a',
        borderRadius: 14, width: 320,
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        animation: 'helpIn 0.18s ease',
        pointerEvents: 'all',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 10px',
        borderBottom: '1px solid #2a2a2a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Keyboard size={14} color="#6366f1" strokeWidth={2} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>Help &amp; Shortcuts</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#555', display: 'flex', padding: 2,
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div style={{ padding: '12px 16px 8px' }}>
        <p style={{ color: '#444', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Keyboard shortcuts
        </p>
        {SHORTCUTS.map(({ keys, desc }) => (
          <div key={desc} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 7,
          }}>
            <span style={{ color: '#666', fontSize: 11 }}>{desc}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, marginLeft: 8 }}>
              {keys.map((k, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Kbd>{k}</Kbd>
                  {i < keys.length - 1 && <span style={{ color: '#333', fontSize: 9 }}>+</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{ padding: '8px 16px 14px', borderTop: '1px solid #1e1e1e' }}>
        <p style={{ color: '#444', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Quick tips
        </p>
        {TIPS.map(({ icon: Icon, color, tip }) => (
          <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={11} color={color} strokeWidth={2.5} />
            </div>
            <span style={{ color: '#666', fontSize: 11, lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes helpIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

export const StatusBar = () => {
  const { nodes, edges, viewport, rfInstance } = useStore(selector, shallow);
  const [helpOpen, setHelpOpen] = useState(false);
  const zoomPct = Math.round((viewport?.zoom ?? 1) * 100);

  return (
    <>
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      <div
        className="flex items-center gap-3 px-4 flex-shrink-0 select-none text-xs"
        style={{ height: 36, background: '#111111', borderTop: '1px solid #2a2a2a', color: '#444' }}
      >
        <span style={{ color: '#666' }}>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
        <span style={{ color: '#2a2a2a' }}>·</span>
        <span style={{ color: '#666' }}>{edges.length} edge{edges.length !== 1 ? 's' : ''}</span>

        <span className="ml-auto flex items-center gap-2">
          <span style={{ color: '#555' }}>{zoomPct}%</span>

          <button
            onClick={() => rfInstance?.fitView({ duration: 400 })}
            title="Fit view (Ctrl+Shift+F)"
            style={{
              background: 'none', border: '1px solid #2a2a2a', borderRadius: 6,
              cursor: 'pointer', color: '#555', padding: '3px 7px',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4a4a4a'; e.currentTarget.style.color = '#999'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
          >
            <Maximize2 size={10} strokeWidth={2} />
            Fit
          </button>

          <button
            onClick={() => setHelpOpen((v) => !v)}
            title="Help & shortcuts"
            style={{
              background: helpOpen ? '#6366f120' : 'none',
              border: `1px solid ${helpOpen ? '#6366f150' : '#2a2a2a'}`,
              borderRadius: 6, cursor: 'pointer',
              color: helpOpen ? '#6366f1' : '#555',
              padding: '3px 7px',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (!helpOpen) { e.currentTarget.style.borderColor = '#4a4a4a'; e.currentTarget.style.color = '#999'; } }}
            onMouseLeave={(e) => { if (!helpOpen) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; } }}
          >
            <HelpCircle size={10} strokeWidth={2} />
            ?
          </button>
        </span>
      </div>
    </>
  );
};

import { Maximize2 } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges, viewport: s.viewport, rfInstance: s.rfInstance });

export const StatusBar = () => {
  const { nodes, edges, viewport, rfInstance } = useStore(selector, shallow);
  const zoomPct = Math.round((viewport?.zoom ?? 1) * 100);

  return (
    <div
      className="flex items-center gap-3 px-4 flex-shrink-0 select-none text-xs"
      style={{ height: 36, background: '#111111', borderTop: '1px solid #2a2a2a', color: '#444' }}
    >
      <span style={{ color: '#666' }}>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
      <span style={{ color: '#2a2a2a' }}>·</span>
      <span style={{ color: '#666' }}>{edges.length} edge{edges.length !== 1 ? 's' : ''}</span>
      <span className="ml-auto flex items-center gap-3">
        <span style={{ color: '#666' }}>{zoomPct}%</span>
        <button
          onClick={() => rfInstance?.fitView({ duration: 400 })}
          title="Fit view"
          style={{
            background: 'none', border: '1px solid #2a2a2a', borderRadius: 6,
            cursor: 'pointer', color: '#555', padding: '3px 6px',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4a4a4a'; e.currentTarget.style.color = '#999'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
        >
          <Maximize2 size={10} strokeWidth={2} />
          Fit
        </button>
      </span>
    </div>
  );
};

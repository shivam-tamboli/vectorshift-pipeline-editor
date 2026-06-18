import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges, viewport: s.viewport });

export const StatusBar = () => {
  const { nodes, edges, viewport } = useStore(selector, shallow);
  const zoomPct = Math.round((viewport?.zoom ?? 1) * 100);

  return (
    <div
      className="flex items-center gap-3 px-5 flex-shrink-0 select-none text-xs"
      style={{ height: 36, background: '#111111', borderTop: '1px solid #1e2236', color: '#4a5068' }}
    >
      <span style={{ color: '#6b7280' }}>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
      <span style={{ color: '#252a3e' }}>·</span>
      <span style={{ color: '#6b7280' }}>{edges.length} edge{edges.length !== 1 ? 's' : ''}</span>
      <span className="ml-auto">{zoomPct}%</span>
    </div>
  );
};

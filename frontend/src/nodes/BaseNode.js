import { useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2, Copy, Pencil, Link2 } from 'lucide-react';
import { useStore } from '../store';

const verticalPosition = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

/* ── Hover action toolbar ─────────────────────────────────────── */
const NodeActions = ({ nodeId, color }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId, setPendingConnect } = useStore((s) => ({
    deleteNode:        s.deleteNode,
    duplicateNode:     s.duplicateNode,
    setSelectedNodeId: s.setSelectedNodeId,
    setPendingConnect: s.setPendingConnect,
  }));

  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  const buttons = [
    {
      icon: Trash2,
      label: 'Delete node',
      danger: true,
      onClick: stop(() => deleteNode(nodeId)),
    },
    {
      icon: Copy,
      label: 'Duplicate',
      onClick: stop(() => duplicateNode(nodeId)),
    },
    {
      icon: Pencil,
      label: 'Edit / Configure',
      onClick: stop(() => setSelectedNodeId(nodeId)),
    },
    {
      icon: Link2,
      label: 'Quick connect — click another node',
      onClick: stop(() => setPendingConnect(nodeId)),
      accent: color,
    },
  ];

  return (
    <div className="node-actions">
      {buttons.map(({ icon: Icon, label, danger, onClick, accent }) => (
        <button
          key={label}
          title={label}
          onClick={onClick}
          className={`node-action-btn${danger ? ' node-action-btn--danger' : ''}`}
          style={accent ? { '--accent': accent } : undefined}
        >
          <Icon size={13} strokeWidth={2.5} />
        </button>
      ))}
    </div>
  );
};

/* ── Base node wrapper ────────────────────────────────────────── */
const BaseNode = ({
  id,
  title,
  color = '#6366f1',
  icon: Icon,
  inputs = [],
  outputs = [],
  children,
  minWidth = 240,
}) => {
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef(null);

  const onEnter = () => { clearTimeout(hideTimer.current); setHovered(true); };
  const onLeave = () => { hideTimer.current = setTimeout(() => setHovered(false), 80); };

  return (
    <div
      style={{ minWidth, position: 'relative' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Hover toolbar — lives ABOVE the card, outside overflow-hidden */}
      {hovered && (
        <NodeActions nodeId={id} color={color} />
      )}

      {/* Input handles — outside overflow-hidden so they're never clipped */}
      {inputs.map((input, i) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          title={input.label}
          style={{
            width: 10, height: 10,
            background: color,
            border: '2px solid #0c0e18',
            borderRadius: '50%',
            top: verticalPosition(i, inputs.length),
            left: -6,
          }}
        />
      ))}

      {/* Node card */}
      <div
        className="vs-node rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: '#1a1a2e',
          borderLeft: `3px solid ${color}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.15s ease, border 0.15s ease',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ borderBottom: !!children ? '1px solid #1e2236' : 'none' }}
        >
          {Icon && (
            <div
              className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
              style={{ background: `${color}22` }}
            >
              <Icon size={13} color={color} strokeWidth={2.5} />
            </div>
          )}
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: '#8892a4' }}
          >
            {title}
          </span>
          <div
            className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#2d3348', marginRight: 2 }}
            title="idle"
          />
        </div>

        {/* Body */}
        {!!children && (
          <div className="p-3 flex flex-col gap-2.5">{children}</div>
        )}
      </div>

      {/* Output handles — outside overflow-hidden */}
      {outputs.map((output, i) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          title={output.label}
          style={{
            width: 10, height: 10,
            background: color,
            border: '2px solid #0c0e18',
            borderRadius: '50%',
            top: verticalPosition(i, outputs.length),
            right: -6,
          }}
        />
      ))}
    </div>
  );
};

export default BaseNode;

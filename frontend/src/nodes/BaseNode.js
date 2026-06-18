import { useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2, Copy, Pencil, Link2 } from 'lucide-react';
import { useStore } from '../store';

const verticalPosition = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

const NodeActions = ({ nodeId, color }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId, setPendingConnect } = useStore((s) => ({
    deleteNode:        s.deleteNode,
    duplicateNode:     s.duplicateNode,
    setSelectedNodeId: s.setSelectedNodeId,
    setPendingConnect: s.setPendingConnect,
  }));

  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  const buttons = [
    { icon: Trash2, label: 'Delete',          danger: true,  onClick: stop(() => deleteNode(nodeId)) },
    { icon: Copy,   label: 'Duplicate',                      onClick: stop(() => duplicateNode(nodeId)) },
    { icon: Pencil, label: 'Edit / Configure',               onClick: stop(() => setSelectedNodeId(nodeId)) },
    { icon: Link2,  label: 'Quick connect',   accent: color, onClick: stop(() => setPendingConnect(nodeId)) },
  ];

  return (
    <div className="node-actions">
      {buttons.map(({ icon: Icon, label, danger, onClick }) => (
        <button
          key={label}
          title={label}
          onClick={onClick}
          className={`node-action-btn${danger ? ' node-action-btn--danger' : ''}`}
        >
          <Icon size={13} strokeWidth={2.5} />
        </button>
      ))}
    </div>
  );
};

const BaseNode = ({
  id,
  title,
  color = '#6366f1',
  icon: Icon,
  inputs = [],
  outputs = [],
  description,
  // children and minWidth intentionally ignored — all config is in the right panel
}) => {
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef(null);

  const onEnter = () => { clearTimeout(hideTimer.current); setHovered(true); };
  const onLeave = () => { hideTimer.current = setTimeout(() => setHovered(false), 80); };

  return (
    <div
      className={`vs-node-wrapper${hovered ? ' vs-node-wrapper--hovered' : ''}`}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {hovered && <NodeActions nodeId={id} color={color} />}

      <div style={{ position: 'relative', width: 72, height: 72 }}>
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
              border: '2px solid #0a0a0a',
              borderRadius: '50%',
              top: verticalPosition(i, inputs.length),
              left: -5,
            }}
          />
        ))}

        <div
          className="vs-node"
          style={{
            width: 72, height: 72,
            background: '#1c1c1c',
            borderRadius: 12,
            border: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'box-shadow 0.15s ease, border 0.15s ease',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 44, height: 44,
              borderRadius: 10,
              background: `${color}26`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icon && <Icon size={22} color={color} strokeWidth={2} />}
          </div>
        </div>

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
              border: '2px solid #0a0a0a',
              borderRadius: '50%',
              top: verticalPosition(i, outputs.length),
              right: -5,
            }}
          />
        ))}
      </div>

      <p style={{
        marginTop: 8,
        fontSize: 11,
        fontWeight: 600,
        color: '#a0a0a0',
        textAlign: 'center',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        lineHeight: 1,
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          marginTop: 3,
          fontSize: 10,
          color: '#555555',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default BaseNode;

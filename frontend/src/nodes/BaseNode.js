// BaseNode.js
// Core abstraction shared by every node type.
// Pass `inputs` and `outputs` as arrays of { id, label } objects.
// Handles are auto-spaced vertically. Children go inside the node body.

import { Handle, Position } from 'reactflow';

const handleStyle = (color) => ({
  width: 12,
  height: 12,
  background: color || '#4f46e5',
  border: '2px solid rgba(255,255,255,0.25)',
  borderRadius: '50%',
  transition: 'background 0.2s',
});

const verticalPosition = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

const BaseNode = ({
  id,
  title,
  color = '#4f46e5',
  inputs = [],
  outputs = [],
  children,
  minWidth = 220,
}) => {
  return (
    <div className="base-node" style={{ minWidth }}>
      {inputs.map((input, i) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          style={{
            ...handleStyle(color),
            top: verticalPosition(i, inputs.length),
          }}
          title={input.label}
        />
      ))}

      <div className="base-node__header" style={{ background: color }}>
        <span className="base-node__title">{title}</span>
      </div>

      <div className="base-node__body">{children}</div>

      {outputs.map((output, i) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          style={{
            ...handleStyle(color),
            top: verticalPosition(i, outputs.length),
          }}
          title={output.label}
        />
      ))}
    </div>
  );
};

export default BaseNode;

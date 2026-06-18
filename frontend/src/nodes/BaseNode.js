import { Handle, Position } from 'reactflow';

const verticalPosition = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

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
  return (
    <div
      className="vs-node relative rounded-xl shadow-2xl overflow-hidden"
      style={{
        minWidth,
        background: '#1a1d2b',
        border: '1px solid #1e2236',
        borderLeft: `3px solid ${color}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Input handles */}
      {inputs.map((input, i) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          title={input.label}
          style={{
            width: 10,
            height: 10,
            background: color,
            border: '2px solid #0c0e18',
            borderRadius: '50%',
            top: verticalPosition(i, inputs.length),
            left: -6,
          }}
        />
      ))}

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: '1px solid #1e2236' }}
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
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2.5">{children}</div>

      {/* Output handles */}
      {outputs.map((output, i) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          title={output.label}
          style={{
            width: 10,
            height: 10,
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

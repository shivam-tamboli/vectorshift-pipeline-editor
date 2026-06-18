import { useState } from 'react';
import { getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { Plus } from 'lucide-react';

export const EdgeWithButton = ({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {},
  markerEnd,
  data,
  animated,
}) => {
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const handleAdd = (e) => {
    e.stopPropagation();
    if (data?.onAdd) data.onAdd(id, { x: labelX, y: labelY });
  };

  return (
    <>
      {/* Wide invisible hit area for easier hover */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {/* Visible edge path */}
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path${animated ? ' animated' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              className="edge-add-btn"
              onClick={handleAdd}
              title="Insert node"
            >
              <Plus size={11} strokeWidth={2.5} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

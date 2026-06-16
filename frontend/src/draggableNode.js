export const DraggableNode = ({ type, label, color }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={onDragStart}
    >
      <span className="draggable-node__dot" style={{ background: color }} />
      {label}
    </div>
  );
};

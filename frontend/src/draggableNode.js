export const DraggableNode = ({ type, label, color, icon: Icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-1.5 rounded-lg select-none"
      style={{
        padding: '5px 10px',
        background: `${color}14`,
        border: `1px solid ${color}30`,
        color,
        cursor: 'grab',
        fontSize: 11,
        fontWeight: 500,
        transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}22`;
        e.currentTarget.style.borderColor = `${color}55`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${color}14`;
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      {Icon && <Icon size={13} strokeWidth={2.5} />}
      <span>{label}</span>
    </div>
  );
};

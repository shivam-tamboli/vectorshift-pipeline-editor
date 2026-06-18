import { useEffect } from 'react';
import { Trash2, Copy, Pencil, Unplug, Maximize2, Clipboard, MousePointer2 } from 'lucide-react';
import { useStore } from './store';

export const ContextMenu = ({ menu, onClose }) => {
  const {
    deleteNode, duplicateNode, setSelectedNodeId, disconnectNode,
    rfInstance, nodes, onNodesChange, pasteFromClipboard, clipboard,
  } = useStore((s) => ({
    deleteNode:         s.deleteNode,
    duplicateNode:      s.duplicateNode,
    setSelectedNodeId:  s.setSelectedNodeId,
    disconnectNode:     s.disconnectNode,
    rfInstance:         s.rfInstance,
    nodes:              s.nodes,
    onNodesChange:      s.onNodesChange,
    pasteFromClipboard: s.pasteFromClipboard,
    clipboard:          s.clipboard,
  }));

  useEffect(() => {
    if (!menu) return;
    const onKey   = (e) => { if (e.key === 'Escape') onClose(); };
    const onClick = () => onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => window.addEventListener('click', onClick), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
      clearTimeout(t);
    };
  }, [menu, onClose]);

  if (!menu) return null;

  const nodeItems = [
    { icon: Pencil,  label: 'Edit / Configure', onClick: () => { setSelectedNodeId(menu.nodeId); onClose(); } },
    { icon: Copy,    label: 'Duplicate',         onClick: () => { duplicateNode(menu.nodeId); onClose(); } },
    { type: 'sep' },
    { icon: Unplug,  label: 'Disconnect All',    onClick: () => { disconnectNode(menu.nodeId); onClose(); } },
    { type: 'sep' },
    { icon: Trash2,  label: 'Delete Node', danger: true, onClick: () => { deleteNode(menu.nodeId); onClose(); } },
  ];

  const canvasItems = [
    {
      icon: MousePointer2,
      label: 'Select All',
      onClick: () => {
        onNodesChange(nodes.map((n) => ({ id: n.id, type: 'select', selected: true })));
        onClose();
      },
    },
    {
      icon: Maximize2,
      label: 'Fit View',
      onClick: () => { rfInstance?.fitView({ duration: 400 }); onClose(); },
    },
    { type: 'sep' },
    {
      icon: Clipboard,
      label: 'Paste',
      disabled: !clipboard,
      onClick: () => { pasteFromClipboard(); onClose(); },
    },
  ];

  const items = menu.type === 'node' ? nodeItems : canvasItems;

  return (
    <div
      className="context-menu"
      style={{ left: menu.x, top: menu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => {
        if (item.type === 'sep') return <div key={i} className="context-sep" />;
        return (
          <button
            key={item.label}
            className={[
              'context-item',
              item.danger   ? 'context-item--danger'   : '',
              item.disabled ? 'context-item--disabled' : '',
            ].join(' ')}
            onClick={item.disabled ? undefined : item.onClick}
          >
            <item.icon size={13} strokeWidth={2.5} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

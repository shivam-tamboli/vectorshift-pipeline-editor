import { DraggableNode } from './draggableNode';

const NODE_TYPES = [
  { type: 'customInput',  label: 'Input',     color: '#2563eb' },
  { type: 'customOutput', label: 'Output',    color: '#059669' },
  { type: 'llm',          label: 'LLM',       color: '#7c3aed' },
  { type: 'text',         label: 'Text',      color: '#d97706' },
  { type: 'filter',       label: 'Filter',    color: '#dc2626' },
  { type: 'apiRequest',   label: 'API',       color: '#0891b2' },
  { type: 'transform',    label: 'Transform', color: '#0d9488' },
  { type: 'merge',        label: 'Merge',     color: '#db2777' },
  { type: 'note',         label: 'Note',      color: '#ca8a04' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <span className="toolbar__logo">VectorShift</span>
    <div className="toolbar__divider" />
    <div className="toolbar__nodes">
      {NODE_TYPES.map(({ type, label, color }) => (
        <DraggableNode key={type} type={type} label={label} color={color} />
      ))}
    </div>
  </div>
);

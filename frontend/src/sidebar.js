import { useState } from 'react';
import {
  Search, X, Workflow,
  LogIn, LogOut, Brain, FileText, Filter,
  Globe, Shuffle, GitMerge, StickyNote,
} from 'lucide-react';

const NODE_CATALOG = [
  {
    type: 'customInput',
    label: 'Input',
    description: 'Entry point for pipeline data',
    color: '#3b82f6',
    icon: LogIn,
  },
  {
    type: 'customOutput',
    label: 'Output',
    description: 'Final destination for results',
    color: '#10b981',
    icon: LogOut,
  },
  {
    type: 'llm',
    label: 'LLM',
    description: 'Send prompts to a language model',
    color: '#a78bfa',
    icon: Brain,
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Text with {{variable}} input handles',
    color: '#f59e0b',
    icon: FileText,
  },
  {
    type: 'filter',
    label: 'Filter',
    description: 'Route data to pass or fail output',
    color: '#f43f5e',
    icon: Filter,
  },
  {
    type: 'apiRequest',
    label: 'API Request',
    description: 'Make HTTP requests to any URL',
    color: '#06b6d4',
    icon: Globe,
  },
  {
    type: 'transform',
    label: 'Transform',
    description: 'Apply transformations to data',
    color: '#14b8a6',
    icon: Shuffle,
  },
  {
    type: 'merge',
    label: 'Merge',
    description: 'Combine two inputs into one',
    color: '#ec4899',
    icon: GitMerge,
  },
  {
    type: 'note',
    label: 'Note',
    description: 'Annotate your canvas',
    color: '#eab308',
    icon: StickyNote,
  },
];

const SidebarNode = ({ type, label, description, color, icon: Icon }) => {
  const [dragging, setDragging] = useState(false);

  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={() => setDragging(false)}
      className="sidebar-node"
      style={{ opacity: dragging ? 0.45 : 1 }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: `${color}20` }}
      >
        <Icon size={16} color={color} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight" style={{ color: '#e2e8f0' }}>
          {label}
        </p>
        <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: '#4a5068' }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export const NodeSidebar = () => {
  const [query, setQuery] = useState('');

  const filtered = NODE_CATALOG.filter(
    (n) =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      n.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{
        width: 256,
        background: '#141620',
        borderRight: '1px solid #1e2236',
      }}
    >
      {/* Brand header — same height as submit bar (52px) */}
      <div
        className="flex items-center gap-2.5 px-4 flex-shrink-0"
        style={{ height: 52, borderBottom: '1px solid #1e2236' }}
      >
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)' }}
        >
          <Workflow size={15} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold" style={{ color: '#e2e8f0' }}>VectorShift</span>
      </div>

      {/* Search box */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid #1e2236' }}
      >
        <div
          className="flex items-center gap-2 rounded-lg px-2.5"
          style={{ background: '#0c0e18', border: '1px solid #1e2236', height: 34 }}
        >
          <Search size={13} color="#4a5068" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search nodes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sidebar-search flex-1 bg-transparent outline-none text-xs"
            style={{ color: '#e2e8f0' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
            >
              <X size={12} color="#4a5068" />
            </button>
          )}
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: '#4a5068' }}
        >
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
            : 'Nodes — drag onto canvas'}
        </span>
      </div>

      {/* Scrollable node list */}
      <div
        className="flex-1 overflow-y-auto pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2236 transparent' }}
      >
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 px-4">
            <p className="text-xs text-center" style={{ color: '#4a5068' }}>
              No nodes match &ldquo;{query}&rdquo;
            </p>
          </div>
        ) : (
          filtered.map((node) => <SidebarNode key={node.type} {...node} />)
        )}
      </div>
    </aside>
  );
};

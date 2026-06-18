import { useState } from 'react';
import {
  Search, X, ChevronDown, ChevronRight,
  LogIn, LogOut, Brain, FileText, Filter,
  Globe, Shuffle, GitMerge, StickyNote,
} from 'lucide-react';

const NODE_CATALOG = {
  customInput:  { label: 'Input',       desc: 'Entry point for data',           color: '#3b82f6', icon: LogIn      },
  customOutput: { label: 'Output',      desc: 'Final destination for results',   color: '#10b981', icon: LogOut     },
  text:         { label: 'Text',        desc: 'Text with {{variable}} handles',  color: '#f59e0b', icon: FileText   },
  llm:          { label: 'LLM',         desc: 'Send prompts to a language model',color: '#8b5cf6', icon: Brain      },
  filter:       { label: 'Filter',      desc: 'Route data to pass or fail',      color: '#ef4444', icon: Filter     },
  transform:    { label: 'Transform',   desc: 'Apply data transformations',      color: '#14b8a6', icon: Shuffle    },
  merge:        { label: 'Merge',       desc: 'Combine two inputs into one',     color: '#ec4899', icon: GitMerge   },
  apiRequest:   { label: 'API Request', desc: 'Make HTTP requests',              color: '#06b6d4', icon: Globe      },
  note:         { label: 'Note',        desc: 'Annotate your canvas',            color: '#eab308', icon: StickyNote },
};

const CATEGORIES = [
  { name: 'DATA',        ids: ['customInput', 'customOutput', 'text'] },
  { name: 'AI',          ids: ['llm'] },
  { name: 'LOGIC',       ids: ['filter', 'transform', 'merge'] },
  { name: 'INTEGRATION', ids: ['apiRequest'] },
  { name: 'UTILITY',     ids: ['note'] },
];

const SidebarNode = ({ type }) => {
  const { label, desc, color, icon: Icon } = NODE_CATALOG[type];
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
        <Icon size={15} color={color} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight" style={{ color: '#e2e8f0' }}>{label}</p>
        <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: '#4a5068' }}>{desc}</p>
      </div>
    </div>
  );
};

export const NodeSidebar = () => {
  const [query,     setQuery]     = useState('');
  const [collapsed, setCollapsed] = useState(new Set());

  const toggleCategory = (name) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const flatAll = Object.keys(NODE_CATALOG);
  const filtered = query
    ? flatAll.filter((id) => {
        const n = NODE_CATALOG[id];
        const q = query.toLowerCase();
        return n.label.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q);
      })
    : null;

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{ width: 220, background: '#111111', borderRight: '1px solid #2a2a2a' }}
    >
      {/* Search */}
      <div className="px-3 pt-3 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #1e2236' }}>
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

      {/* Node list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2236 transparent' }}
      >
        {filtered ? (
          <>
            <div className="px-4 pt-3 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4a5068' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            {filtered.length === 0 ? (
              <p className="text-xs text-center py-10 px-4" style={{ color: '#4a5068' }}>
                No nodes match &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((id) => <SidebarNode key={id} type={id} />)
            )}
          </>
        ) : (
          CATEGORIES.map((cat) => {
            const open = !collapsed.has(cat.name);
            return (
              <div key={cat.name}>
                <button
                  className="w-full flex items-center justify-between px-4 py-2 select-none"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => toggleCategory(cat.name)}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4a5068' }}>
                    {cat.name}
                  </span>
                  {open
                    ? <ChevronDown  size={12} color="#4a5068" />
                    : <ChevronRight size={12} color="#4a5068" />
                  }
                </button>
                {open && cat.ids.map((id) => <SidebarNode key={id} type={id} />)}
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 flex-shrink-0" style={{ borderTop: '1px solid #1e2236' }}>
        <p className="text-[10px]" style={{ color: '#2d3348' }}>Drag nodes onto canvas</p>
      </div>
    </aside>
  );
};

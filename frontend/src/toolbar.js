import {
  LogIn, LogOut, Brain, FileText, Filter,
  Globe, Shuffle, GitMerge, StickyNote, Workflow,
} from 'lucide-react';
import { DraggableNode } from './draggableNode';

const NODE_TYPES = [
  { type: 'customInput',  label: 'Input',     color: '#3b82f6', icon: LogIn     },
  { type: 'customOutput', label: 'Output',    color: '#10b981', icon: LogOut    },
  { type: 'llm',          label: 'LLM',       color: '#a78bfa', icon: Brain     },
  { type: 'text',         label: 'Text',      color: '#f59e0b', icon: FileText  },
  { type: 'filter',       label: 'Filter',    color: '#f43f5e', icon: Filter    },
  { type: 'apiRequest',   label: 'API',       color: '#06b6d4', icon: Globe     },
  { type: 'transform',    label: 'Transform', color: '#14b8a6', icon: Shuffle   },
  { type: 'merge',        label: 'Merge',     color: '#ec4899', icon: GitMerge  },
  { type: 'note',         label: 'Note',      color: '#eab308', icon: StickyNote},
];

export const PipelineToolbar = () => (
  <header
    className="flex items-center gap-3 px-4 flex-shrink-0"
    style={{
      height: 52,
      background: '#141620',
      borderBottom: '1px solid #1e2236',
      zIndex: 10,
    }}
  >
    {/* Brand */}
    <div className="flex items-center gap-2 select-none mr-1">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)' }}
      >
        <Workflow size={15} color="#fff" strokeWidth={2.5} />
      </div>
      <span
        className="text-sm font-bold tracking-tight"
        style={{ color: '#e2e8f0' }}
      >
        VectorShift
      </span>
    </div>

    {/* Divider */}
    <div
      className="flex-shrink-0"
      style={{ width: 1, height: 24, background: '#1e2236' }}
    />

    {/* Node chips */}
    <div className="flex items-center gap-1.5 flex-wrap">
      {NODE_TYPES.map(({ type, label, color, icon }) => (
        <DraggableNode key={type} type={type} label={label} color={color} icon={icon} />
      ))}
    </div>
  </header>
);

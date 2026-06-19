import { useState, useRef, useEffect } from 'react';
import { Workflow, Pencil, Check } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ pipelineName: s.pipelineName, setPipelineName: s.setPipelineName });

export const TopBar = () => {
  const { pipelineName, setPipelineName } = useStore(selector, shallow);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(pipelineName);
  const inputRef = useRef(null);

  // Warmup ping — fires once on mount so the backend is warm before the user submits
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/`, { method: 'GET' }).catch(() => {});
  }, []);

  const startEdit = () => {
    setDraft(pipelineName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setPipelineName(draft.trim() || 'Untitled Pipeline');
    setEditing(false);
  };

  return (
    <header
      className="flex items-center gap-3 px-4 flex-shrink-0 z-10"
      style={{ height: 52, background: '#111111', borderBottom: '1px solid #2a2a2a' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 select-none mr-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <Workflow size={15} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold" style={{ color: '#e2e8f0' }}>VectorShift</span>
      </div>

      <div style={{ width: 1, height: 20, background: '#1e2236', flexShrink: 0 }} />

      {/* Editable pipeline name */}
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') { setEditing(false); setDraft(pipelineName); }
            }}
            className="text-sm font-medium rounded px-2 py-0.5 outline-none"
            style={{
              background: '#1a1a2e', border: '1px solid #6366f1',
              color: '#e2e8f0', width: Math.max(120, draft.length * 9),
            }}
          />
          <button
            onClick={commitEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex' }}
          >
            <Check size={13} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          onClick={startEdit}
          className="flex items-center gap-1.5 group"
          style={{ background: 'none', border: 'none', cursor: 'text', padding: '2px 6px', borderRadius: 6 }}
          title="Click to rename"
        >
          <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{pipelineName}</span>
          <Pencil size={11} style={{ color: '#4a5068', opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </header>
  );
};

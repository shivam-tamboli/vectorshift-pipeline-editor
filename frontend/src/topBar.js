import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Workflow, GitBranch, Loader2, CheckCircle2, XCircle,
  Layers, ArrowRight, X, Pencil, Check,
} from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({
  nodes:           s.nodes,
  edges:           s.edges,
  pipelineName:    s.pipelineName,
  setPipelineName: s.setPipelineName,
});

export const TopBar = () => {
  const { nodes, edges, pipelineName, setPipelineName } = useStore(selector, shallow);
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(pipelineName);
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [modalOpen, setModal]   = useState(false);
  const [error,   setError]     = useState('');
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(pipelineName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setPipelineName(draft.trim() || 'Untitled Pipeline');
    setEditing(false);
  };

  const handleValidate = async () => {
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      setModal(true);
    } catch {
      setError('Backend unreachable');
    } finally {
      setLoading(false);
    }
  };

  const valid = result?.is_dag;

  return (
    <>
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

        <div className="flex-1" />

        {error && <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>}

        {/* Validate button */}
        <button
          onClick={handleValidate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg text-sm font-semibold text-white"
          style={{
            padding: '7px 18px', border: 'none',
            background: loading ? 'rgba(99,102,241,0.45)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.3)',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <GitBranch size={14} />}
          {loading ? 'Analyzing…' : 'Validate Pipeline'}
        </button>
      </header>

      {/* Result dialog */}
      <Dialog.Root open={modalOpen} onOpenChange={setModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, animation: 'overlayIn 0.15s ease' }}
          />
          <Dialog.Content
            className="fixed outline-none"
            style={{
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '100%', maxWidth: 420,
              background: '#1a1a2e', border: '1px solid #1e2236',
              borderRadius: 16, padding: 28,
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              zIndex: 1001, animation: 'contentIn 0.2s ease',
            }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: valid ? '#10b98118' : '#ef444418' }}
                >
                  {valid ? <CheckCircle2 size={22} color="#10b981" /> : <XCircle size={22} color="#ef4444" />}
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold" style={{ color: '#e2e8f0', marginBottom: 2 }}>
                    Pipeline Analysis
                  </Dialog.Title>
                  <p className="text-xs" style={{ color: valid ? '#10b981' : '#ef4444' }}>
                    {valid ? 'Valid — ready to run' : 'Invalid — loop detected'}
                  </p>
                </div>
              </div>
              <Dialog.Close
                className="flex items-center justify-center w-7 h-7 rounded-lg"
                style={{ background: 'transparent', border: '1px solid #1e2236', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#252a3e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X size={13} color="#8892a4" />
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {[
                { icon: Layers,     label: 'Nodes', value: result?.num_nodes, color: '#6366f1' },
                { icon: ArrowRight, label: 'Edges', value: result?.num_edges, color: '#8b5cf6' },
                { icon: valid ? CheckCircle2 : XCircle, label: 'Valid DAG', value: valid ? 'Yes' : 'No', color: valid ? '#10b981' : '#ef4444' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between rounded-xl px-4 py-3"
                     style={{ background: '#0f0f0f', border: '1px solid #1e2236' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                      <Icon size={16} color={color} strokeWidth={2} />
                    </div>
                    <span className="text-sm" style={{ color: '#8892a4' }}>{label}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#e2e8f0' }}>{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: '#6b7584' }}>
              {valid
                ? 'Your pipeline flows in one clean direction with no circular connections.'
                : 'Your pipeline contains a circular connection. Remove the loop to make it valid.'}
            </p>

            <Dialog.Close
              className="w-full rounded-lg text-sm font-semibold"
              style={{ padding: '9px 0', background: '#252a3e', border: '1px solid #1e2236', color: '#e2e8f0', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2d3348'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#252a3e'; }}
            >
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style>{`
        @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
        @keyframes contentIn  { from{opacity:0;transform:translate(-50%,calc(-50% + 12px))} to{opacity:1;transform:translate(-50%,-50%)} }
      `}</style>
    </>
  );
};

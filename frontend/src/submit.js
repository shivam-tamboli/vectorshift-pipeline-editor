import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, XCircle, GitBranch, Layers, ArrowRight, X, Loader2 } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="flex items-center justify-between rounded-xl px-4 py-3"
    style={{ background: '#0c0e18', border: '1px solid #1e2236' }}
  >
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      <span className="text-sm" style={{ color: '#8892a4' }}>{label}</span>
    </div>
    <span className="text-lg font-bold" style={{ color: '#e2e8f0' }}>{value}</span>
  </div>
);

export const SubmitButton = () => {
  const { nodes, edges }         = useStore(selector, shallow);
  const [loading, setLoading]    = useState(false);
  const [result, setResult]      = useState(null);
  const [modalOpen, setModal]    = useState(false);
  const [error, setError]        = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setModal(true);
    } catch {
      setError('Could not reach the backend. Make sure it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const valid = result?.is_dag;

  return (
    <>
      {/* Floating submit bar */}
      <div
        className="flex items-center justify-between px-5 flex-shrink-0"
        style={{
          height: 52,
          background: '#141620',
          borderTop: '1px solid #1e2236',
        }}
      >
        {/* Node / edge count hint */}
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#4a5068' }}>
            {nodes.length} node{nodes.length !== 1 ? 's' : ''}
          </span>
          <ArrowRight size={12} color="#1e2236" />
          <span className="text-xs" style={{ color: '#4a5068' }}>
            {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Right: error + button */}
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs" style={{ color: '#f43f5e' }}>{error}</span>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg text-sm font-semibold text-white"
            style={{
              padding: '7px 20px',
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'opacity 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <GitBranch size={14} />
                Validate Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Radix Dialog modal */}
      <Dialog.Root open={modalOpen} onOpenChange={setModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0"
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              animation: 'overlayIn 0.15s ease',
            }}
          />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 w-full outline-none"
            style={{
              maxWidth: 420,
              transform: 'translate(-50%, -50%)',
              background: '#1a1d2b',
              border: '1px solid #1e2236',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              zIndex: 1001,
              animation: 'contentIn 0.2s ease',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: valid ? '#10b98118' : '#f43f5e18' }}
                >
                  {valid
                    ? <CheckCircle2 size={22} color="#10b981" />
                    : <XCircle     size={22} color="#f43f5e" />
                  }
                </div>
                <div>
                  <Dialog.Title
                    className="text-base font-bold"
                    style={{ color: '#e2e8f0', marginBottom: 2 }}
                  >
                    Pipeline Analysis
                  </Dialog.Title>
                  <p className="text-xs" style={{ color: valid ? '#10b981' : '#f43f5e' }}>
                    {valid ? 'Valid — ready to run' : 'Invalid — loop detected'}
                  </p>
                </div>
              </div>
              <Dialog.Close
                className="flex items-center justify-center w-7 h-7 rounded-lg"
                style={{
                  background: 'transparent',
                  border: '1px solid #1e2236',
                  color: '#8892a4',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#252a3e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X size={13} />
              </Dialog.Close>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-2 mb-5">
              <StatCard icon={Layers}    label="Nodes"       value={result?.num_nodes} color="#6366f1" />
              <StatCard icon={ArrowRight} label="Edges"      value={result?.num_edges} color="#a78bfa" />
              <StatCard
                icon={valid ? CheckCircle2 : XCircle}
                label="Is Valid DAG"
                value={valid ? 'Yes' : 'No'}
                color={valid ? '#10b981' : '#f43f5e'}
              />
            </div>

            {/* Message */}
            <p
              className="text-xs leading-relaxed mb-5"
              style={{ color: '#6b7584' }}
            >
              {valid
                ? 'Your pipeline flows in one clean direction with no circular connections. It is ready to execute.'
                : 'Your pipeline contains a circular connection. Trace the path and remove the loop to make it valid.'}
            </p>

            {/* Footer */}
            <Dialog.Close
              className="w-full rounded-lg text-sm font-semibold"
              style={{
                padding: '9px 0',
                background: '#252a3e',
                border: '1px solid #1e2236',
                color: '#e2e8f0',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2d3348'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#252a3e'; }}
            >
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style>{`
        @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes contentIn { from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
};

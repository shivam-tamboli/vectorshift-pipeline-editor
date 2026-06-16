import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [modalOpen, setModal]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setModal(true);
    } catch (err) {
      setError('Could not reach the backend. Make sure it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-section">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Submit Pipeline'}
          </button>
          {error && (
            <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center' }}>{error}</p>
          )}
        </div>
      </div>

      {modalOpen && result && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__title">
              Pipeline Analysis
            </div>

            <div className="modal__stats">
              <div className="modal__stat">
                <span className="modal__stat-label">Blocks (Nodes)</span>
                <span className="modal__stat-value">{result.num_nodes}</span>
              </div>
              <div className="modal__stat">
                <span className="modal__stat-label">Connections (Edges)</span>
                <span className="modal__stat-value">{result.num_edges}</span>
              </div>
              <div className="modal__stat">
                <span className="modal__stat-label">Valid Pipeline (DAG)</span>
                <span
                  className={`modal__dag-badge ${
                    result.is_dag ? 'modal__dag-badge--valid' : 'modal__dag-badge--invalid'
                  }`}
                >
                  {result.is_dag ? 'Yes — No loops detected' : 'No — Loop detected'}
                </span>
              </div>
            </div>

            <p className="modal__message">
              {result.is_dag
                ? 'Your pipeline flows in one clean direction and is ready to run.'
                : 'Your pipeline contains a circular connection. Remove the loop to make it valid.'}
            </p>

            <div className="modal__footer">
              <button className="modal__close-btn" onClick={() => setModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

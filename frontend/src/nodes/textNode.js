import { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import BaseNode from './BaseNode';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(text)) !== null) found.add(match[1]);
  return [...found];
};

const MIN_WIDTH  = 240;
const MIN_HEIGHT = 56;

export const TextNode = ({ id, data }) => {
  const [currText,  setCurrText]  = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const [nodeWidth, setNodeWidth] = useState(MIN_WIDTH);
  const textareaRef = useRef(null);
  const measureRef  = useRef(null);

  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.max(MIN_HEIGHT, el.scrollHeight)}px`;
    }
    if (measureRef.current) {
      const longestLine = currText.split('\n').reduce((a, b) => (a.length > b.length ? a : b), '');
      measureRef.current.textContent = longestLine || ' ';
      const measured = measureRef.current.offsetWidth;
      setNodeWidth(Math.max(MIN_WIDTH, measured + 64));
    }
  }, [currText]);

  const varInputs = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode
      id={id}
      title="Text"
      color="#f59e0b"
      icon={FileText}
      inputs={varInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      minWidth={nodeWidth}
    >
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: '12px',
          fontFamily: "'Courier New', monospace",
          pointerEvents: 'none',
        }}
      />

      <div className="node-field">
        <label className="node-label">Text</label>
        <textarea
          ref={textareaRef}
          className="node-textarea"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Type text with {{variables}}"
          rows={2}
          style={{ width: '100%' }}
        />
      </div>

      {variables.length > 0 && (
        <div className="node-vars">
          {variables.map((v) => (
            <span key={v} className="node-var-badge">{`{{${v}}}`}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

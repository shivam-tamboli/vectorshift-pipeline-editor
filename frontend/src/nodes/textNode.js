import { useState, useEffect, useRef } from 'react';
import BaseNode from './BaseNode';

// Matches {{ validJsVarName }} patterns
const VAR_REGEX = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);

  // Re-parse variables whenever text changes
  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  // Auto-resize height as content grows
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [currText]);

  // Each unique variable becomes a target handle on the left
  const varInputs = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode
      id={id}
      title="Text"
      color="#d97706"
      inputs={varInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      minWidth={240}
    >
      <div className="node-field">
        <label className="node-label">Text</label>
        <textarea
          ref={textareaRef}
          className="node-textarea"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Type text with {{variables}}"
          rows={2}
        />
      </div>

      {variables.length > 0 && (
        <div className="node-vars">
          {variables.map((v) => (
            <span key={v} className="node-var-badge">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

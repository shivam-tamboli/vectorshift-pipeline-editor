import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import BaseNode from './BaseNode';

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'uppercase');

  return (
    <BaseNode
      id={id}
      title="Transform"
      color="#14b8a6"
      icon={Shuffle}
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[{ id: 'output', label: 'Output' }]}
    >
      <div className="node-field">
        <label className="node-label">Operation</label>
        <select
          className="node-select"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim Whitespace</option>
          <option value="reverse">Reverse</option>
          <option value="json_parse">Parse JSON</option>
        </select>
      </div>
    </BaseNode>
  );
};

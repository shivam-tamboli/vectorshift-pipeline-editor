import { useState } from 'react';
import BaseNode from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode
      id={id}
      title="Filter"
      color="#dc2626"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[
        { id: 'pass', label: 'Pass' },
        { id: 'fail', label: 'Fail' },
      ]}
    >
      <div className="node-field">
        <label className="node-label">Condition</label>
        <input
          className="node-input"
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. value > 10"
        />
      </div>
      <p className="node-info-text">Routes data to Pass or Fail output.</p>
    </BaseNode>
  );
};

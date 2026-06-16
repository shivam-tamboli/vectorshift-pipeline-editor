import { useState } from 'react';
import BaseNode from './BaseNode';

export const ApiNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || '');

  return (
    <BaseNode
      id={id}
      title="API Request"
      color="#0891b2"
      inputs={[{ id: 'body', label: 'Request Body' }]}
      outputs={[{ id: 'response', label: 'Response' }]}
      minWidth={240}
    >
      <div className="node-field">
        <label className="node-label">Method</label>
        <select
          className="node-select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-field">
        <label className="node-label">URL</label>
        <input
          className="node-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>
    </BaseNode>
  );
};

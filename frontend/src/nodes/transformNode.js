import { Shuffle } from 'lucide-react';
import BaseNode from './BaseNode';

const LABELS = {
  uppercase:  'Uppercase',
  lowercase:  'Lowercase',
  trim:       'Trim Whitespace',
  reverse:    'Reverse',
  json_parse: 'Parse JSON',
};

export const TransformNode = ({ id, data }) => {
  const operation = data?.operation || 'uppercase';

  return (
    <BaseNode id={id} title="Transform" color="#14b8a6" icon={Shuffle}
              inputs={[{ id: 'input', label: 'Input' }]}
              outputs={[{ id: 'output', label: 'Output' }]}>
      <span className="text-[11px]" style={{ color: '#8892a4' }}>
        {LABELS[operation] || operation}
      </span>
    </BaseNode>
  );
};

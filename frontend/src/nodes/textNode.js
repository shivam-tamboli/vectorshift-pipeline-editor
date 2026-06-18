import { FileText } from 'lucide-react';
import BaseNode from './BaseNode';
import { extractVariables } from '../lib/utils';

export const TextNode = ({ id, data }) => {
  const text      = data?.text || '{{input}}';
  const variables = extractVariables(text);
  const varInputs = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode
      id={id} title="Text" description="Template text"
      color="#f59e0b" icon={FileText}
      inputs={varInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
    />
  );
};

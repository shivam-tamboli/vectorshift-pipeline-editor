import { GitMerge } from 'lucide-react';
import BaseNode from './BaseNode';

export const MergeNode = ({ id }) => {
  return (
    <BaseNode
      id={id}
      title="Merge"
      color="#ec4899"
      icon={GitMerge}
      inputs={[
        { id: 'input1', label: 'Input 1' },
        { id: 'input2', label: 'Input 2' },
      ]}
      outputs={[{ id: 'merged', label: 'Merged Output' }]}
    >
      <p className="node-info-text">Combines two inputs into a single output.</p>
    </BaseNode>
  );
};

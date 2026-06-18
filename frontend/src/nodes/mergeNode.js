import { GitMerge } from 'lucide-react';
import BaseNode from './BaseNode';

export const MergeNode = ({ id }) => (
  <BaseNode
    id={id} title="Merge" description="Combine inputs"
    color="#ec4899" icon={GitMerge}
    inputs={[
      { id: 'input1', label: 'Input 1' },
      { id: 'input2', label: 'Input 2' },
    ]}
    outputs={[{ id: 'merged', label: 'Merged Output' }]}
  />
);

import { Filter } from 'lucide-react';
import BaseNode from './BaseNode';

export const FilterNode = ({ id }) => (
  <BaseNode
    id={id} title="Filter" description="Route data"
    color="#ef4444" icon={Filter}
    inputs={[{ id: 'input', label: 'Input' }]}
    outputs={[
      { id: 'pass', label: 'Pass' },
      { id: 'fail', label: 'Fail' },
    ]}
  />
);

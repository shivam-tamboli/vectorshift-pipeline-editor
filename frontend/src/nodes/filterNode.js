import { Filter } from 'lucide-react';
import BaseNode from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const condition = data?.condition || '';

  return (
    <BaseNode id={id} title="Filter" color="#ef4444" icon={Filter}
              inputs={[{ id: 'input', label: 'Input' }]}
              outputs={[
                { id: 'pass', label: 'Pass' },
                { id: 'fail', label: 'Fail' },
              ]}>
      {condition && (
        <p className="text-[11px] font-mono truncate" style={{ color: '#8892a4', maxWidth: 200 }}>
          {condition}
        </p>
      )}
    </BaseNode>
  );
};

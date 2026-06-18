import { LogOut } from 'lucide-react';
import BaseNode from './BaseNode';

const COLOR = '#10b981';

export const OutputNode = ({ id, data }) => {
  const name = data?.outputName || id.replace('customOutput-', 'output_');
  const type = data?.outputType || 'Text';

  return (
    <BaseNode id={id} title="Output" color={COLOR} icon={LogOut}
              inputs={[{ id: 'value', label: 'Value' }]} outputs={[]}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>{name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: `${COLOR}20`, color: COLOR }}>{type}</span>
      </div>
    </BaseNode>
  );
};

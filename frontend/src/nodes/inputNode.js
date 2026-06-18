import { LogIn } from 'lucide-react';
import BaseNode from './BaseNode';

const COLOR = '#3b82f6';

export const InputNode = ({ id, data }) => {
  const name = data?.inputName || id.replace('customInput-', 'input_');
  const type = data?.inputType || 'Text';

  return (
    <BaseNode id={id} title="Input" color={COLOR} icon={LogIn}
              inputs={[]} outputs={[{ id: 'value', label: 'Value' }]}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>{name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: `${COLOR}20`, color: COLOR }}>{type}</span>
      </div>
    </BaseNode>
  );
};

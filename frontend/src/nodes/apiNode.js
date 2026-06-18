import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';

const COLOR = '#06b6d4';

export const ApiNode = ({ id, data }) => {
  const method = data?.method || 'GET';
  const url    = data?.url    || '';

  return (
    <BaseNode id={id} title="API Request" color={COLOR} icon={Globe}
              inputs={[{ id: 'body', label: 'Request Body' }]}
              outputs={[{ id: 'response', label: 'Response' }]}
              minWidth={220}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: `${COLOR}20`, color: COLOR }}>{method}</span>
        {url && (
          <p className="text-[10px] truncate" style={{ color: '#8892a4' }}>{url}</p>
        )}
      </div>
    </BaseNode>
  );
};

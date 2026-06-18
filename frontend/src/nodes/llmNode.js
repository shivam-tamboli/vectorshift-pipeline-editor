import { Brain } from 'lucide-react';
import BaseNode from './BaseNode';

export const LLMNode = ({ id }) => (
  <BaseNode id={id} title="LLM" color="#a78bfa" icon={Brain}
            inputs={[
              { id: 'system', label: 'System Prompt' },
              { id: 'prompt', label: 'User Prompt'   },
            ]}
            outputs={[{ id: 'response', label: 'Response' }]} />
);

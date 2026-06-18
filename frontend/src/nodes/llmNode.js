import { Brain } from 'lucide-react';
import BaseNode from './BaseNode';

export const LLMNode = ({ id }) => (
  <BaseNode id={id} title="LLM" color="#8b5cf6" icon={Brain}
            inputs={[
              { id: 'system', label: 'System Prompt' },
              { id: 'prompt', label: 'User Prompt'   },
            ]}
            outputs={[{ id: 'response', label: 'Response' }]} />
);

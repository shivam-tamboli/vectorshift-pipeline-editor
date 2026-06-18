import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';

export const ApiNode = ({ id }) => (
  <BaseNode
    id={id} title="API Request" description="HTTP request"
    color="#06b6d4" icon={Globe}
    inputs={[{ id: 'body', label: 'Request Body' }]}
    outputs={[{ id: 'response', label: 'Response' }]}
  />
);

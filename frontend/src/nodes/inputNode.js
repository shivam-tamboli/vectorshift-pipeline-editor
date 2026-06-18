import { LogIn } from 'lucide-react';
import BaseNode from './BaseNode';

export const InputNode = ({ id }) => (
  <BaseNode
    id={id} title="Input" description="Entry point"
    color="#3b82f6" icon={LogIn}
    inputs={[]} outputs={[{ id: 'value', label: 'Value' }]}
  />
);

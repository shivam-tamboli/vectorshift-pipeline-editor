import { LogOut } from 'lucide-react';
import BaseNode from './BaseNode';

export const OutputNode = ({ id }) => (
  <BaseNode
    id={id} title="Output" description="Final result"
    color="#10b981" icon={LogOut}
    inputs={[{ id: 'value', label: 'Value' }]} outputs={[]}
  />
);

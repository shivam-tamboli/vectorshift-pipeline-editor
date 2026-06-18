import { Shuffle } from 'lucide-react';
import BaseNode from './BaseNode';

export const TransformNode = ({ id }) => (
  <BaseNode
    id={id} title="Transform" description="Process data"
    color="#14b8a6" icon={Shuffle}
    inputs={[{ id: 'input', label: 'Input' }]}
    outputs={[{ id: 'output', label: 'Output' }]}
  />
);

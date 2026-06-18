import { StickyNote } from 'lucide-react';
import BaseNode from './BaseNode';

export const NoteNode = ({ id }) => (
  <BaseNode
    id={id} title="Note" description="Annotation"
    color="#eab308" icon={StickyNote}
    inputs={[]} outputs={[]}
  />
);

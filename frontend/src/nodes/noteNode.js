import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import BaseNode from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');

  return (
    <BaseNode
      id={id}
      title="Note"
      color="#eab308"
      icon={StickyNote}
      inputs={[]}
      outputs={[]}
      minWidth={200}
    >
      <textarea
        className="node-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note or comment..."
        rows={3}
        style={{ width: '100%' }}
      />
    </BaseNode>
  );
};

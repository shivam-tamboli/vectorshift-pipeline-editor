import { StickyNote } from 'lucide-react';
import BaseNode from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const note = data?.note || '';

  return (
    <BaseNode id={id} title="Note" color="#eab308" icon={StickyNote}
              inputs={[]} outputs={[]} minWidth={200}>
      {note && (
        <p className="text-[11px] leading-relaxed whitespace-pre-wrap break-words"
           style={{ color: '#8892a4', maxWidth: 200 }}>
          {note.length > 100 ? note.slice(0, 100) + '…' : note}
        </p>
      )}
    </BaseNode>
  );
};

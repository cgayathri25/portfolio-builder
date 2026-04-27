import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableSection({ id, section, onUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '15px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'default'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>{section.type}</label>
        <span {...listeners} style={{ cursor: 'grab', fontSize: '20px' }}>⠿</span>
      </div>
      <textarea
        rows="3"
        value={section.content}
        onChange={(e) => onUpdate(id, e.target.value)}
        style={{ marginTop: '10px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}
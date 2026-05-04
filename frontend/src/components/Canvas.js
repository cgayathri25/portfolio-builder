import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import AboutBlock    from './blocks/AboutBlock';
import SkillsBlock   from './blocks/SkillsBlock';
import ProjectsBlock from './blocks/ProjectsBlock';
import ContactBlock  from './blocks/ContactBlock';
import BlockEditor   from './BlockEditor';

// ─── Block renderer ───────────────────────────────────────────────────────────
// Maps block.type to the correct preview component.

const BlockPreview = ({ block }) => {
  switch (block.type) {
    case 'about':    return <AboutBlock    content={block.content} theme={block.theme} />;
    case 'skills':   return <SkillsBlock   content={block.content} theme={block.theme} />;
    case 'projects': return <ProjectsBlock content={block.content} theme={block.theme} />;
    case 'contact':  return <ContactBlock  content={block.content} theme={block.theme} />;
    default:         return null;
  }
};

// ─── SortableBlock ────────────────────────────────────────────────────────────
// Wraps each block preview in a sortable container so blocks can be
// reordered by dragging the handle within the canvas.
// Clicking anywhere on the block (except the handle) opens BlockEditor.

const SortableBlock = ({ block, isSelected, onSelect, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    marginBottom: '4px',
    outline: isSelected ? '2px solid #2563eb' : '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle + block label bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 10px',
          background: isSelected ? '#eff6ff' : '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '11px',
          color: '#64748b',
          fontWeight: '500',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
        onClick={() => onSelect(block.id)}
      >
        {/* Block type label */}
        <span>{block.type} · {block.theme}</span>

        {/* Drag handle — only this element triggers the drag */}
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            fontSize: '16px',
            color: '#cbd5e1',
            padding: '0 4px',
            lineHeight: 1,
          }}
          onClick={(e) => e.stopPropagation()} // don't select when grabbing
          title="Drag to reorder"
        >
          ⠿
        </span>
      </div>

      {/* Block preview — clicking opens the editor */}
      <div onClick={() => onSelect(block.id)}>
        <BlockPreview block={block} />
      </div>
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
// Shown when the canvas has no blocks yet.

const EmptyState = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '300px',
    color: '#cbd5e1',
    gap: '12px',
    pointerEvents: 'none', // don't interfere with drop
  }}>
    <div style={{ fontSize: '36px' }}>⬚</div>
    <p style={{ margin: 0, fontSize: '14px', textAlign: 'center', maxWidth: '200px', lineHeight: '1.6' }}>
      Drag a block from the left panel to get started
    </p>
  </div>
);

// ─── Canvas ───────────────────────────────────────────────────────────────────
// The main drop zone. Accepts drops from BlockLibrary and renders
// SortableBlocks in order. Also manages which block is selected
// and shows BlockEditor in a right panel when one is.
//
// Props:
//   blocks      — array of block objects (from App state)
//   onBlocksChange — (updatedBlocks) => void
//   onRemoveBlock  — (blockId) => void

const Canvas = ({ blocks, onBlocksChange, onRemoveBlock }) => {
  const [selectedId, setSelectedId] = useState(null);

  // Make the whole canvas a droppable zone for BlockLibrary cards
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  // The block currently open in BlockEditor
  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  // Called by BlockEditor on every field change
  const handleBlockUpdate = (updatedBlock) => {
    onBlocksChange(
      blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  };

  const handleRemove = (blockId) => {
    setSelectedId(null);
    onRemoveBlock(blockId);
  };

  const handleSelect = (blockId) => {
    // Clicking the already-selected block closes the editor
    setSelectedId((prev) => (prev === blockId ? null : blockId));
  };

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* ── Drop zone ── */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          background: isOver ? '#f0f9ff' : '#f1f5f9',
          border: isOver ? '2px dashed #93c5fd' : '2px dashed transparent',
          transition: 'background 0.15s, border-color 0.15s',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        {blocks.length === 0 ? (
          <EmptyState />
        ) : (
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  isSelected={block.id === selectedId}
                  onSelect={handleSelect}
                  onUpdate={handleBlockUpdate}
                  onRemove={() => handleRemove(block.id)}
                />
              ))}
          </SortableContext>
        )}
      </div>

      {/* ── Block editor panel (slides in when a block is selected) ── */}
      {selectedBlock && (
        <BlockEditor
          block={selectedBlock}
          onUpdate={handleBlockUpdate}
          onClose={() => setSelectedId(null)}
          onRemove={() => handleRemove(selectedBlock.id)}
        />
      )}
    </div>
  );
};

export default Canvas;
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BLOCK_DEFINITIONS, THEMES } from '../config/blockConfig.js';

// ─── Theme color dot ──────────────────────────────────────────────────────────
// Small colored circle shown on each card to indicate the theme at a glance.

const ThemeDot = ({ theme }) => {
  const colors = {
    dark:    '#0f172a',
    minimal: '#e2e8f0',
    light:   '#f8fafc',
  };
  return (
    <span style={{
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: colors[theme],
      border: '1px solid #cbd5e1',
      marginRight: '6px',
      flexShrink: 0,
    }} />
  );
};

// ─── Single draggable card ────────────────────────────────────────────────────
// Each card in the library represents one block+theme combination.
// Dragging it onto the Canvas creates a new block.
//
// The drag id is formatted as "type::theme" so the Canvas knows
// what kind of block to create when it receives the drop.

const DraggableCard = ({ type, theme, label }) => {
  const dragId = `${type}::${theme}`;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { type, theme },  // Canvas reads this on drop
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        marginBottom: '6px',
        background: isDragging ? '#eff6ff' : '#ffffff',
        border: `1px solid ${isDragging ? '#93c5fd' : '#e2e8f0'}`,
        borderRadius: '8px',
        cursor: 'grab',
        fontSize: '13px',
        color: '#334155',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <ThemeDot theme={theme} />
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>
        {THEMES[theme].label}
      </span>
      <span style={{ marginLeft: '8px', color: '#cbd5e1', fontSize: '16px' }}>⠿</span>
    </div>
  );
};

// ─── Block group ──────────────────────────────────────────────────────────────
// Groups all three theme variants of one block type under a collapsible heading.

const BlockGroup = ({ definition }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Group header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: '4px 0',
          marginBottom: '6px',
          cursor: 'pointer',
          color: '#64748b',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {definition.label}
        <span style={{ fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Theme variant cards */}
      {open && Object.keys(THEMES).map((theme) => (
        <DraggableCard
          key={theme}
          type={definition.type}
          theme={theme}
          label={definition.label}
        />
      ))}
    </div>
  );
};

// ─── BlockLibrary ─────────────────────────────────────────────────────────────
// The full left panel. Renders one BlockGroup per block type.
// No drop logic here — this panel is source only.

const BlockLibrary = () => {
  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 16px',
      overflowY: 'auto',
      height: '100%',
    }}>
      <p style={{
        fontSize: '11px',
        color: '#94a3b8',
        marginBottom: '16px',
        marginTop: '0',
        lineHeight: '1.5',
      }}>
        Drag any block onto the canvas to add it to your portfolio.
      </p>

      {BLOCK_DEFINITIONS.map((definition) => (
        <BlockGroup key={definition.type} definition={definition} />
      ))}
    </aside>
  );
};

export default BlockLibrary;
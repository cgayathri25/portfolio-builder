import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import BlockLibrary from './components/BlockLibrary';
import Canvas       from './components/Canvas';
import AboutBlock    from './components/blocks/AboutBlock';
import SkillsBlock   from './components/blocks/SkillsBlock';
import ProjectsBlock from './components/blocks/ProjectsBlock';
import ContactBlock  from './components/blocks/ContactBlock';

import { createBlock } from './config/blockConfig';
import { savePortfolio } from './api';
import { downloadPortfolio } from './utils/downloadHandler';
import './styles/App.css';

// ─── Block preview router (used inside DragOverlay) ───────────────────────────

const BlockPreview = ({ block }) => {
  if (!block) return null;
  switch (block.type) {
    case 'about':    return <AboutBlock    content={block.content} theme={block.theme} />;
    case 'skills':   return <SkillsBlock   content={block.content} theme={block.theme} />;
    case 'projects': return <ProjectsBlock content={block.content} theme={block.theme} />;
    case 'contact':  return <ContactBlock  content={block.content} theme={block.theme} />;
    default:         return null;
  }
};

// ─── Live preview panel ───────────────────────────────────────────────────────
// Renders all blocks stacked in order — what the public portfolio will look like.

const LivePreview = ({ title, blocks }) => (
  <div style={{
    width: '380px',
    flexShrink: 0,
    borderLeft: '1px solid #e2e8f0',
    background: '#ffffff',
    overflowY: 'auto',
    height: '100%',
  }}>
    {/* Preview header */}
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '11px',
      fontWeight: '600',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{
        width: '8px', height: '8px',
        borderRadius: '50%',
        background: '#10b981',
        display: 'inline-block',
      }} />
      Live Preview
    </div>

    {/* Portfolio title */}
    <div style={{
      padding: '32px 36px 20px',
      borderBottom: '1px solid #f1f5f9',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#1e293b',
      }}>
        {title || 'My Portfolio'}
      </h1>
    </div>

    {/* Blocks rendered in order */}
    {blocks.length === 0 ? (
      <div style={{
        padding: '48px 36px',
        color: '#cbd5e1',
        fontSize: '14px',
        textAlign: 'center',
      }}>
        Add blocks from the left panel to see your portfolio here.
      </div>
    ) : (
      blocks
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <BlockPreview key={block.id} block={block} />
        ))
    )}
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [username, setUsername]     = useState('');
  const [title, setTitle]           = useState('My Portfolio');
  const [blocks, setBlocks]         = useState([]);
  const [isSaving, setIsSaving]     = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [savedUrl, setSavedUrl]     = useState('');

  // The block currently being dragged (used by DragOverlay)
  const [activeBlock, setActiveBlock] = useState(null);

  // ── Drag start ──────────────────────────────────────────────────────────────
  // Figures out whether the drag started from the library or the canvas,
  // and sets activeBlock so DragOverlay can show a ghost preview.

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const dragId = active.id;

    if (dragId.includes('::')) {
      // Dragging from library — id format is "type::theme"
      const [type, theme] = dragId.split('::');
      setActiveBlock(createBlock(type, theme, 'preview'));
    } else {
      // Dragging from canvas — id is a block UUID
      const block = blocks.find((b) => b.id === dragId);
      setActiveBlock(block || null);
    }
  }, [blocks]);

  // ── Drag end ────────────────────────────────────────────────────────────────
  // Two cases:
  //   A) Dropped onto canvas from library → add new block
  //   B) Reordered within canvas → update order values

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveBlock(null);

    if (!over) return; // dropped outside any droppable — do nothing

    const dragId  = active.id;
    const overId  = over.id;

    // ── Case A: drop from library onto canvas ──
    if (dragId.includes('::')) {
      const [type, theme] = dragId.split('::');
      const newBlock = createBlock(type, theme, crypto.randomUUID());

      setBlocks((prev) => {
        const newOrder = prev.length; // append at the end
        return [...prev, { ...newBlock, order: newOrder }];
      });
      return;
    }

    // ── Case B: reorder within canvas ──
    if (dragId !== overId) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === dragId);
        const newIndex = prev.findIndex((b) => b.id === overId);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        // Re-assign order values to match new positions
        return reordered.map((b, i) => ({ ...b, order: i }));
      });
    }
  }, []);

  // ── Block update (from BlockEditor) ────────────────────────────────────────
  const handleBlocksChange = useCallback((updatedBlocks) => {
    setBlocks(updatedBlocks);
  }, []);

  // ── Remove block ────────────────────────────────────────────────────────────
  const handleRemoveBlock = useCallback((blockId) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== blockId);
      // Re-assign order to close any gaps
      return filtered.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  // ── Save portfolio ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!username.trim()) return alert('Please enter a username first.');
    setIsSaving(true);
    try {
      await savePortfolio({ username: username.trim().toLowerCase(), title, blocks });
      const url = `http://localhost:8000/api/portfolios/${username.trim().toLowerCase()}`;
      setSavedUrl(url);
      alert(`Portfolio saved! View it at:\n${url}`);
    } catch (err) {
      alert('Error saving portfolio. Is the server running?');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Download HTML ───────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (blocks.length === 0) return alert('Add at least one block before downloading.');
    downloadPortfolio({ username, title, blocks });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      background: '#f8fafc',
    }}>

      {/* ── Top header bar ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '52px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
        gap: '16px',
      }}>
        {/* Logo */}
        <span style={{ fontWeight: '700', fontSize: '15px', color: '#2563eb', whiteSpace: 'nowrap' }}>
          Portfolio Builder
        </span>

        {/* Username + title inputs */}
        <div style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '480px' }}>
          <input
            type="text"
            placeholder="Username (for public URL)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Portfolio title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setShowPreview((p) => !p)}
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: showPreview ? '#eff6ff' : '#ffffff',
              color: showPreview ? '#2563eb' : '#64748b',
              cursor: 'pointer',
            }}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>

          <button
            onClick={handleDownload}
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            Download HTML
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '6px',
              background: isSaving ? '#93c5fd' : '#2563eb',
              color: '#ffffff',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontWeight: '500',
            }}
          >
            {isSaving ? 'Saving...' : 'Publish Live'}
          </button>
        </div>
      </header>

      {/* ── Saved URL bar ── */}
      {savedUrl && (
        <div style={{
          padding: '8px 20px',
          background: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0',
          fontSize: '13px',
          color: '#15803d',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}>
          <span>Live at:</span>
          <a href={savedUrl} target="_blank" rel="noreferrer" style={{ color: '#15803d' }}>
            {savedUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(savedUrl)}
            style={{
              background: 'none',
              border: '1px solid #86efac',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              color: '#15803d',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
      )}

      {/* ── Main editor area ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Left: block library */}
          <BlockLibrary />

          {/* Center: canvas */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            <Canvas
              blocks={blocks}
              onBlocksChange={handleBlocksChange}
              onRemoveBlock={handleRemoveBlock}
            />
          </div>

          {/* Drag ghost overlay — shown while dragging */}
          <DragOverlay>
            {activeBlock && (
              <div style={{ opacity: 0.85, pointerEvents: 'none', width: '320px' }}>
                <BlockPreview block={activeBlock} />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Right: live preview (outside DndContext so it's not a drop target) */}
        {showPreview && (
          <LivePreview title={title} blocks={blocks} />
        )}
      </div>
    </div>
  );
}

export default App; 
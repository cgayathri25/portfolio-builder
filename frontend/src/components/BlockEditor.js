import React from 'react';
import { getBlockDefinition, THEMES } from '../config/blockConfig.js';

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#334155',
  background: '#ffffff',
  marginTop: '4px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '4px',
  marginTop: '14px',
};

// ─── Individual input renderers ───────────────────────────────────────────────
// One renderer per inputType defined in blockConfig.js

const TextInput = ({ value, onChange }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    style={inputStyle}
  />
);

const TextareaInput = ({ value, onChange }) => (
  <textarea
    rows={4}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
  />
);

const ToggleInput = ({ value, onChange }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
    cursor: 'pointer',
  }}>
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        background: value ? '#2563eb' : '#cbd5e1',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: value ? '19px' : '3px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: '#ffffff',
        transition: 'left 0.2s',
      }} />
    </div>
    <span style={{ fontSize: '13px', color: '#475569' }}>
      {value ? 'Enabled' : 'Disabled'}
    </span>
  </label>
);

const ListInput = ({ value, onChange }) => {
  const [inputVal, setInputVal] = React.useState('');
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputVal('');
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      {/* Existing skills as removable tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {items.map((item, i) => (
          <span key={i} style={{
            padding: '3px 10px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {item}
            <button
              onClick={() => removeItem(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', fontSize: '14px', lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input + Add button */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          value={inputVal}
          placeholder="Type a skill..."
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ ...inputStyle, marginTop: 0, flex: 1 }}
        />
        <button
          onClick={addItem}
          style={{
            padding: '8px 12px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

// Projects input — array of { name, description, link }
const ProjectsInput = ({ value, onChange }) => {
  const projects = Array.isArray(value) ? value : [];

  const updateProject = (index, field, newValue) => {
    const updated = projects.map((p, i) =>
      i === index ? { ...p, [field]: newValue } : p
    );
    onChange(updated);
  };

  const addProject = () => {
    onChange([...projects, { name: '', description: '', link: '' }]);
  };

  const removeProject = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div>
      {projects.map((project, i) => (
        <div
          key={i}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
          }}
        >
          {/* Project number + remove button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>
              Project {i + 1}
            </span>
            <button
              onClick={() => removeProject(i)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 6px',
              }}
            >
              Remove
            </button>
          </div>

          <input
            type="text"
            placeholder="Project name"
            value={project.name || ''}
            onChange={(e) => updateProject(i, 'name', e.target.value)}
            style={{ ...inputStyle, marginTop: 0, marginBottom: '6px' }}
          />
          <textarea
            rows={2}
            placeholder="Short description..."
            value={project.description || ''}
            onChange={(e) => updateProject(i, 'description', e.target.value)}
            style={{ ...inputStyle, marginTop: 0, marginBottom: '6px', resize: 'vertical' }}
          />
          <input
            type="text"
            placeholder="https://github.com/..."
            value={project.link || ''}
            onChange={(e) => updateProject(i, 'link', e.target.value)}
            style={{ ...inputStyle, marginTop: 0 }}
          />
        </div>
      ))}

      <button
        onClick={addProject}
        style={{
          width: '100%',
          padding: '8px',
          background: 'none',
          border: '1px dashed #cbd5e1',
          borderRadius: '6px',
          color: '#64748b',
          fontSize: '13px',
          cursor: 'pointer',
          marginTop: '4px',
        }}
      >
        + Add Project
      </button>
    </div>
  );
};

// ─── Input router ─────────────────────────────────────────────────────────────
// Picks the right input component based on the element's inputType

const renderInput = (element, value, onChange) => {
  switch (element.inputType) {
    case 'text':     return <TextInput     value={value} onChange={onChange} />;
    case 'textarea': return <TextareaInput value={value} onChange={onChange} />;
    case 'toggle':   return <ToggleInput   value={value} onChange={onChange} />;
    case 'list':     return <ListInput     value={value} onChange={onChange} />;
    case 'projects': return <ProjectsInput value={value} onChange={onChange} />;
    default:         return null;
  }
};

// ─── BlockEditor ──────────────────────────────────────────────────────────────
// Renders as a slide-in panel on the right side of the canvas.
// Shows when the user clicks a block card on the canvas.
//
// Props:
//   block       — the full block object being edited
//   onUpdate    — (updatedBlock) => void  called on every field change
//   onClose     — () => void  closes the editor
//   onRemove    — () => void  removes the block from the canvas

const BlockEditor = ({ block, onUpdate, onClose, onRemove }) => {
  if (!block) return null;

  const definition = getBlockDefinition(block.type);
  if (!definition) return null;

  // Update a single content field
  const handleContentChange = (key, value) => {
    onUpdate({
      ...block,
      content: { ...block.content, [key]: value },
    });
  };

  // Update the theme of this block
  const handleThemeChange = (newTheme) => {
    onUpdate({ ...block, theme: newTheme });
  };

  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      background: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      padding: '20px 18px',
      overflowY: 'auto',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
          Edit · {definition.label}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#94a3b8',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Theme picker */}
      <div>
        <span style={labelStyle}>Block theme</span>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              style={{
                flex: 1,
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: '500',
                border: block.theme === key
                  ? '2px solid #2563eb'
                  : '1px solid #e2e8f0',
                borderRadius: '6px',
                background: block.theme === key ? '#eff6ff' : '#f8fafc',
                color: block.theme === key ? '#2563eb' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '18px 0' }} />

      {/* Content fields — driven by blockConfig elements array */}
      {definition.elements.map((element) => (
        <div key={element.key}>
          <span style={labelStyle}>{element.label}</span>
          {renderInput(
            element,
            block.content[element.key],
            (value) => handleContentChange(element.key, value)
          )}
        </div>
      ))}

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />

      {/* Remove block button */}
      <button
        onClick={onRemove}
        style={{
          width: '100%',
          padding: '9px',
          background: 'none',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#ef4444',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        Remove block
      </button>
    </div>
  );
};

export default BlockEditor;
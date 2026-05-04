import React from 'react';
import { THEMES } from '../../config/blockConfig';


// ─── SkillsBlock ──────────────────────────────────────────────────────────────

const SkillsBlock = ({ content, theme }) => {
  const { background, color, accentColor, borderColor } = THEMES[theme].styles;

  // items is stored as an array of strings e.g. ['React', 'Node.js']
  const skills = Array.isArray(content.items) ? content.items : [];

  return (
    <div style={{
      background,
      color,
      padding: '40px 36px',
      borderBottom: `1px solid ${borderColor}`,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Heading */}
      {content.heading && (
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          margin: '0 0 4px 0',
          color: accentColor,
          borderLeft: `4px solid ${accentColor}`,
          paddingLeft: '14px',
        }}>
          {content.heading}
        </h2>
      )}

      {/* Subheading */}
      {content.subheading && (
        <p style={{
          fontSize: '0.95rem',
          margin: '0 0 20px 18px',
          opacity: 0.6,
          letterSpacing: '0.03em',
        }}>
          {content.subheading}
        </p>
      )}

      {/* Skill tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        {skills.map((skill, i) => (
          <span
            key={i}
            style={{
              padding: '6px 16px',
              border: `1px solid ${accentColor}`,
              borderRadius: '20px',
              fontSize: '0.875rem',
              color: accentColor,
              letterSpacing: '0.02em',
            }}
          >
            {skill}
          </span>
        ))}

        {skills.length === 0 && (
          <p style={{ opacity: 0.4, fontSize: '0.875rem', margin: 0 }}>
            No skills added yet.
          </p>
        )}
      </div>

      
    </div>
  );
};

export default SkillsBlock;
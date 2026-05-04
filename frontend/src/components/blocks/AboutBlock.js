import React from 'react';
import { THEMES } from '../../config/blockConfig';


// ─── AboutBlock ───────────────────────────────────────────────────────────────

const AboutBlock = ({ content, theme }) => {
  const { background, color, accentColor, borderColor } = THEMES[theme].styles;

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
          margin: '0 0 16px 18px',
          opacity: 0.6,
          letterSpacing: '0.03em',
        }}>
          {content.subheading}
        </p>
      )}

      {/* Bio paragraph */}
      {content.bio && (
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.8',
          margin: '0',
          opacity: 0.9,
        }}>
          {content.bio}
        </p>
      )}

      
    </div>
  );
};

export default AboutBlock;
import React from 'react';
import { THEMES } from '../../config/blockConfig';



// ─── ContactBlock ─────────────────────────────────────────────────────────────

const ContactBlock = ({ content, theme }) => {
  const { background, color, accentColor, borderColor } = THEMES[theme].styles;

  // Build a list of contact links to render, skipping empty ones
  const links = [
    { label: 'Email',    value: content.email,    href: `mailto:${content.email}` },
    { label: 'GitHub',   value: content.github,   href: content.github },
    { label: 'LinkedIn', value: content.linkedin, href: content.linkedin },
  ].filter((l) => l.value && l.value.trim() !== '');

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
          margin: '0 0 24px 18px',
          opacity: 0.6,
          letterSpacing: '0.03em',
        }}>
          {content.subheading}
        </p>
      )}

      {/* Contact links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.map((link, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              minWidth: '64px',
            }}>
              {link.label}
            </span>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{
                color,
                fontSize: '0.9rem',
                opacity: 0.85,
                textDecoration: 'none',
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {link.value}
            </a>
          </div>
        ))}

        {links.length === 0 && (
          <p style={{ opacity: 0.4, fontSize: '0.875rem', margin: 0 }}>
            No contact details added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactBlock;
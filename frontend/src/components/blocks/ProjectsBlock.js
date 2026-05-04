import React from 'react';
import { THEMES } from '../../config/blockConfig';

// ─── ProjectsBlock ────────────────────────────────────────────────────────────

const ProjectsBlock = ({ content, theme }) => {
  const { background, color, accentColor, borderColor } = THEMES[theme].styles;

  // items is an array of { name, description, link }
  const projects = Array.isArray(content.items) ? content.items : [];

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

      {/* Project cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map((project, i) => (
          <div
            key={i}
            style={{
              padding: '18px 20px',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: accentColor,
              }}>
                {project.name || 'Untitled Project'}
              </h3>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '11px',
                    color: accentColor,
                    textDecoration: 'none',
                    border: `1px solid ${accentColor}`,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  View →
                </a>
              )}
            </div>

            {project.description && (
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: '1.7',
                opacity: 0.8,
              }}>
                {project.description}
              </p>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <p style={{ opacity: 0.4, fontSize: '0.875rem', margin: 0 }}>
            No projects added yet.
          </p>
        )}
      </div>

      
    </div>
  );
};

export default ProjectsBlock;
// downloadHandler.js
// Generates a fully self-contained HTML file from the current portfolio state.
// Mirrors the visual output of template.ejs exactly — same CSS classes, same structure.
// No external dependencies except the Google Fonts import.

// ─── Per-theme color maps ─────────────────────────────────────────────────────
// Must stay in sync with the theme classes in template.ejs.

const THEME_COLORS = {
  dark: {
    background:   '#0f172a',
    color:        '#f8fafc',
    accentColor:  '#38bdf8',
    borderColor:  '#1e293b',
  },
  minimal: {
    background:   '#ffffff',
    color:        '#1e293b',
    accentColor:  '#000000',
    borderColor:  '#e2e8f0',
  },
  light: {
    background:   '#f8fafc',
    color:        '#334155',
    accentColor:  '#2563eb',
    borderColor:  '#e2e8f0',
  },
};

// ─── Block renderers ──────────────────────────────────────────────────────────
// One function per block type. Each returns an HTML string snippet.
// Receives the block's content object and resolved theme colors.

const renderAbout = (content, colors) => `
  ${content.bio ? `<p class="block-bio">${content.bio}</p>` : ''}
`;

const renderSkills = (content, colors) => {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return '';
  return `
    <div class="skills-list">
      ${items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
    </div>
  `;
};

const renderProjects = (content, colors) => {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return '';
  return `
    <div class="projects-list">
      ${items.map(project => `
        <div class="project-card">
          <div class="project-card-header">
            <span class="project-name">${project.name || ''}</span>
            ${project.link ? `
              <a href="${project.link}" class="project-link" target="_blank" rel="noreferrer">
                View →
              </a>` : ''}
          </div>
          ${project.description ? `<p class="project-desc">${project.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
};

const renderContact = (content, colors) => {
  const rows = [
    { label: 'Email',    value: content.email,    href: `mailto:${content.email}` },
    { label: 'GitHub',   value: content.github,   href: content.github },
    { label: 'LinkedIn', value: content.linkedin, href: content.linkedin },
  ].filter(r => r.value && r.value.trim() !== '');

  if (rows.length === 0) return '';

  return `
    <div class="contact-list">
      ${rows.map(row => `
        <div class="contact-row">
          <span class="contact-label">${row.label}</span>
          <a href="${row.href}" class="contact-link" target="_blank" rel="noreferrer">
            ${row.value}
          </a>
        </div>
      `).join('')}
    </div>
  `;
};

// ─── Block type router ────────────────────────────────────────────────────────

const renderBlockContent = (block, colors) => {
  switch (block.type) {
    case 'about':    return renderAbout(block.content, colors);
    case 'skills':   return renderSkills(block.content, colors);
    case 'projects': return renderProjects(block.content, colors);
    case 'contact':  return renderContact(block.content, colors);
    default:         return '';
  }
};

// ─── Full block HTML ──────────────────────────────────────────────────────────

const renderBlock = (block) => {
  const colors = THEME_COLORS[block.theme] || THEME_COLORS.light;
  const content = block.content || {};

  return `
  <div class="block theme-${block.theme}" id="block-${block.id}">

    ${content.heading ? `<h2 class="block-heading">${content.heading}</h2>` : ''}
    ${content.subheading ? `<p class="block-subheading">${content.subheading}</p>` : ''}

    ${renderBlockContent(block, colors)}

    ${content.showDarkModeToggle ? `
      <button class="theme-toggle" onclick="toggleTheme(this, '${block.id}')">
        Toggle Dark / Light
      </button>` : ''}

  </div>`;
};

// ─── Full HTML document ───────────────────────────────────────────────────────

const buildHTML = (portfolio) => {
  const { title, username, blocks = [] } = portfolio;
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const firstTheme = sorted.length > 0 ? sorted[0].theme : 'light';
  const pageBackground = THEME_COLORS[firstTheme]?.background || '#f8fafc';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title || 'My Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <style>
    /* stylelint-disable */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      background: ${pageBackground};
    }

    .portfolio-title {
      padding: 48px 36px 32px;
      font-size: 2rem;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
    }

    /* ── Block shared layout ── */
    .block { padding: 40px 36px; border-bottom-width: 1px; border-bottom-style: solid; }
    .block-heading { font-size: 1.6rem; font-weight: 700; border-left-width: 4px; border-left-style: solid; padding-left: 14px; margin-bottom: 4px; }
    .block-subheading { font-size: 0.95rem; margin-left: 18px; margin-bottom: 20px; opacity: 0.6; letter-spacing: 0.03em; }
    .block-bio { font-size: 1rem; line-height: 1.8; opacity: 0.9; }

    .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
    .skill-tag { padding: 6px 16px; border-width: 1px; border-style: solid; border-radius: 20px; font-size: 0.875rem; letter-spacing: 0.02em; }

    .projects-list { display: flex; flex-direction: column; gap: 16px; margin-top: 4px; }
    .project-card { padding: 18px 20px; border-width: 1px; border-style: solid; border-radius: 8px; }
    .project-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
    .project-name { font-size: 1rem; font-weight: 600; }
    .project-link { font-size: 11px; padding: 3px 10px; border-width: 1px; border-style: solid; border-radius: 4px; text-decoration: none; white-space: nowrap; flex-shrink: 0; }
    .project-desc { font-size: 0.9rem; line-height: 1.7; opacity: 0.8; }

    .contact-list { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
    .contact-row { display: flex; align-items: center; gap: 12px; }
    .contact-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; min-width: 64px; }
    .contact-link { font-size: 0.9rem; opacity: 0.85; text-decoration: none; }

    .theme-toggle { margin-top: 16px; padding: 8px 18px; background: transparent; border-width: 1px; border-style: solid; border-radius: 6px; font-size: 12px; cursor: pointer; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; }

    /* ── Theme color classes ── */
    .theme-dark { background: #0f172a; color: #f8fafc; border-bottom-color: #1e293b; }
    .theme-dark .block-heading  { color: #38bdf8; border-left-color: #38bdf8; }
    .theme-dark .skill-tag      { border-color: #38bdf8; color: #38bdf8; }
    .theme-dark .project-card   { border-color: #1e293b; }
    .theme-dark .project-name   { color: #38bdf8; }
    .theme-dark .project-link   { border-color: #38bdf8; color: #38bdf8; }
    .theme-dark .contact-label  { color: #38bdf8; }
    .theme-dark .contact-link   { color: #f8fafc; border-bottom-color: #1e293b; }
    .theme-dark .theme-toggle   { border-color: #38bdf8; color: #38bdf8; }

    .theme-minimal { background: #ffffff; color: #1e293b; border-bottom-color: #e2e8f0; }
    .theme-minimal .block-heading  { color: #000000; border-left-color: #000000; }
    .theme-minimal .skill-tag      { border-color: #000000; color: #000000; }
    .theme-minimal .project-card   { border-color: #e2e8f0; }
    .theme-minimal .project-name   { color: #000000; }
    .theme-minimal .project-link   { border-color: #000000; color: #000000; }
    .theme-minimal .contact-label  { color: #000000; }
    .theme-minimal .contact-link   { color: #1e293b; border-bottom-color: #e2e8f0; }
    .theme-minimal .theme-toggle   { border-color: #000000; color: #000000; }

    .theme-light { background: #f8fafc; color: #334155; border-bottom-color: #e2e8f0; }
    .theme-light .block-heading  { color: #2563eb; border-left-color: #2563eb; }
    .theme-light .skill-tag      { border-color: #2563eb; color: #2563eb; }
    .theme-light .project-card   { border-color: #e2e8f0; }
    .theme-light .project-name   { color: #2563eb; }
    .theme-light .project-link   { border-color: #2563eb; color: #2563eb; }
    .theme-light .contact-label  { color: #2563eb; }
    .theme-light .contact-link   { color: #334155; border-bottom-color: #e2e8f0; }
    .theme-light .theme-toggle   { border-color: #2563eb; color: #2563eb; }
  </style>
</head>
<body>

  <div class="portfolio-title theme-${firstTheme}">
    ${title || 'My Portfolio'}
  </div>

  ${sorted.map(renderBlock).join('\n')}

  <script>
    function toggleTheme(btn, blockId) {
      var block = document.getElementById('block-' + blockId);
      if (!block) return;
      if (block.classList.contains('theme-dark')) {
        block.classList.replace('theme-dark', 'theme-light');
      } else if (block.classList.contains('theme-light')) {
        block.classList.replace('theme-light', 'theme-minimal');
      } else {
        block.classList.replace('theme-minimal', 'theme-dark');
      }
    }
  </script>

</body>
</html>`;
};

// ─── Main export ──────────────────────────────────────────────────────────────
// Called from App.js when user clicks "Download HTML".

export const downloadPortfolio = (portfolio) => {
  if (!portfolio.blocks || portfolio.blocks.length === 0) {
    alert('Add at least one block before downloading.');
    return;
  }

  const html     = buildHTML(portfolio);
  const blob     = new Blob([html], { type: 'text/html' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = `${portfolio.username || 'my'}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
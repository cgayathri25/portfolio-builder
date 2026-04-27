export const downloadPortfolio = (portfolio) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: ${portfolio.theme === 'modern-dark' ? '#0f172a' : portfolio.theme === 'royal-blue' ? '#1e1b4b' : '#ffffff'};
            --text: ${portfolio.theme === 'modern-dark' ? '#f8fafc' : portfolio.theme === 'royal-blue' ? '#e0e7ff' : '#1e293b'};
            --primary: ${portfolio.theme === 'modern-dark' ? '#38bdf8' : portfolio.theme === 'royal-blue' ? '#fbbf24' : '#2563eb'};
        }
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: var(--bg); 
            color: var(--text); 
            margin: 0; 
            padding: 0; 
            line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 80px 20px; }
        header { text-align: center; margin-bottom: 60px; }
        h1 { font-size: 3rem; margin: 0; color: var(--primary); }
        section { margin-bottom: 40px; }
        h2 { 
            font-size: 1.1rem; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
            border-left: 4px solid var(--primary); 
            padding-left: 15px; 
            margin-bottom: 15px;
        }
        p { opacity: 0.9; font-size: 1.1rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${portfolio.title}</h1>
            <p>Portfolio curated via PortfolioBuilder Pro</p>
        </header>
        ${portfolio.sections.map(s => `
            <section>
                <h2>${s.type}</h2>
                <p>${s.content}</p>
            </section>
        `).join('')}
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${portfolio.username || 'my'}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
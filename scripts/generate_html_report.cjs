const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'SIH_Project_Report_AARAMBHA.md');
const htmlPath = path.join(__dirname, '..', 'SIH_Project_Report_AARAMBHA.html');

if (!fs.existsSync(mdPath)) {
  console.error('Markdown report not found!');
  process.exit(1);
}

const md = fs.readFileSync(mdPath, 'utf8');

// Basic Markdown to HTML converter
let htmlContent = md
  // Escape HTML entities
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  // Unescape back for special tags if needed
  // Headers
  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  // Blockquotes
  .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
  // Images
  .replace(/!\[(.*?)\]\((.*?)\)/gim, (match, alt, src) => {
    return `<figure><img src="${src}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure>`;
  })
  // Links
  .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
  // Bold & Italic
  .replace(/\*\*\*(.*?)\*\*\*/gim, '<b><i>$1</i></b>')
  .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
  .replace(/\*(.*?)\*/gim, '<i>$1</i>')
  // Code blocks
  .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
  // Inline code
  .replace(/`([^`]+)`/gim, '<code>$1</code>')
  // Horizontal rules
  .replace(/^---$/gim, '<hr/>');

// Table conversion
const lines = htmlContent.split('\n');
let inTable = false;
let tableHtml = [];
let processedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('|') && line.endsWith('|')) {
    if (!inTable) {
      inTable = true;
      processedLines.push('<div class="table-container"><table>');
    }
    const cells = line.split('|').slice(1, -1);
    if (cells.every(c => c.trim().match(/^[:\-\s]+$/))) {
      // separator row
      continue;
    }
    const isHeader = !tableHtml.length;
    const tag = isHeader ? 'th' : 'td';
    const rowHtml = '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    processedLines.push(rowHtml);
    tableHtml.push(rowHtml);
  } else {
    if (inTable) {
      inTable = false;
      processedLines.push('</table></div>');
      tableHtml = [];
    }
    processedLines.push(lines[i]);
  }
}
if (inTable) {
  processedLines.push('</table></div>');
}

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AARAMBHA — SIH Technical Project Report (PS ID: 26102)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --bg: #0f172a;
      --surface: #1e293b;
      --surface-border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --danger: #ef4444;
      --success: #10b981;
    }
    @media print {
      @page {
        margin: 15mm 15mm 15mm 15mm;
        size: A4;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        font-size: 10.5pt !important;
        line-height: 1.6 !important;
        padding: 0 !important;
      }
      .container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      h1 {
        color: #0369a1 !important;
        border-bottom: 2.5px solid #0284c7 !important;
        page-break-after: avoid !important;
        font-size: 1.85rem !important;
        margin-top: 20px !important;
      }
      h2 {
        color: #0f172a !important;
        border-bottom: 1.5px solid #cbd5e1 !important;
        page-break-after: avoid !important;
        font-size: 1.35rem !important;
        margin-top: 30px !important;
      }
      h3 {
        color: #1e293b !important;
        page-break-after: avoid !important;
        font-size: 1.15rem !important;
        margin-top: 20px !important;
      }
      p, li {
        color: #334155 !important;
      }
      .no-print { display: none !important; }
      pre, blockquote, figure, tr { page-break-inside: avoid !important; }
      figure {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        padding: 12px !important;
        margin: 20px 0 !important;
        page-break-inside: avoid !important;
      }
      figure img {
        box-shadow: none !important;
        max-height: 480px !important;
        object-fit: contain !important;
        border: 1px solid #cbd5e1 !important;
      }
      figcaption {
        color: #475569 !important;
        font-weight: 600 !important;
        margin-top: 8px !important;
      }
      blockquote {
        background: #f0f9ff !important;
        border-left: 4px solid #0284c7 !important;
        color: #0c4a6e !important;
      }
      pre {
        background: #f8fafc !important;
        color: #0f172a !important;
        border: 1px solid #cbd5e1 !important;
        font-size: 9pt !important;
      }
      code {
        background: #f1f5f9 !important;
        color: #0369a1 !important;
      }
      a { color: #0284c7 !important; text-decoration: none !important; }
      .table-container {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        background: #ffffff !important;
        margin: 16px 0 !important;
      }
      table {
        background: #ffffff !important;
      }
      th {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
        font-weight: 700 !important;
        border: 1px solid #cbd5e1 !important;
      }
      td {
        border: 1px solid #e2e8f0 !important;
        color: #334155 !important;
      }
      tr:nth-child(even) td {
        background-color: #f8fafc !important;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.7;
      font-size: 15px;
      padding: 40px 20px;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      background: #111827;
      padding: 60px 50px;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid #1f2937;
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #38bdf8;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 16px;
      margin: 30px 0 20px;
      letter-spacing: -0.025em;
    }
    h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #7dd3fc;
      border-bottom: 1px solid #374151;
      padding-bottom: 10px;
      margin: 40px 0 16px;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #bae6fd;
      margin: 24px 0 12px;
    }
    p { margin-bottom: 16px; color: #cbd5e1; }
    hr {
      border: 0;
      height: 1px;
      background: #374151;
      margin: 35px 0;
    }
    blockquote {
      border-left: 4px solid #38bdf8;
      background: rgba(56, 189, 248, 0.08);
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
      font-style: italic;
      color: #e2e8f0;
    }
    pre {
      background: #090d16;
      padding: 20px;
      border-radius: 10px;
      overflow-x: auto;
      margin: 20px 0;
      border: 1px solid #1e293b;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      line-height: 1.5;
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(56, 189, 248, 0.15);
      color: #7dd3fc;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    .table-container {
      overflow-x: auto;
      margin: 24px 0;
      border-radius: 8px;
      border: 1px solid #374151;
      background: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    th {
      background: #1e293b;
      color: #38bdf8;
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid #374151;
      white-space: nowrap;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #1f2937;
      color: #cbd5e1;
    }
    tr:hover td { background: rgba(56, 189, 248, 0.03); }
    figure {
      margin: 30px 0;
      text-align: center;
      background: #0f172a;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #334155;
    }
    figure img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    figcaption {
      margin-top: 12px;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }
    ul, ol {
      margin: 16px 0 20px 24px;
      color: #cbd5e1;
    }
    li { margin-bottom: 8px; }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #0284c7;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .print-btn:hover { background: #0369a1; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">
    🖨️ Print / Save as PDF
  </button>
  <div class="container">
    ${processedLines.join('\n')}
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, finalHtml, 'utf8');
console.log('Successfully generated HTML report at: ' + htmlPath);

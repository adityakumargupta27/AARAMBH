const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating Professional SIH Report with Zero Empty Pages & Crisp Alignments...');

const mdPath = path.join(__dirname, '..', 'SIH_Project_Report_AARAMBHA.md');
const htmlPath = path.join(__dirname, '..', 'SIH_Project_Report_AARAMBHA.html');
const pdfPath = path.join(__dirname, '..', 'SIH_Project_Report_AARAMBHA.pdf');

if (!fs.existsSync(mdPath)) {
  console.error('Markdown file not found:', mdPath);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, 'utf8');

// Parse markdown into clean semantic HTML
const lines = md.split('\n');

let htmlBody = '';
let inTable = false;
let tableRows = [];
let inCodeBlock = false;
let codeLang = '';
let codeLines = [];
let inList = false;
let listType = ''; // 'ul' or 'ol'

function closeListIfOpen() {
  if (inList) {
    htmlBody += `</${listType}>\n`;
    inList = false;
    listType = '';
  }
}

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Code blocks
  if (line.trim().startsWith('```')) {
    closeListIfOpen();
    if (inCodeBlock) {
      inCodeBlock = false;
      const codeEscaped = codeLines.join('\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      htmlBody += `<pre class="code-block language-${codeLang}"><code>${codeEscaped}</code></pre>\n`;
      codeLines = [];
    } else {
      inCodeBlock = true;
      codeLang = line.trim().replace(/^```/, '');
      codeLines = [];
    }
    continue;
  }

  if (inCodeBlock) {
    codeLines.push(line);
    continue;
  }

  // Table handling
  if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
    closeListIfOpen();
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    const cells = line.split('|').slice(1, -1);
    if (cells.every(c => c.trim().match(/^[:\-\s]+$/))) {
      // separator row
      continue;
    }
    const isHeader = tableRows.length === 0;
    const tag = isHeader ? 'th' : 'td';
    const rowHtml = '<tr>' + cells.map(c => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('') + '</tr>';
    tableRows.push(rowHtml);
    continue;
  } else {
    if (inTable) {
      inTable = false;
      htmlBody += `<div class="table-container"><table>${tableRows.join('\n')}</table></div>\n`;
      tableRows = [];
    }
  }

  const trimmed = line.trim();

  // Empty lines
  if (!trimmed) {
    closeListIfOpen();
    continue;
  }

  // Horizontal Rule
  if (trimmed === '---') {
    closeListIfOpen();
    htmlBody += '<hr class="section-divider" />\n';
    continue;
  }

  // Headings
  if (trimmed.startsWith('# ')) {
    closeListIfOpen();
    const text = trimmed.substring(2);
    htmlBody += `<h1 class="main-title">${inlineFormat(text)}</h1>\n`;
    continue;
  }

  if (trimmed.startsWith('## ')) {
    closeListIfOpen();
    const text = trimmed.substring(3);
    const matchSec = text.match(/^(\d+)\.\s*(.*)/);
    if (matchSec) {
      const secNum = matchSec[1];
      htmlBody += `<h2 id="section-${secNum}" class="section-heading chapter-heading">${inlineFormat(text)}</h2>\n`;
    } else if (text.includes('TABLE OF CONTENTS')) {
      htmlBody += `<h2 class="section-heading toc-heading">${inlineFormat(text)}</h2>\n`;
    } else {
      htmlBody += `<h2 class="section-heading">${inlineFormat(text)}</h2>\n`;
    }
    continue;
  }

  if (trimmed.startsWith('### ')) {
    closeListIfOpen();
    const text = trimmed.substring(4);
    htmlBody += `<h3 class="subsection-heading">${inlineFormat(text)}</h3>\n`;
    continue;
  }

  if (trimmed.startsWith('#### ')) {
    closeListIfOpen();
    const text = trimmed.substring(5);
    htmlBody += `<h4 class="sub-subsection-heading">${inlineFormat(text)}</h4>\n`;
    continue;
  }

  // Blockquotes
  if (trimmed.startsWith('> ')) {
    closeListIfOpen();
    const text = trimmed.substring(2);
    htmlBody += `<blockquote class="callout-card">${inlineFormat(text)}</blockquote>\n`;
    continue;
  }

  // Images
  const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (imgMatch) {
    closeListIfOpen();
    const alt = imgMatch[1];
    const src = imgMatch[2];
    htmlBody += `
      <figure class="figure-container">
        <img src="${src}" alt="${alt}" loading="lazy" />
        <figcaption class="figure-caption"><strong>${inlineFormat(alt)}</strong></figcaption>
      </figure>\n`;
    continue;
  }

  // Bullet Lists
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    if (!inList || listType !== 'ul') {
      closeListIfOpen();
      htmlBody += `<ul class="content-list">\n`;
      inList = true;
      listType = 'ul';
    }
    const text = trimmed.substring(2);
    htmlBody += `  <li>${inlineFormat(text)}</li>\n`;
    continue;
  }

  // Numbered Lists
  const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
  if (numMatch) {
    if (!inList || listType !== 'ol') {
      closeListIfOpen();
      htmlBody += `<ol class="content-list numbered">\n`;
      inList = true;
      listType = 'ol';
    }
    const num = numMatch[1];
    const text = numMatch[2];
    htmlBody += `  <li value="${num}">${inlineFormat(text)}</li>\n`;
    continue;
  }

  // Regular Paragraph
  closeListIfOpen();
  htmlBody += `<p class="body-text">${inlineFormat(trimmed)}</p>\n`;
}

closeListIfOpen();

if (inTable) {
  htmlBody += `<div class="table-container"><table>${tableRows.join('\n')}</table></div>\n`;
}

// Inline formatting helper
function inlineFormat(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$1</div>')
    .replace(/\$([^\$]+)\$/g, '<span class="math-inline">$1</span>');
}

// Build dedicated executive Cover Page
const coverPageHtml = `
<section class="cover-page">
  <div class="cover-header">
    <div class="national-emblem-badge">
      <div class="emblem-text">GOVERNMENT OF INDIA &bull; SMART INDIA HACKATHON</div>
      <div class="ministry-title">MINISTRY OF STATISTICS &amp; PROGRAMME IMPLEMENTATION (MoSPI)</div>
    </div>
  </div>

  <div class="cover-center">
    <div class="ps-badge">
      <span class="ps-tag">PROBLEM STATEMENT ID</span>
      <span class="ps-number">26102</span>
    </div>

    <h1 class="cover-title">AARAMBHA</h1>
    <div class="cover-hindi">(आरंभ)</div>
    <h2 class="cover-subtitle">NEXT-GENERATION PROCUREMENT INTELLIGENCE &amp; FORENSIC VIGILANCE PLATFORM</h2>
    <p class="cover-tagline">
      Automated Statistical Anomaly Detection, Benford Forensic Auditing, PFMS Zero-Leakage Pre-Disbursement Smart Locking, and Multi-Agent Natural Language Vigilance Governance for Indian Public Works &amp; MPLADS
    </p>
  </div>

  <div class="cover-footer">
    <div class="cover-meta-grid">
      <div class="meta-card">
        <div class="meta-label">NODAL MINISTRY</div>
        <div class="meta-val">MoSPI (DIID Wing)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">THEME / DOMAIN</div>
        <div class="meta-val">Smart Automation &bull; Governance</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">EVALUATION CONTEXT</div>
        <div class="meta-val">Smart India Hackathon (SIH)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">DOCUMENT CLASSIFICATION</div>
        <div class="meta-val">Official Technical Dossier</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">SOFTWARE RELEASE</div>
        <div class="meta-val">v1.0.0 (Submission Ready)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">ACADEMIC PERIOD</div>
        <div class="meta-val">2024 &ndash; 2026</div>
      </div>
    </div>
    <div class="cover-confidential-note">
      CONFIDENTIAL &bull; PREPARED FOR OFFICIAL HACKATHON TECHNICAL JURY &amp; VIGILANCE AUDIT DIRECTORS
    </div>
  </div>
</section>
`;

const finalCompleteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AARAMBHA — SIH Official Project Report (PS ID: 26102)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Cinzel:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --navy: #0f172a;
      --slate-dark: #1e293b;
      --slate-medium: #334155;
      --border-color: #cbd5e1;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      line-height: 1.65;
      font-size: 14.5px;
      -webkit-font-smoothing: antialiased;
    }

    .report-wrapper {
      max-width: 960px;
      margin: 30px auto;
      background: #ffffff;
      padding: 50px 60px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    /* Print Specific Rules */
    @media print {
      @page {
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        font-size: 10pt !important;
        line-height: 1.55 !important;
        padding: 0 !important;
      }
      .report-wrapper {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .no-print {
        display: none !important;
      }

      /* Clean, deliberate chapter page breaks without empty blanks */
      .cover-page {
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        min-height: 96vh !important;
      }

      /* Major chapters start on a clean fresh page */
      h2.chapter-heading {
        page-break-before: always !important;
        break-before: page !important;
        margin-top: 0 !important;
        padding-top: 10px !important;
      }

      /* Never orphan a heading at bottom of page */
      h1, h2, h3, h4 {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* Never split an image/screenshot or figure across pages */
      figure.figure-container {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin: 14px auto !important;
      }

      /* Keep table rows intact */
      .table-container {
        page-break-inside: auto !important;
      }
      tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      thead {
        display: table-header-group !important;
      }

      /* Avoid breaking short blocks */
      blockquote.callout-card, pre.code-block {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      p.body-text {
        orphans: 3;
        widows: 3;
      }
    }

    /* Cover Page */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 860px;
      padding: 30px 10px 10px;
      text-align: center;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 30px;
    }
    .cover-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
    }
    .emblem-text {
      font-size: 11px;
      letter-spacing: 0.25em;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
    }
    .ministry-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.05em;
      margin-top: 5px;
    }
    .cover-center {
      padding: 50px 0;
    }
    .ps-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #f0f9ff;
      border: 1.5px solid #0284c7;
      padding: 5px 16px;
      border-radius: 9999px;
      margin-bottom: 20px;
    }
    .ps-tag {
      font-size: 11px;
      font-weight: 700;
      color: #0369a1;
      letter-spacing: 0.15em;
    }
    .ps-number {
      font-size: 13px;
      font-weight: 800;
      color: #0c4a6e;
      background: #bae6fd;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .cover-title {
      font-family: 'Cinzel', 'Plus Jakarta Sans', serif;
      font-size: 3.4rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #0f172a;
      margin-bottom: 2px;
      line-height: 1.1;
    }
    .cover-hindi {
      font-size: 1.3rem;
      color: #0284c7;
      font-weight: 700;
      letter-spacing: 0.15em;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0369a1;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      max-width: 760px;
      margin: 0 auto 16px;
      line-height: 1.35;
    }
    .cover-tagline {
      font-size: 13px;
      color: #475569;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.55;
    }
    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 30px;
      text-align: left;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      border-radius: 6px;
    }
    .meta-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .meta-val {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .cover-confidential-note {
      margin-top: 20px;
      font-size: 10px;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #94a3b8;
    }

    /* Headings */
    h1.main-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin: 20px 0 10px;
    }
    h2.section-heading {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0369a1;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 32px;
      margin-bottom: 16px;
      letter-spacing: -0.01em;
    }
    h3.subsection-heading {
      font-size: 1.12rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 22px;
      margin-bottom: 10px;
    }
    h4.sub-subsection-heading {
      font-size: 1.02rem;
      font-weight: 700;
      color: #334155;
      margin-top: 16px;
      margin-bottom: 6px;
    }

    p.body-text {
      margin-bottom: 14px;
      color: #334155;
      text-align: justify;
      text-justify: inter-word;
    }

    blockquote.callout-card {
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      padding: 12px 18px;
      margin: 16px 0;
      border-radius: 0 6px 6px 0;
      font-style: italic;
      color: #0369a1;
      font-size: 13px;
    }

    .content-list {
      margin: 12px 0 16px 24px;
      color: #334155;
    }
    .content-list li {
      margin-bottom: 6px;
    }

    /* Tables */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 18px 0 22px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 9px 12px;
      border-bottom: 2px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
      white-space: nowrap;
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Figures & Images */
    figure.figure-container {
      margin: 18px auto;
      padding: 10px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      text-align: center;
      max-width: 95%;
    }
    figure img {
      max-width: 100%;
      height: auto;
      max-height: 380px;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      display: block;
      margin: 0 auto;
    }
    figcaption.figure-caption {
      margin-top: 8px;
      font-size: 11.5px;
      color: #475569;
      font-weight: 600;
    }

    /* Code Blocks */
    pre.code-block {
      background: #0f172a;
      color: #38bdf8;
      padding: 14px 18px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      overflow-x: auto;
      margin: 16px 0;
      border: 1px solid #1e293b;
      line-height: 1.45;
    }
    code.inline-code {
      font-family: 'JetBrains Mono', monospace;
      background: #f1f5f9;
      color: #0369a1;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.88em;
      border: 1px solid #e2e8f0;
    }

    .math-block {
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      padding: 8px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      margin: 12px 0;
      color: #0f172a;
    }
    .math-inline {
      font-family: 'JetBrains Mono', monospace;
      color: #0369a1;
      font-weight: 600;
    }

    hr.section-divider {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 24px 0;
    }

    .floating-print-bar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }
    .print-button {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
      transition: background 0.2s;
    }
    .print-button:hover {
      background: #0369a1;
    }
  </style>
</head>
<body>
  <div class="floating-print-bar no-print">
    <button class="print-button" onclick="window.print()">
      🖨️ Print Clean PDF
    </button>
  </div>

  <main class="report-wrapper">
    ${coverPageHtml}
    ${htmlBody}
  </main>
</body>
</html>`;

fs.writeFileSync(htmlPath, finalCompleteHtml, 'utf8');
console.log('Successfully wrote streamlined HTML report without double breaks to:', htmlPath);

// Render PDF with Edge
console.log('Rendering professional PDF without empty pages...');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgePath)) {
  try {
    const cmd = '"' + edgePath + '" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="' + pdfPath + '" "' + htmlPath + '"';
    execSync(cmd, { stdio: 'inherit' });
    console.log('Successfully generated PDF report at:', pdfPath);
    const stats = fs.statSync(pdfPath);
    console.log('PDF File Size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
  } catch (err) {
    console.error('Edge PDF generation failed:', err.message);
  }
}

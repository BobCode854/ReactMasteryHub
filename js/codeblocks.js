/**
 * React Mastery Hub — Code Block Enhancer
 * Wraps every .code-block in a .code-wrap with:
 *   - macOS traffic-light dots
 *   - language label (reads data-lang attribute or infers from content)
 *   - copy-to-clipboard button
 */
(function () {
  'use strict';

  function inferLang(el) {
    if (el.dataset.lang) return el.dataset.lang;
    const text = el.textContent || '';
    if (/<[A-Z]/.test(text) || /className=/.test(text) || /jsx/.test(el.className)) return 'JSX';
    if (/import\s+React|useState|useEffect|React\./.test(text)) return 'JSX';
    if (/FROM\s+|SELECT\s+|INSERT\s+/i.test(text)) return 'SQL';
    if (/^FROM\s+|^RUN\s+|^CMD\s+/m.test(text)) return 'Dockerfile';
    if (/server\s*{|location\s+\//.test(text)) return 'nginx';
    if (/^\s*-\s+\w+:/m.test(text) && /runs-on|steps:/.test(text)) return 'YAML';
    if (/interface\s+\w+|:\s+\w+\[\]|type\s+\w+\s*=/.test(text)) return 'TSX';
    if (/function\s+\w+|const\s+\w+\s*=\s*\(|=>/.test(text)) return 'JS';
    if (/@keyframes|border-radius|background:|font-family/.test(text)) return 'CSS';
    if (/\$\s+\w+|npm\s+|npx\s+|git\s+/.test(text)) return 'bash';
    return 'code';
  }

  function langColor(lang) {
    const map = {
      'JSX': '#61dafb', 'TSX': '#3178c6', 'JS': '#f0db4f',
      'TS': '#3178c6', 'CSS': '#2965f1', 'HTML': '#e34c26',
      'bash': '#4eaa25', 'YAML': '#cb171e', 'JSON': '#f59e0b',
      'SQL': '#336791', 'Dockerfile': '#0db7ed', 'nginx': '#009900',
      'code': '#94a3b8',
    };
    return map[lang] || '#94a3b8';
  }

  function wrapBlock(block) {
    // Skip if already wrapped
    if (block.parentElement && block.parentElement.classList.contains('code-wrap')) return;

    const lang = inferLang(block);
    const color = langColor(lang);

    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <div class="code-dots">
        <span></span><span></span><span></span>
      </div>
      <span class="code-lang" style="color:${color}">${lang}</span>
      <button class="copy-btn" title="Copy code">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        Copy
      </button>
    `;

    // Wire copy button
    const btn = header.querySelector('.copy-btn');
    btn.addEventListener('click', function () {
      const text = block.textContent || '';
      navigator.clipboard.writeText(text.trim()).then(function () {
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            Copy
          `;
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text.trim();
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });

    // Insert wrap before block, move block inside
    block.parentNode.insertBefore(wrap, block);
    wrap.appendChild(header);
    wrap.appendChild(block);
  }

  function init() {
    document.querySelectorAll('.code-block').forEach(wrapBlock);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

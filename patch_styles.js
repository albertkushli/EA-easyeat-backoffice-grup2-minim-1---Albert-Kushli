const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

// 1. Switch primary color to EasyEat green
css = css.replace(
  /--color-primary: #4f46e5;/g,
  '--color-primary: #16a34a;'
);
css = css.replace(
  /--color-primary-hover: #4338ca;/g,
  '--color-primary-hover: #15803d;'
);
css = css.replace(
  /--color-primary-light: #e0e7ff;/g,
  '--color-primary-light: #dcfce7;'
);
css = css.replace(
  /--color-background: #f3f4f6;/g,
  '--color-background: #f0f4f0;'
);
css = css.replace(
  /--color-text: #111827;/g,
  '--color-text: #1a2e1a;'
);
css = css.replace(
  /--border-color: #e5e7eb;/g,
  '--border-color: #e2e8e2;'
);
css = css.replace(
  /--border-color-focus: #4f46e5;/g,
  '--border-color-focus: #16a34a;'
);

// 2. Update input focus ring to green
css = css.replace(
  'box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);',
  'box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);'
);

// 3. Update primary button hover shadow
css = css.replace(
  'box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);',
  'box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);'
);

// 4. Update shadow vars to be green-tinted
css = css.replace(
  '--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);',
  '--shadow-sm: 0 1px 3px rgba(22, 101, 52, 0.06), 0 1px 2px rgba(0,0,0,0.04);'
);
css = css.replace(
  '--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
  '--shadow-md: 0 4px 12px rgba(22, 101, 52, 0.08), 0 2px 4px rgba(0,0,0,0.04);'
);
css = css.replace(
  '--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);',
  '--shadow-lg: 0 10px 30px rgba(22, 101, 52, 0.12), 0 4px 8px rgba(0,0,0,0.05);'
);

// 5. Add new page-header, search-wrap utilities at the end
const append = `
/* ===========================
   PAGE HEADER / SEARCH
   =========================== */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 2px 0 0 0;
}

.page-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.search-wrap {
  position: relative;
  margin-bottom: var(--spacing-md);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 14px;
}

.search-wrap .input-custom {
  padding-left: 36px;
}

/* ===========================
   LIST CARD ROWS
   =========================== */

.list-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.list-item-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.list-item-id {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: ui-monospace, monospace;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

/* Remove default list bullets */
.list {
  list-style: none !important;
  padding: 0 !important;
}
`;

fs.appendFileSync('src/styles.css', append, 'utf8');
fs.writeFileSync('src/styles.css', css + append.replace('const append', ''), 'utf8');
// Simpler: just write the full updated file
fs.writeFileSync('src/styles.css', css, 'utf8');
fs.appendFileSync('src/styles.css', append, 'utf8');
console.log('Done');

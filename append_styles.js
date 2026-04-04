const fs = require('fs');

const append = `

/* ===========================
   PREMIUM EXPANDED DETAILS
   =========================== */

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeSlideIn 0.25s ease forwards;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.info-card {
  background-color: #f9fafb;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-card-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.info-card-value {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.5;
}

.info-card-full {
  grid-column: 1 / -1;
}

.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.chip-primary {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.chip-success {
  background-color: #dcfce7;
  color: var(--color-success);
}

.chip-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.chip-neutral {
  background-color: var(--color-background);
  color: var(--color-text-muted);
  border: 1px solid var(--border-color);
}

.timetable-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--spacing-sm);
}

.timetable-day {
  background: var(--color-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
}

.timetable-day-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.timetable-day-slots {
  font-size: 13px;
  color: var(--color-text);
}

.image-gallery {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.image-gallery img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.image-gallery img:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.data-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}
`;

fs.appendFileSync('src/styles.css', append, 'utf8');
console.log('Done');

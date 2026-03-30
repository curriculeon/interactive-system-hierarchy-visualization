/* ═══════════════════════════════════════════════════════════════════
   UI — DOM elements, hints, breadcrumbs, navigation
   ═══════════════════════════════════════════════════════════════════ */

const hintEl   = document.getElementById('hint-box');
const backBtn  = document.getElementById('back-btn');
const crumbs   = document.querySelectorAll('.crumb');
const titleEl  = document.getElementById('title-card');

function updateUI() {
  crumbs.forEach((c, i) => {
    c.classList.toggle('active', i === S.level);
    c.classList.toggle('visited', i < S.level);
  });
  backBtn.classList.toggle('visible', S.level > 0);
  hintEl.textContent = HINTS[S.level];
  titleEl.style.opacity = S.level === 0 ? '1' : '0';
}

/* ── Navigation ──────────────────────────────────────────────── */
function goTo(lv) {
  if (lv === S.level || S.busy) return;
  S.busy = true;
  S.level = lv;
  S.tgt.x = VIEWS[lv].x;
  S.tgt.y = VIEWS[lv].y;
  S.tgt.z = VIEWS[lv].z;

  // Collapse any expanded layer when changing levels
  S.expandedLayer = -1;
  S.expandTarget = 0;

  if (lv <= 0) S.sibC_t = 0;
  if (lv <= 1) S.sibO_t = 0;
  if (lv >= 1) S.sibC_t = 1;

  updateUI();
  setTimeout(() => { S.busy = false; }, 1100);
}

/* ── Event listeners ─────────────────────────────────────────── */
crumbs.forEach(c => c.addEventListener('click', () => goTo(+c.dataset.level)));
backBtn.addEventListener('click', () => { if (S.level > 0) goTo(S.level - 1); });
addEventListener('keydown', e => { if (e.key === 'Escape' && S.level > 0) goTo(S.level - 1); });

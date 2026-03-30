/* ═══════════════════════════════════════════════════════════════════
   INPUT — Mouse move and click event handling
   ═══════════════════════════════════════════════════════════════════ */

canvas.addEventListener('mousemove', e => {
  S.mx = e.clientX; S.my = e.clientY;
  const wm = s2w(e.clientX, e.clientY);
  S.wmx = wm.x; S.wmy = wm.y;

  let cur = 'default';
  S.hovSibC = false;
  S.hovSibO = false;
  S.hovMainC = false;
  S.hovMainO = false;
  S.hovCloud = false;
  S.hoveredLayer = -1;
  S.hoveredChild = -1;

  // ── Level 0: Pyramid view ──────────────────────
  if (S.level === 0) {
    // Check child node hovers first (highest priority)
    if (S.expandedLayer >= 0 && S.expandAnim > 0.5) {
      for (const cr of S.childRects) {
        const dx = wm.x - cr.x, dy = wm.y - cr.y;
        if (dx*dx + dy*dy < cr.r*cr.r * 1.3) {
          S.hoveredChild = cr.idx;
          cur = 'pointer';
          break;
        }
      }
    }

    // Check pyramid layer hovers (for expand)
    if (S.hoveredChild < 0) {
      for (const lr of S.layerRects) {
        if (wm.x >= lr.x && wm.x <= lr.x + lr.w &&
            wm.y >= lr.y && wm.y <= lr.y + lr.h) {
          S.hoveredLayer = lr.idx;
          if (PYR[lr.idx].children) cur = 'pointer';
          break;
        }
      }
    }

    // Hover on main container boundary → highlight + reveal sibling
    if (nearBorder(wm.x, wm.y, 0, 0, C_HW, C_HH, 65)) {
      S.sibC_t = 1;
      S.hovMainC = true;
    } else if (inBox(wm.x, wm.y, 0, 0, C_HW+20, C_HH+20) &&
               !inBox(wm.x, wm.y, 0, 0, C_HW-30, C_HH-30)) {
      S.hovMainC = true;
    }

    // Hover on sibling container
    if (S.sibC_a > 0.35 && inBox(wm.x, wm.y, SIB_C.x, SIB_C.y, C_HW, C_HH)) {
      S.hovSibC = true; cur = 'pointer';
    }
  }

  // ── Level 1: Both containers visible ───────────
  if (S.level === 1) {
    if (nearBorder(wm.x, wm.y, 0, 0, C_HW, C_HH, 50)) S.hovMainC = true;
    if (S.sibC_a > 0.35 && inBox(wm.x, wm.y, SIB_C.x, SIB_C.y, C_HW, C_HH)) {
      S.hovSibC = true; cur = 'pointer';
    }
  }

  // ── Level 2: Orchestration ─────────────────────
  if (S.level === 2) {
    if (nearBorder(wm.x, wm.y, 0, 20, O_HW, O_HH, 100)) {
      S.sibO_t = 1;
      S.hovMainO = true;
    } else if (inBox(wm.x, wm.y, 0, 20, O_HW+40, O_HH+40) &&
               !inBox(wm.x, wm.y, 0, 20, O_HW-50, O_HH-50)) {
      S.hovMainO = true;
    }
    if (S.sibO_a > 0.35 && inBox(wm.x, wm.y, SIB_O.x, SIB_O.y, O_HW, O_HH)) {
      S.hovSibO = true; cur = 'pointer';
    }
  }

  // ── Level 3: Cloud ─────────────────────────────
  if (S.level === 3) {
    if (inBox(wm.x, wm.y, 0, 65, CL_HW+50, CL_HH+50) &&
        !inBox(wm.x, wm.y, 0, 65, CL_HW-80, CL_HH-80)) {
      S.hovCloud = true;
    }
  }

  canvas.style.cursor = cur;
});

canvas.addEventListener('click', e => {
  if (S.busy) return;
  const wm = s2w(e.clientX, e.clientY);

  // ── Level 0: Click pyramid layers to expand ────
  if (S.level === 0) {
    // Check if clicking a child node
    if (S.expandedLayer >= 0 && S.expandAnim > 0.5) {
      for (const cr of S.childRects) {
        const dx = wm.x - cr.x, dy = wm.y - cr.y;
        if (dx*dx + dy*dy < cr.r*cr.r * 1.3) {
          return; // consumed — child node clicked
        }
      }
    }

    // Click a pyramid layer to expand/collapse
    for (const lr of S.layerRects) {
      if (wm.x >= lr.x && wm.x <= lr.x + lr.w &&
          wm.y >= lr.y && wm.y <= lr.y + lr.h) {
        if (PYR[lr.idx].children) {
          if (S.expandedLayer === lr.idx) {
            S.expandTarget = 0;
            setTimeout(() => { if (S.expandAnim < 0.05) S.expandedLayer = -1; }, 400);
          } else {
            S.expandedLayer = lr.idx;
            S.expandAnim = 0;
            S.expandTarget = 1;
          }
        }
        return;
      }
    }
  }

  // Click sibling container → level 2
  if ((S.level === 0 || S.level === 1) && S.sibC_a > 0.35 &&
      inBox(wm.x, wm.y, SIB_C.x, SIB_C.y, C_HW, C_HH)) {
    goTo(2); return;
  }

  // Click sibling orch → level 3
  if (S.level === 2 && S.sibO_a > 0.35 &&
      inBox(wm.x, wm.y, SIB_O.x, SIB_O.y, O_HW, O_HH)) {
    goTo(3); return;
  }

  // Click outside expanded nodes → collapse
  if (S.level === 0 && S.expandedLayer >= 0) {
    S.expandTarget = 0;
    setTimeout(() => { if (S.expandAnim < 0.05) S.expandedLayer = -1; }, 400);
  }
});

/* ═══════════════════════════════════════════════════════════════════
   HIT TESTING — Boundary and box intersection helpers
   ═══════════════════════════════════════════════════════════════════ */

function inBox(wx, wy, cx, cy, hw, hh) {
  return Math.abs(wx - cx) < hw && Math.abs(wy - cy) < hh;
}

function nearBorder(wx, wy, cx, cy, hw, hh, m) {
  return inBox(wx, wy, cx, cy, hw + m, hh + m) && !inBox(wx, wy, cx, cy, hw - m*0.25, hh - m*0.25);
}

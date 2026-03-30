/* ═══════════════════════════════════════════════════════════════════
   MAIN LOOP — Tick, render, and boot
   ═══════════════════════════════════════════════════════════════════ */

function tick() {
  S.t += 0.016;
  const sp = 0.04;
  S.cam.x = lerp(S.cam.x, S.tgt.x, sp);
  S.cam.y = lerp(S.cam.y, S.tgt.y, sp);
  S.cam.z = lerp(S.cam.z, S.tgt.z, sp);

  S.sibC_a = lerp(S.sibC_a, S.sibC_t, 0.05);
  S.sibO_a = lerp(S.sibO_a, S.sibO_t, 0.05);

  // Expand animation
  S.expandAnim = lerp(S.expandAnim, S.expandTarget, 0.08);
  if (S.expandTarget === 0 && S.expandAnim < 0.01) {
    S.expandAnim = 0;
    if (S.expandedLayer >= 0) S.expandedLayer = -1;
  }
}

function render() {
  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.9);
  bg.addColorStop(0, '#0d1425');
  bg.addColorStop(1, '#050810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawStars();

  ctx.save();
  ctx.translate(W/2, H/2);
  ctx.scale(S.cam.z, S.cam.z);
  ctx.translate(-S.cam.x, -S.cam.y);

  // ── Cloud ─────────────────────────────────
  if (S.level >= 3) {
    drawCloud(0, 80, 1, 1);
  }

  // ── Orchestration ─────────────────────────
  if (S.level === 2) {
    drawOrch(0, 30, 1, 1, S.hovMainO, true);
    if (S.sibO_a > 0.008)
      drawOrch(SIB_O.x, SIB_O.y, 1, S.sibO_a, S.hovSibO, false);
  }

  // ── Containers ────────────────────────────
  if (S.level <= 1) {
    drawContainer(0, 0, 1, 1, S.hovMainC, true);
    if (S.sibC_a > 0.008)
      drawContainer(SIB_C.x, SIB_C.y, 1, S.sibC_a, S.hovSibC, false);
  }

  ctx.restore();
}

function loop() {
  tick();
  render();
  requestAnimationFrame(loop);
}

/* ── Boot ────────────────────────────────────────────────────── */
updateUI();
S.cam.x = VIEWS[0].x; S.cam.y = VIEWS[0].y; S.cam.z = VIEWS[0].z;
S.tgt.x = VIEWS[0].x; S.tgt.y = VIEWS[0].y; S.tgt.z = VIEWS[0].z;
loop();

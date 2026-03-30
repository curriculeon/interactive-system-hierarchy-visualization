/* ═══════════════════════════════════════════════════════════════════
   CAMERA — Canvas setup, resize, coordinate transforms, utilities
   ═══════════════════════════════════════════════════════════════════ */

const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let W, H, DPR;

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener('resize', resize);
resize();

/* Utility functions */
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Screen ↔ World coordinate conversion */
const s2w = (sx, sy) => ({ x: (sx - W/2) / S.cam.z + S.cam.x, y: (sy - H/2) / S.cam.z + S.cam.y });
const w2s = (wx, wy) => ({ x: (wx - S.cam.x) * S.cam.z + W/2, y: (wy - S.cam.y) * S.cam.z + H/2 });

/* ═══════════════════════════════════════════════════════════════════
   APPLICATION STATE
   ═══════════════════════════════════════════════════════════════════ */

const S = {
  level: 0,
  cam:  { x: 0, y: 0, z: 1 },
  tgt:  { x: 0, y: 0, z: 1 },
  mx: 0, my: 0, wmx: 0, wmy: 0,
  t: 0,
  busy: false,

  // Sibling reveal alphas
  sibC_a: 0, sibC_t: 0,
  sibO_a: 0, sibO_t: 0,

  // Hover state for boundaries (dotted outline highlight)
  hovSibC: false,
  hovSibO: false,
  hovMainC: false,    // main container hover
  hovMainO: false,    // main orchestration hover
  hovCloud: false,    // cloud hover

  // Pyramid layer expansion
  expandedLayer: -1,       // which layer index is expanded (-1 = none)
  expandAnim: 0,           // 0→1 animation progress
  expandTarget: 0,         // target for expandAnim
  hoveredLayer: -1,        // which pyramid layer the mouse is over
  hoveredChild: -1,        // which child node is hovered

  // Geometry cache — filled during draw, used for hit-testing
  layerRects: [],          // [{x, y, w, h, idx}] in world coords relative to main pyramid
  childRects: [],          // [{x, y, r, idx}]
};

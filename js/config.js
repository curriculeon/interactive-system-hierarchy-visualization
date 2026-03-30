/* ═══════════════════════════════════════════════════════════════════
   CONFIGURATION — Data, constants, and presets
   ═══════════════════════════════════════════════════════════════════ */

/* Pyramid layers — each layer has expandable child nodes */
const PYR = [
  { c: '#ff6b6b', lbl: 'Binary Execution', sub: 'Machine code · CPU instructions',
    children: null },
  { c: '#ffa94d', lbl: 'Command Line', sub: 'cmd · bash · PowerShell',
    children: [
      { lbl: 'Bash',       icon: '⟩_', c: '#ffbd6b' },
      { lbl: 'CMD',        icon: 'C:\\', c: '#ffa94d' },
      { lbl: 'PowerShell', icon: 'PS>', c: '#ff9633' },
    ]},
  { c: '#69db7c', lbl: 'Version Control', sub: 'git · svn · mercurial',
    children: [
      { lbl: 'GitHub',    icon: '⊙', c: '#7ae68a' },
      { lbl: 'GitLab',    icon: '⊕', c: '#69db7c' },
      { lbl: 'Bitbucket', icon: '⊗', c: '#5cc96e' },
    ]},
  { c: '#74c0fc', lbl: 'Programming', sub: 'JavaScript · Python · Java',
    children: [
      { lbl: 'JavaScript', icon: 'JS', c: '#f0db4f' },
      { lbl: 'Python',     icon: 'Py', c: '#4b8bbe' },
      { lbl: 'Java',       icon: 'Jv', c: '#f89820' },
    ]},
];

/* Camera presets per hierarchy level */
const VIEWS = [
  { x:   0, y:   0, z: 1.8   },  // L0 – pyramid inside container (close)
  { x: 115, y:   0, z: 1.0   },  // L1 – both containers visible
  { x:   0, y:  20, z: 0.42  },  // L2 – orchestration cluster
  { x:   0, y:  40, z: 0.13  },  // L3 – cloud
];

/* Sibling positions (world-space) */
const SIB_C = { x: 340, y: 12 };
const SIB_O = { x: 720, y: 50 };

/* Half-extents for hit-testing boundaries */
const C_HW  = 155,  C_HH  = 145;   // container
const O_HW  = 310,  O_HH  = 270;   // orchestration
const CL_HW = 800,  CL_HH = 525;   // cloud

/* Stars for parallax background */
const STARS = Array.from({length: 280}, () => ({
  x: (Math.random()-0.5)*12000,
  y: (Math.random()-0.5)*12000,
  r: Math.random()*1.3+0.25,
  b: Math.random()*0.6+0.4,
  sp: Math.random()*0.7+0.15,
}));

/* Hint messages per level */
const HINTS = [
  'Click a pyramid layer to expand  ·  Hover near the boundary to discover siblings',
  'Click the sibling container to zoom into orchestration view',
  'Hover near the orchestration boundary to reveal sibling clusters',
  'Full cloud abstraction  —  use breadcrumbs or ‹ Back to navigate',
];

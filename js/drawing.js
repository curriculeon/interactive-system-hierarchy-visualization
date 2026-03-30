/* ═══════════════════════════════════════════════════════════════════
   DRAWING — All rendering functions
   ═══════════════════════════════════════════════════════════════════ */

/* ── Rounded rectangle helper ─────────────────────────────────── */
function rrect(cx, cy, w, h, r) {
  const x = cx - w/2, y = cy - h/2;
  ctx.beginPath();
  ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r); ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h); ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r); ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

/* ── Child nodes (expanded from a pyramid layer) ─────────────── */
function drawChildNodes(cx, cy, layerW, sc, layerIdx, anim) {
  if (anim < 0.01) return;
  const layer = PYR[layerIdx];
  if (!layer.children) return;

  const children = layer.children;
  const n = children.length;
  const nodeR = 26 * sc;
  const spreadY = 52 * sc;
  const offsetX = -layerW/2 - 65*sc;

  if (layerIdx === S.expandedLayer) S.childRects = [];

  ctx.save();
  ctx.globalAlpha = anim;

  const groupCY = cy + 18*sc;

  for (let i = 0; i < n; i++) {
    const child = children[i];
    const yOff = (i - (n-1)/2) * spreadY;

    const nx = cx + offsetX * anim;
    const ny = groupCY + yOff * anim;

    // Connecting line
    const lineStartX = cx - layerW/2 + 4*sc;
    const lineStartY = cy + 18*sc;
    ctx.strokeStyle = child.c + '44';
    ctx.lineWidth = 1.5 * sc;
    ctx.setLineDash([4*sc, 3*sc]);
    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);
    const cpx = (lineStartX + nx + nodeR) / 2;
    ctx.quadraticCurveTo(cpx, lineStartY, nx + nodeR, ny);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow
    const isHov = (S.hoveredChild === i && S.expandedLayer === layerIdx);

    ctx.shadowColor = child.c + (isHov ? '77' : '33');
    ctx.shadowBlur = (isHov ? 20 : 8) * sc;

    // Node pill shape
    const nw = 72*sc, nh = 36*sc, nr = 10*sc;
    rrect(nx, ny, nw, nh, nr);
    ctx.fillStyle = child.c + (isHov ? '30' : '18');
    ctx.fill();
    ctx.strokeStyle = child.c + (isHov ? 'cc' : '77');
    ctx.lineWidth = (isHov ? 2.5 : 1.4) * sc;
    ctx.setLineDash([5*sc, 3*sc]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Icon + label
    if (sc > 0.25) {
      ctx.fillStyle = child.c + 'dd';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.max(7, 10*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText(child.icon, nx - 20*sc, ny);

      ctx.fillStyle = '#ffffffdd';
      ctx.font = `500 ${Math.max(7, 9.5*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText(child.lbl, nx + 12*sc, ny);
    }

    // Store rect for hit testing
    if (layerIdx === S.expandedLayer) {
      S.childRects.push({ x: nx, y: ny, r: Math.max(nw, nh)/2, idx: i });
    }
  }

  ctx.restore();
}

/* ── Pyramid ─────────────────────────────────────────────────── */
function drawPyramid(cx, cy, sc, a, isMainPyramid) {
  if (a < 0.01) return;
  const n = PYR.length;
  const lh = 40*sc, bw = 200*sc, tw = 56*sc, gap = 5*sc;
  const totH = n*(lh+gap)-gap;
  const base = cy + totH/2;

  if (isMainPyramid) S.layerRects = [];

  ctx.save(); ctx.globalAlpha = a;

  for (let i = 0; i < n; i++) {
    const t  = i/(n-1);
    const w  = bw + (tw-bw)*t;
    const nw = i<n-1 ? bw+(tw-bw)*((i+1)/(n-1)) : w*0.62;
    const y  = base - i*(lh+gap) - lh;

    const isHov = isMainPyramid && S.hoveredLayer === i && S.level === 0;
    const isExp = isMainPyramid && S.expandedLayer === i;
    const canExpand = PYR[i].children !== null;

    // Trapezoid path
    ctx.beginPath();
    ctx.moveTo(cx-w/2, y+lh);
    ctx.lineTo(cx+w/2, y+lh);
    ctx.lineTo(cx+nw/2, y);
    ctx.lineTo(cx-nw/2, y);
    ctx.closePath();

    // Fill
    const g = ctx.createLinearGradient(cx-w/2, y, cx+w/2, y+lh);
    g.addColorStop(0, PYR[i].c + (isHov ? 'ee' : 'cc'));
    g.addColorStop(1, PYR[i].c + (isHov ? 'aa' : '77'));
    ctx.fillStyle = g;
    ctx.fill();

    // Border
    if (isHov && canExpand) {
      ctx.shadowColor = PYR[i].c + '88';
      ctx.shadowBlur = 12 * sc;
      ctx.strokeStyle = PYR[i].c;
      ctx.lineWidth = 2.5 * sc;
      ctx.setLineDash([6*sc, 3*sc]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    } else if (isExp) {
      ctx.strokeStyle = PYR[i].c;
      ctx.lineWidth = 2.2 * sc;
      ctx.setLineDash([6*sc, 3*sc]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = PYR[i].c + 'aa';
      ctx.lineWidth = 1.2*sc;
      ctx.stroke();
    }

    // Labels
    if (sc > 0.26) {
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.max(9,13.5*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText(PYR[i].lbl, cx, y+lh*0.4);
      if (sc > 0.52) {
        ctx.fillStyle = 'rgba(255,255,255,0.38)';
        ctx.font = `${Math.max(7,9.5*sc)}px "Segoe UI",system-ui,sans-serif`;
        ctx.fillText(PYR[i].sub, cx, y+lh*0.76);
      }
    }

    // Expand hint on hover
    if (isHov && canExpand && sc > 0.5) {
      const p2 = 0.5 + 0.5*Math.sin(S.t*4);
      ctx.globalAlpha = a * (0.5 + 0.5*p2);
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(8, 9*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText('click to expand ›', cx + w/2 - 6*sc, y + lh*0.5);
      ctx.globalAlpha = a;
    }

    // Store world-space rect for hit testing
    if (isMainPyramid) {
      S.layerRects.push({
        x: cx - w/2, y: y,
        w: w, h: lh,
        idx: i,
      });
    }

    // Draw child nodes if this layer is expanded
    if (isMainPyramid && isExp) {
      drawChildNodes(cx, y, w, sc, i, S.expandAnim);
    }
  }

  // Top glow
  if (sc > 0.3) {
    const gy = base - (n-1)*(lh+gap) - lh;
    const gr = ctx.createRadialGradient(cx,gy,0, cx,gy,50*sc);
    gr.addColorStop(0, 'rgba(116,192,252,0.14)');
    gr.addColorStop(1, 'rgba(116,192,252,0)');
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(cx,gy,50*sc,0,Math.PI*2); ctx.fill();
  }

  // Abstraction arrow
  if (sc > 0.6 && isMainPyramid) {
    const ax = cx + bw/2 + 28*sc;
    const ay1 = base;
    const ay2 = base - totH;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1.2*sc;
    ctx.beginPath(); ctx.moveTo(ax, ay1); ctx.lineTo(ax, ay2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax, ay2-4*sc);
    ctx.lineTo(ax-4*sc, ay2+4*sc); ctx.lineTo(ax+4*sc, ay2+4*sc);
    ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    ctx.save(); ctx.translate(ax+12*sc, (ay1+ay2)/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = `${9*sc}px "Segoe UI",system-ui,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Increasing Abstraction', 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

/* ── Container — with hover-highlight dotted outline ─────────── */
function drawContainer(cx, cy, sc, a, hl, isMainPyramid) {
  if (a < 0.005) return;
  const w = 310*sc, h = 290*sc, r = 18*sc;

  ctx.save(); ctx.globalAlpha = a;

  const pulse = hl ? 0.5+0.5*Math.sin(S.t*2.8) : 0;

  ctx.shadowColor = `rgba(80,150,255,${0.12+pulse*0.12})`;
  ctx.shadowBlur  = (hl ? 25 : 10)*sc;

  rrect(cx, cy, w, h, r);
  ctx.fillStyle = `rgba(12,22,55,${0.4+pulse*0.06})`;
  ctx.fill();

  ctx.strokeStyle = `rgba(80,150,255,${hl ? 0.6+pulse*0.25 : 0.28})`;
  ctx.lineWidth   = (hl ? 2.8 : 1.3)*sc;
  ctx.setLineDash([9*sc, 5*sc]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  drawPyramid(cx, cy+18*sc, sc*0.7, 1, isMainPyramid && S.level <= 1);

  if (sc > 0.12) {
    ctx.fillStyle = `rgba(100,175,255,${hl ? 1 : 0.85})`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.max(8,13*sc)}px "Segoe UI",system-ui,sans-serif`;
    ctx.fillText('Container', cx, cy - h/2 + 20*sc);
    if (sc > 0.28) {
      ctx.fillStyle = `rgba(100,175,255,${hl ? 0.5 : 0.35})`;
      ctx.font = `${Math.max(7,9.5*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText('Docker · Podman', cx, cy - h/2 + 35*sc);
    }
  }

  if (hl && !isMainPyramid && a > 0.55) {
    const p = 0.35+0.65*Math.sin(S.t*3.2);
    ctx.globalAlpha = a*p;
    ctx.fillStyle = 'rgba(130,190,255,0.8)';
    ctx.font = `500 ${Math.max(9,11*sc)}px "Segoe UI",system-ui,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⬚ Click to zoom out', cx, cy + h/2 + 24*sc);
  }

  ctx.restore();
}

/* ── Orchestration — with hover-highlight dotted outline ─────── */
function drawOrch(cx, cy, sc, a, hl, isMain) {
  if (a < 0.005) return;
  const w = 620*sc, h = 540*sc, r = 30*sc;

  const csc = sc*0.36;
  const cpos = [
    {x:cx-175*sc, y:cy-75*sc },
    {x:cx+175*sc, y:cy-75*sc },
    {x:cx-88*sc,  y:cy+105*sc},
    {x:cx+88*sc,  y:cy+105*sc},
    {x:cx,        y:cy-190*sc},
  ];

  ctx.save(); ctx.globalAlpha = a;

  const pulse = hl ? 0.5+0.5*Math.sin(S.t*2.4) : 0;

  ctx.shadowColor = `rgba(160,95,255,${0.09+pulse*0.1})`;
  ctx.shadowBlur  = (hl ? 28 : 12)*sc;

  rrect(cx, cy, w, h, r);
  ctx.fillStyle = `rgba(22,12,48,${0.22+pulse*0.05})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(160,95,255,${hl ? 0.55+pulse*0.2 : 0.22})`;
  ctx.lineWidth   = (hl ? 2.8 : 1.2)*sc;
  ctx.setLineDash([13*sc, 7*sc]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  // Network mesh
  ctx.strokeStyle = 'rgba(160,120,255,0.06)';
  ctx.lineWidth = 1*sc;
  for (let i=0;i<cpos.length;i++)
    for (let j=i+1;j<cpos.length;j++){
      ctx.beginPath();ctx.moveTo(cpos[i].x,cpos[i].y);
      ctx.lineTo(cpos[j].x,cpos[j].y);ctx.stroke();
    }

  // Data-flow particles
  if (sc > 0.06) {
    for (let i=0;i<cpos.length;i++)
      for (let j=i+1;j<cpos.length;j++){
        const prog = (S.t*0.25+i*0.18+j*0.14)%1;
        const px = lerp(cpos[i].x,cpos[j].x,prog);
        const py = lerp(cpos[i].y,cpos[j].y,prog);
        ctx.beginPath(); ctx.arc(px,py,2.2*sc,0,Math.PI*2);
        ctx.fillStyle='rgba(175,135,255,0.28)'; ctx.fill();
      }
  }

  for (const p of cpos) drawContainer(p.x,p.y,csc,1,false,false);

  if (sc > 0.05) {
    ctx.globalAlpha = a;
    ctx.fillStyle = `rgba(195,135,255,${hl ? 1 : 0.85})`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.max(8,16*sc)}px "Segoe UI",system-ui,sans-serif`;
    ctx.fillText('Orchestration', cx, cy - h/2 + 26*sc);
    if (sc > 0.1) {
      ctx.fillStyle = `rgba(195,135,255,${hl ? 0.5 : 0.35})`;
      ctx.font = `${Math.max(7,10.5*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText('Kubernetes · Docker Swarm', cx, cy - h/2 + 44*sc);
    }
  }

  if (hl && !isMain && a > 0.55) {
    const p = 0.35+0.65*Math.sin(S.t*3.2);
    ctx.globalAlpha = a*p;
    ctx.fillStyle = 'rgba(195,155,255,0.75)';
    ctx.font = `500 ${Math.max(9,12*sc)}px "Segoe UI",system-ui,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⬚ Click to zoom out', cx, cy + h/2 + 30*sc);
  }

  ctx.restore();
}

/* ── Cloud — with hover-highlight dotted outline ─────────────── */
function drawCloud(cx, cy, sc, a) {
  if (a < 0.005) return;
  const w = 1600*sc, h = 1050*sc, r = 55*sc;
  const hl = S.hovCloud;

  const osc = sc*0.30;
  const opos = [
    {x:cx-500*sc, y:cy-210*sc},
    {x:cx+500*sc, y:cy-210*sc},
    {x:cx,        y:cy+280*sc},
    {x:cx-320*sc, y:cy+80*sc },
    {x:cx+320*sc, y:cy+80*sc },
  ];

  ctx.save(); ctx.globalAlpha = a;

  const pulse = hl ? 0.5+0.5*Math.sin(S.t*2.2) : 0;

  ctx.shadowColor = `rgba(70,230,170,${0.05+pulse*0.08})`;
  ctx.shadowBlur  = (hl ? 30 : 22)*sc;

  rrect(cx, cy+25*sc, w, h, r);
  ctx.fillStyle = `rgba(8,28,22,${0.18+pulse*0.04})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(70,230,170,${hl ? 0.4+pulse*0.2 : 0.2})`;
  ctx.lineWidth = (hl ? 3 : 2)*sc;
  ctx.setLineDash([20*sc, 12*sc]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  // WAN mesh
  ctx.strokeStyle = 'rgba(70,230,170,0.035)';
  ctx.lineWidth = 1.8*sc;
  for (let i=0;i<opos.length;i++)
    for (let j=i+1;j<opos.length;j++){
      ctx.beginPath();ctx.moveTo(opos[i].x,opos[i].y);
      ctx.lineTo(opos[j].x,opos[j].y);ctx.stroke();
    }

  // WAN data pulses
  if (sc > 0.02) {
    for (let i=0;i<opos.length;i++)
      for (let j=i+1;j<opos.length;j++){
        const prog = (S.t*0.15+i*0.2+j*0.12)%1;
        const px = lerp(opos[i].x,opos[j].x,prog);
        const py = lerp(opos[i].y,opos[j].y,prog);
        ctx.beginPath(); ctx.arc(px,py,3.5*sc,0,Math.PI*2);
        ctx.fillStyle='rgba(70,230,170,0.2)'; ctx.fill();
      }
  }

  for (const p of opos) drawOrch(p.x,p.y,osc,1,false,false);

  if (sc > 0.025) {
    ctx.globalAlpha = a;
    ctx.fillStyle = `rgba(70,230,170,${hl ? 1 : 0.92})`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.max(10,22*sc)}px "Segoe UI",system-ui,sans-serif`;
    ctx.fillText('☁  Cloud Computing', cx, cy+25*sc - h/2 + 40*sc);
    if (sc > 0.035) {
      ctx.fillStyle = `rgba(70,230,170,${hl ? 0.5 : 0.35})`;
      ctx.font = `${Math.max(8,13*sc)}px "Segoe UI",system-ui,sans-serif`;
      ctx.fillText('AWS  ·  GCP  ·  Azure  —  Distributed Infrastructure', cx, cy+25*sc - h/2 + 64*sc);
    }
  }

  ctx.restore();
}

/* ── Stars parallax background ───────────────────────────────── */
function drawStars() {
  for (const s of STARS) {
    const px = 0.025+s.r*0.012;
    const sx = (s.x-S.cam.x*px)*S.cam.z+W/2;
    const sy = (s.y-S.cam.y*px)*S.cam.z+H/2;
    if (sx<-10||sx>W+10||sy<-10||sy>H+10) continue;
    const tw = 0.4+0.6*Math.sin(S.t*s.sp+s.x*0.01);
    ctx.beginPath();
    ctx.arc(sx,sy,s.r*clamp(S.cam.z*0.6+0.35,0.3,1.4),0,Math.PI*2);
    ctx.fillStyle = `rgba(170,195,255,${tw*0.5*s.b})`;
    ctx.fill();
  }
}

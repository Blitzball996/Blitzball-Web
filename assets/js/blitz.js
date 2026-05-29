/* ============================================
   BLITZ DAW — Studio Edition JS
   Three.js 3D scene · Interactions · Animations
   ============================================ */
(function(){
'use strict';

/* ---------- Three.js: cinematic 3D scene ---------- */
function initScene(){
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('scene-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02000a, 0.0014);

  const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 320);

  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* === Palette === */
  const palette = [
    new THREE.Color(0x8b5cf6), new THREE.Color(0x06d6a0),
    new THREE.Color(0xf72585), new THREE.Color(0x4cc9f0),
    new THREE.Color(0xffd60a), new THREE.Color(0xff6b35),
    new THREE.Color(0xe040fb), new THREE.Color(0xa78bfa)
  ];

  /* === Spiral particle galaxy === */
  const N = 2600;
  const positions = new Float32Array(N*3);
  const colors = new Float32Array(N*3);
  const sizes = new Float32Array(N);
  for (let i=0; i<N; i++){
    const arm = Math.floor(Math.random()*4);
    const angle = (i/N) * Math.PI*8 + arm*(Math.PI/2);
    const radius = Math.pow(Math.random(),0.6) * 480 + 60;
    const spread = (Math.random()-0.5) * 80;
    positions[i*3]   = Math.cos(angle)*radius + spread;
    positions[i*3+1] = (Math.random()-0.5) * 250;
    positions[i*3+2] = Math.sin(angle)*radius + spread;
    const c = palette[(arm*2 + (Math.random()>0.5?0:1)) % palette.length];
    colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
    sizes[i] = Math.random()*2.4 + 0.6;
  }
  const galaxyGeo = new THREE.BufferGeometry();
  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors,3));
  galaxyGeo.setAttribute('size', new THREE.BufferAttribute(sizes,1));

  const galaxyMat = new THREE.PointsMaterial({
    size:2.2, vertexColors:true, transparent:true, opacity:0.78,
    blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true
  });
  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
  scene.add(galaxy);

  /* === Audio-reactive central torus knot (vinyl metaphor) === */
  const knotGeo = new THREE.TorusKnotGeometry(70, 14, 220, 24, 2, 3);
  const knotMat = new THREE.MeshBasicMaterial({
    color:0xa78bfa, wireframe:true, transparent:true, opacity:0.18
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  /* === Concentric audio rings === */
  const rings = [];
  for (let i=0; i<5; i++){
    const r = 120 + i*40;
    const g = new THREE.RingGeometry(r, r+0.4, 128);
    const m = new THREE.MeshBasicMaterial({
      color: palette[i%palette.length], transparent:true, opacity:0.18,
      side:THREE.DoubleSide
    });
    const ring = new THREE.Mesh(g,m);
    ring.rotation.x = Math.PI/2 + (Math.random()-0.5)*0.4;
    ring.userData.speed = (Math.random()*0.4 + 0.2) * (Math.random()>0.5?1:-1);
    rings.push(ring);
    scene.add(ring);
  }

  /* === Frequency bars (3D) circular === */
  const barsGroup = new THREE.Group();
  const BARS = 64;
  for (let i=0; i<BARS; i++){
    const geo = new THREE.BoxGeometry(2.2, 1, 2.2);
    const mat = new THREE.MeshBasicMaterial({
      color: palette[i%palette.length], transparent:true, opacity:0.65
    });
    const bar = new THREE.Mesh(geo, mat);
    const ang = (i/BARS)*Math.PI*2;
    bar.position.set(Math.cos(ang)*180, 0, Math.sin(ang)*180);
    bar.userData.angle = ang;
    bar.userData.phase = Math.random()*Math.PI*2;
    barsGroup.add(bar);
  }
  scene.add(barsGroup);

  /* === Floating geometric shapes === */
  const shapes = [];
  const geos = [
    new THREE.OctahedronGeometry(16, 0),
    new THREE.IcosahedronGeometry(14, 0),
    new THREE.TetrahedronGeometry(18, 0),
    new THREE.DodecahedronGeometry(13, 0)
  ];
  for (let i=0; i<14; i++){
    const g = geos[i%geos.length];
    const m = new THREE.MeshBasicMaterial({
      color: palette[i%palette.length], wireframe:true,
      transparent:true, opacity:0.32
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random()-0.5)*900,
      (Math.random()-0.5)*500,
      (Math.random()-0.5)*600 - 100
    );
    mesh.userData.rspeed = {
      x:(Math.random()-0.5)*0.01, y:(Math.random()-0.5)*0.01, z:(Math.random()-0.5)*0.01
    };
    mesh.userData.float = Math.random()*Math.PI*2;
    shapes.push(mesh);
    scene.add(mesh);
  }

  /* === Lights (for any standard materials later) === */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const p1 = new THREE.PointLight(0x8b5cf6, 1.0, 800);
  p1.position.set(120, 80, 200);
  scene.add(p1);

  /* === Interactions === */
  let mx=0, my=0, tx=0, ty=0, scrollY=0;
  addEventListener('mousemove', e => {
    mx = (e.clientX/innerWidth - 0.5);
    my = (e.clientY/innerHeight - 0.5);
  });
  addEventListener('scroll', () => { scrollY = scrollY*0.7 + window.scrollY*0.3; });

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    galaxy.rotation.y = t * 0.04;
    galaxy.rotation.x = Math.sin(t*0.12)*0.08;

    knot.rotation.x = t * 0.3;
    knot.rotation.y = t * 0.42;
    knot.scale.setScalar(1 + Math.sin(t*1.4)*0.08);

    rings.forEach((r,i)=>{
      r.rotation.z = t * r.userData.speed;
      r.material.opacity = 0.14 + Math.sin(t*1.6 + i)*0.08;
    });

    barsGroup.rotation.y = t * 0.12;
    barsGroup.children.forEach((bar,i)=>{
      const h = 6 + Math.abs(Math.sin(t*2.5 + bar.userData.phase + i*0.15))*40;
      bar.scale.y = h;
      bar.position.y = h/2 - 30;
    });

    shapes.forEach(s=>{
      s.rotation.x += s.userData.rspeed.x;
      s.rotation.y += s.userData.rspeed.y;
      s.rotation.z += s.userData.rspeed.z;
      s.position.y += Math.sin(t + s.userData.float)*0.15;
    });

    tx += (mx*40 - tx)*0.04;
    ty += (-my*28 - ty)*0.04;
    camera.position.x = tx;
    camera.position.y = ty - scrollY*0.05;
    camera.lookAt(0, -scrollY*0.025, 0);

    renderer.render(scene, camera);
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

/* ---------- Nav scroll ---------- */
function initNav(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.section-head, .stat-cell, .studio-card, .fx-pedal, .ai-feat, .spec-row, .preset-chip, .dl-card, .synth-panel, .preset-bank');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------- Animated number counters ---------- */
function initCounters(){
  const els = document.querySelectorAll('[data-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = String(target).includes('.');
      let cur = 0;
      const dur = 1400;
      const start = performance.now();
      function step(now){
        const p = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        cur = target * eased;
        if (el.querySelector('span')){
          el.querySelector('span').textContent = isFloat ? cur.toFixed(1) : Math.floor(cur);
        } else {
          el.textContent = isFloat ? cur.toFixed(1) : Math.floor(cur);
        }
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, {threshold:0.4});
  els.forEach(el => io.observe(el));
}

/* ---------- Tilt effect on cards ---------- */
function initTilt(){
  const cards = document.querySelectorAll('.studio-card, .stat-cell, .ai-feat, .fx-pedal, .dl-platform');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Knob auto-wiggle ---------- */
function initKnobs(){
  // subtle idle motion on synth knobs
  const knobs = document.querySelectorAll('.knob, .big-knob, .pk');
  knobs.forEach((k,i) => {
    const base = parseInt(getComputedStyle(k).getPropertyValue('--rot')) || 0;
    let dir = Math.random()>0.5?1:-1;
    setInterval(() => {
      const amt = base + Math.sin(Date.now()*0.0006 + i)*8*dir;
      k.style.setProperty('--rot', amt + 'deg');
    }, 60);
  });
}

/* ---------- Spectrum bars random retrigger ---------- */
function initSpectrumPulse(){
  const bars = document.querySelectorAll('.spec-bar');
  if (!bars.length) return;
  setInterval(() => {
    bars.forEach(b => {
      const h = 15 + Math.random()*80;
      b.style.setProperty('--h', h+'%');
    });
  }, 180);
}

/* ---------- VU meter live update ---------- */
function initVU(){
  const vus = document.querySelectorAll('.strip-vu i, .meter-fill');
  setInterval(() => {
    vus.forEach(v => {
      const cur = parseFloat(getComputedStyle(v).getPropertyValue('--h')) || 50;
      const next = Math.max(20, Math.min(95, cur + (Math.random()-0.5)*30));
      if (v.style.getPropertyValue('--h')) v.style.setProperty('--h', next + '%');
      if (v.style.getPropertyValue('--w')){
        const w = parseFloat(getComputedStyle(v).getPropertyValue('--w')) || 30;
        const wn = Math.max(8, Math.min(85, w + (Math.random()-0.5)*15));
        v.style.setProperty('--w', wn + '%');
      }
    });
  }, 320);
}

/* ---------- Init all ---------- */
function init(){
  initScene();
  initNav();
  initReveal();
  initCounters();
  initTilt();
  initKnobs();
  initSpectrumPulse();
  initVU();
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();

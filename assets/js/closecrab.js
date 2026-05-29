/* ============================================
   CLOSECRAB — Local-First AI Terminal · JS
   Three.js 3D scene · Matrix rain · Terminal
   Counters · Reveal · Tilt · Nav
   ============================================ */
(function(){
'use strict';

/* ============================================================
   1. THREE.JS 3D SCENE
   Geek-style: floating code shards + hex grid tunnel +
   wireframe icosahedron + neural particle flow
   ============================================================ */
function initScene(){
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('scene-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05010f, 0.0015);

  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 3500);
  camera.position.set(0, 0, 360);

  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* Palette - cyberpunk purple/cyan/pink */
  const palette = [
    new THREE.Color(0x8b5cf6), new THREE.Color(0xa78bfa),
    new THREE.Color(0x06d6a0), new THREE.Color(0x10f0b8),
    new THREE.Color(0xf72585), new THREE.Color(0x4cc9f0),
    new THREE.Color(0xe040fb), new THREE.Color(0xffd60a)
  ];

  /* === Neural particle network === */
  const N = 3000;
  const positions = new Float32Array(N*3);
  const colors    = new Float32Array(N*3);
  const sizes     = new Float32Array(N);
  for (let i=0; i<N; i++){
    const r = Math.pow(Math.random(), 0.5) * 700 + 40;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos((Math.random()*2)-1);
    positions[i*3]   = r * Math.sin(ph) * Math.cos(th);
    positions[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    positions[i*3+2] = r * Math.cos(ph) * 0.6;
    const c = palette[Math.floor(Math.random()*palette.length)];
    colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
    sizes[i] = Math.random()*1.8 + 0.4;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  partGeo.setAttribute('color',    new THREE.BufferAttribute(colors,3));
  const partMat = new THREE.PointsMaterial({
    size:1.8, vertexColors:true, transparent:true, opacity:0.78,
    blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  /* === Wireframe central icosahedron (CloseCrab core) === */
  const coreGeo = new THREE.IcosahedronGeometry(72, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color:0xa78bfa, wireframe:true, transparent:true, opacity:0.28
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const innerCoreGeo = new THREE.IcosahedronGeometry(46, 0);
  const innerCoreMat = new THREE.MeshBasicMaterial({
    color:0x06d6a0, wireframe:true, transparent:true, opacity:0.5
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  scene.add(innerCore);

  /* === Orbiting tool nodes (59 tools metaphor) === */
  const orbiters = [];
  const O = 24;
  for (let i=0; i<O; i++){
    const g = new THREE.OctahedronGeometry(4 + Math.random()*3, 0);
    const m = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length], transparent:true, opacity:0.85,
      blending:THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.userData = {
      radius: 130 + Math.random()*180,
      speed: (Math.random()*0.4 + 0.15) * (Math.random()>0.5?1:-1),
      angle: Math.random()*Math.PI*2,
      tilt:  (Math.random()-0.5)*0.9,
      yOff:  (Math.random()-0.5)*120
    };
    orbiters.push(mesh);
    scene.add(mesh);
  }

  /* === Hex tunnel rings === */
  const rings = [];
  for (let i=0; i<7; i++){
    const r = 160 + i*55;
    const g = new THREE.RingGeometry(r, r+0.6, 6);
    const m = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length], transparent:true, opacity:0.22,
      side:THREE.DoubleSide
    });
    const ring = new THREE.Mesh(g, m);
    ring.rotation.x = Math.PI/2 + (Math.random()-0.5)*0.3;
    ring.userData.speed = (Math.random()*0.3 + 0.15) * (Math.random()>0.5?1:-1);
    rings.push(ring);
    scene.add(ring);
  }

  /* === Floating "code shards" (small flat planes with glyph texture vibe) === */
  const shards = [];
  for (let i=0; i<18; i++){
    const w = 8 + Math.random()*22;
    const h = 8 + Math.random()*22;
    const g = new THREE.PlaneGeometry(w, h);
    const m = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length], transparent:true, opacity:0.18,
      side:THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random()-0.5)*1000,
      (Math.random()-0.5)*600,
      (Math.random()-0.5)*700 - 100
    );
    mesh.userData = {
      rs: {x:(Math.random()-0.5)*0.01, y:(Math.random()-0.5)*0.012, z:(Math.random()-0.5)*0.008},
      flo: Math.random()*Math.PI*2
    };
    shards.push(mesh);
    scene.add(mesh);
  }

  /* === Lights === */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const p1 = new THREE.PointLight(0x8b5cf6, 1.0, 900);
  p1.position.set(120, 80, 200);
  scene.add(p1);
  const p2 = new THREE.PointLight(0x06d6a0, 0.6, 800);
  p2.position.set(-150, -100, 220);
  scene.add(p2);

  /* === Interactions === */
  let mx=0, my=0, tx=0, ty=0, scrollY=0;
  addEventListener('mousemove', e => {
    mx = (e.clientX/innerWidth  - 0.5);
    my = (e.clientY/innerHeight - 0.5);
  });
  addEventListener('scroll', () => { scrollY = scrollY*0.7 + window.scrollY*0.3; });

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.035;
    particles.rotation.x = Math.sin(t*0.1)*0.06;

    core.rotation.x = t * 0.25;
    core.rotation.y = t * 0.32;
    core.scale.setScalar(1 + Math.sin(t*1.3)*0.07);

    innerCore.rotation.x = -t * 0.4;
    innerCore.rotation.z =  t * 0.5;

    rings.forEach((r,i) => {
      r.rotation.z = t * r.userData.speed;
      r.material.opacity = 0.16 + Math.sin(t*1.8 + i)*0.08;
    });

    orbiters.forEach(o => {
      o.userData.angle += o.userData.speed * 0.01;
      const a = o.userData.angle;
      const rad = o.userData.radius;
      o.position.x = Math.cos(a) * rad;
      o.position.z = Math.sin(a) * rad * Math.cos(o.userData.tilt);
      o.position.y = Math.sin(a) * rad * Math.sin(o.userData.tilt) + o.userData.yOff;
      o.rotation.x += 0.02;
      o.rotation.y += 0.03;
    });

    shards.forEach(s => {
      s.rotation.x += s.userData.rs.x;
      s.rotation.y += s.userData.rs.y;
      s.rotation.z += s.userData.rs.z;
      s.position.y += Math.sin(t + s.userData.flo)*0.12;
    });

    tx += (mx*45 - tx)*0.04;
    ty += (-my*30 - ty)*0.04;
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

/* ============================================================
   2. MATRIX RAIN (canvas) — falling glyphs
   ============================================================ */
function initMatrix(){
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  const chars = 'CLOSECRAB01アイウエオカキクケコサシスセソタチツテト{}<>/\\|=+-*&^%$#@!?'.split('');
  const fontSize = 14;

  function resize(){
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
    cols = Math.floor(W / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -100);
  }
  resize();
  addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(5,1,15,0.08)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + 'px JetBrains Mono, monospace';

    for (let i=0; i<cols; i++){
      const ch = chars[Math.floor(Math.random()*chars.length)];
      const x  = i * fontSize;
      const y  = drops[i] * fontSize;

      // head glyph - bright
      ctx.fillStyle = 'rgba(167,139,250,0.95)';
      ctx.fillText(ch, x, y);
      // trail
      ctx.fillStyle = 'rgba(6,214,160,0.55)';
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], x, y - fontSize);

      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5 + Math.random()*0.4;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   3. NAV scroll state
   ============================================================ */
function initNav(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  // smooth-scroll for anchor links
  document.querySelectorAll('.nav-links a[href^="#"], .hero-actions a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 60, behavior:'smooth' });
    });
  });
}

/* ============================================================
   4. Reveal-on-scroll
   ============================================================ */
function initReveal(){
  const all = document.querySelectorAll('.reveal, .section-head, .feat, .tool-cat, .stat-card, .spec-row, .prov, .agent-node');
  all.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('visible');
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ============================================================
   5. Animated stat counters [data-num]
   ============================================================ */
function initCounters(){
  const els = document.querySelectorAll('.stat-num[data-num]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.num);
      const isFloat = String(target).includes('.');
      const dur = 1600;
      const start = performance.now();
      function step(now){
        const p = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        const cur = target * eased;
        el.textContent = isFloat ? cur.toFixed(1) : Math.floor(cur);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, {threshold:0.4});
  els.forEach(el => io.observe(el));
}

/* ============================================================
   6. Hero typed effect
   ============================================================ */
function initTyped(){
  const target = document.getElementById('typed-out');
  if (!target) return;
  const lines = [
    '帮我重构 useAuth hook，提取登录逻辑',
    '/coordinator 优化整个项目的性能',
    '把这个 Python 项目迁移到 Rust',
    '/rag query "认证流程怎么实现的"',
    'review src/ 找出所有 TODO 和潜在 bug',
    '/voice 启动语音模式'
  ];
  let li = 0, ci = 0, deleting = false;
  function tick(){
    const cur = lines[li];
    if (!deleting){
      ci++;
      target.textContent = cur.slice(0, ci);
      if (ci >= cur.length){
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 55 + Math.random()*40);
    } else {
      ci--;
      target.textContent = cur.slice(0, ci);
      if (ci <= 0){
        deleting = false;
        li = (li+1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 25);
    }
  }
  tick();
}

/* ============================================================
   7. Card tilt 3D effect
   ============================================================ */
function initTilt(){
  const cards = document.querySelectorAll('.feat, .stat-card, .tool-cat, .prov, .agent-node');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width  - 0.5;
      const py = (e.clientY - r.top )/r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px*5}deg) rotateX(${-py*5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   8. Glitch on hero title (occasional)
   ============================================================ */
function initGlitch(){
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  setInterval(() => {
    if (Math.random() > 0.85){
      h1.style.transform = `translateX(${(Math.random()-0.5)*4}px)`;
      h1.style.filter = 'hue-rotate(' + (Math.random()*40) + 'deg)';
      setTimeout(() => {
        h1.style.transform = '';
        h1.style.filter = '';
      }, 120);
    }
  }, 2500);
}

/* ============================================================
   9. Terminal cursor blink already handled by CSS .caret
       + add line-by-line typewriter for hero-term-body
   ============================================================ */
function initTermReveal(){
  const body = document.getElementById('hero-term-body');
  if (!body) return;
  const lines = body.querySelectorAll('.line');
  lines.forEach((l,i) => {
    l.style.opacity = 0;
    l.style.transform = 'translateX(-12px)';
    l.style.transition = 'all .5s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => {
      l.style.opacity = 1;
      l.style.transform = 'translateX(0)';
    }, 350 + i*220);
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  initScene();
  initMatrix();
  initNav();
  initReveal();
  initCounters();
  initTyped();
  initTilt();
  initGlitch();
  initTermReveal();
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();


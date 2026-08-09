/* ============================================================
   Click-to-load video embeds.
   Nothing is fetched until the visitor presses play, so a 100 MB+
   trailer never costs a first-paint byte.

   Markup contract:
     <div class="vframe" data-yt="ID" data-bili="BVID" data-src="file.mp4">
       <button class="vframe-poster">...</button>
     </div>

   Region default: Bilibili is preselected for zh-CN visitors when a
   BV id exists, YouTube otherwise. Visitors can switch either way.
   ============================================================ */
(function () {
  'use strict';

  var prefersCN = /^zh\b/i.test(navigator.language || '') ||
                  (navigator.languages || []).some(function (l) { return /^zh\b/i.test(l); });

  function ytURL(id) {
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
           '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  }

  function biliURL(bv) {
    return 'https://player.bilibili.com/player.html?bvid=' + encodeURIComponent(bv) +
           '&autoplay=1&high_quality=1&danmaku=0';
  }

  function makeIframe(url, title) {
    var f = document.createElement('iframe');
    f.src = url;
    f.title = title || 'Product video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('loading', 'lazy');
    return f;
  }

  function makeVideo(src, poster) {
    var v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'metadata';
    if (poster) v.poster = poster;
    return v;
  }

  function sourcesOf(frame) {
    var list = [];
    if (frame.dataset.bili) list.push({ kind: 'bili', label: 'Bilibili', id: frame.dataset.bili });
    if (frame.dataset.yt) list.push({ kind: 'yt', label: 'YouTube', id: frame.dataset.yt });
    if (frame.dataset.src) list.push({ kind: 'file', label: 'Direct', id: frame.dataset.src });
    // Region ordering: put the likely-reachable host first.
    list.sort(function (a, b) {
      var rank = prefersCN ? { bili: 0, yt: 1, file: 2 } : { yt: 0, bili: 1, file: 2 };
      return rank[a.kind] - rank[b.kind];
    });
    return list;
  }

  function mount(frame, source) {
    // Drop whatever player is currently in the frame.
    var old = frame.querySelector('iframe, video');
    if (old) old.remove();

    var title = frame.dataset.title || '';
    var node;
    if (source.kind === 'yt') node = makeIframe(ytURL(source.id), title);
    else if (source.kind === 'bili') node = makeIframe(biliURL(source.id), title);
    else node = makeVideo(source.id, frame.dataset.poster);

    frame.appendChild(node);
    var poster = frame.querySelector('.vframe-poster');
    if (poster) poster.hidden = true;
  }

  function buildSwitch(frame, list) {
    if (list.length < 2) return;
    var wrap = document.createElement('div');
    wrap.className = 'vsrc';
    list.forEach(function (src, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'vsrc-btn';
      b.textContent = src.label;
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', function () {
        wrap.querySelectorAll('.vsrc-btn').forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
        mount(frame, src);
      });
      wrap.appendChild(b);
    });
    frame.insertAdjacentElement('afterend', wrap);
  }

  document.querySelectorAll('.vframe').forEach(function (frame) {
    var list = sourcesOf(frame);
    if (!list.length) return;

    // A muted looping clip (small self-hosted file) plays inline right away.
    if (frame.dataset.inline === 'true' && frame.dataset.src) {
      var v = document.createElement('video');
      v.src = frame.dataset.src;
      v.muted = true;
      v.loop = true;
      v.autoplay = true;
      v.playsInline = true;
      v.controls = true;
      v.preload = 'metadata';
      if (frame.dataset.poster) v.poster = frame.dataset.poster;
      frame.appendChild(v);
      var p = frame.querySelector('.vframe-poster');
      if (p) p.hidden = true;
      return;
    }

    buildSwitch(frame, list);

    var poster = frame.querySelector('.vframe-poster');
    if (poster) {
      poster.addEventListener('click', function () { mount(frame, list[0]); });
    }
  });
})();

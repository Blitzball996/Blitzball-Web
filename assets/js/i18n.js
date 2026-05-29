/* ============================================================
   Blitzball Labs — i18n Engine (manual translations, no MT)
   Supports: en, zh, ja, ko, es, fr, de, ru, pt, ar, it, hi
   Works on both http:// and file:// protocols.
   - If window.__I18N__ contains inline data, uses that directly.
   - Otherwise falls back to fetching JSON files.
   ============================================================ */
(function () {
  var SUPPORTED = [
    { code: 'en', name: 'English',     flag: '🇬🇧' },
    { code: 'zh', name: '简体中文',     flag: '🇨🇳' },
    { code: 'ja', name: '日本語',       flag: '🇯🇵' },
    { code: 'ko', name: '한국어',       flag: '🇰🇷' },
    { code: 'es', name: 'Español',     flag: '🇪🇸' },
    { code: 'fr', name: 'Français',    flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch',     flag: '🇩🇪' },
    { code: 'ru', name: 'Русский',     flag: '🇷🇺' },
    { code: 'pt', name: 'Português',   flag: '🇵🇹' },
    { code: 'it', name: 'Italiano',    flag: '🇮🇹' },
    { code: 'ar', name: 'العربية',     flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी',        flag: '🇮🇳' }
  ];
  var RTL = ['ar'];
  var STORE_KEY = 'bb_lang';
  var NS = (document.documentElement.getAttribute('data-i18n-ns') || 'index');

  var current = 'en';
  var baseline = null;

  function qAll(sel) {
    try { return Array.from(document.querySelectorAll(sel)); }
    catch (e) { return []; }
  }

  function captureBaseline(nodes) {
    if (baseline) return;
    baseline = nodes.map(function (item) {
      var els = qAll(item.sel);
      return els.map(function (el) { return { el: el, html: el.innerHTML }; });
    });
  }

  function restoreBaseline() {
    if (!baseline) return;
    baseline.forEach(function (group) {
      group.forEach(function (entry) { entry.el.innerHTML = entry.html; });
    });
  }

  function applyDict(d) {
    if (Array.isArray(d.nodes)) {
      d.nodes.forEach(function (item) {
        var els = qAll(item.sel);
        els.forEach(function (el, i) {
          var val = Array.isArray(item.text) ? item.text[i] : item.text;
          if (val == null) return;
          if (typeof val === 'string' && val.startsWith('<html>')) {
            el.innerHTML = val.slice(6);
          } else {
            el.innerHTML = val;
          }
        });
      });
    }
    if (d.keys) {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (d.keys[key] != null) el.innerHTML = d.keys[key];
      });
      document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
        var attrs = el.getAttribute('data-i18n-attr').split(',');
        attrs.forEach(function (a) {
          var key = el.getAttribute('data-i18n-' + a.trim()) || el.getAttribute('data-i18n');
          if (key && d.keys[key] != null) el.setAttribute(a.trim(), d.keys[key]);
        });
      });
    }
    if (d.title) document.title = d.title;
  }

  function setDir() {
    document.documentElement.setAttribute('lang', current);
    document.documentElement.setAttribute('dir', RTL.includes(current) ? 'rtl' : 'ltr');
  }

  function updateSwitcher() {
    var lbl = document.querySelector('.bb-lang-current');
    if (lbl) {
      var meta = SUPPORTED.find(function (l) { return l.code === current; });
      if (meta) lbl.innerHTML = '<span class="bb-lang-flag">' + meta.flag + '</span><span class="bb-lang-code">' + meta.code.toUpperCase() + '</span>';
    }
    document.querySelectorAll('.bb-lang-item').forEach(function (it) {
      it.classList.toggle('active', it.getAttribute('data-lang') === current);
    });
  }

  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      // 1) Try fetch (works on http/https)
      if (window.location.protocol !== 'file:' && typeof fetch === 'function') {
        fetch(url, { cache: 'no-cache' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(resolve).catch(reject);
        return;
      }
      // 2) Try XHR (works on some file:// setups)
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
          if (xhr.status === 0 || xhr.status === 200) {
            try { resolve(JSON.parse(xhr.responseText)); } catch (e) { reject(e); }
          } else { reject(new Error('XHR ' + xhr.status)); }
        };
        xhr.onerror = function () {
          // 3) Fallback: dynamic <script> tag (works on file:// in all browsers)
          loadViaScript(url, resolve, reject);
        };
        xhr.send();
      } catch (e) {
        loadViaScript(url, resolve, reject);
      }
    });
  }
  function loadViaScript(url, resolve, reject) {
    var cbName = '__i18n_cb_' + Date.now();
    var jsUrl = url.replace(/\.json$/, '.js');
    window[cbName] = function (data) {
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
      resolve(data);
    };
    // Try loading .json directly as script with callback wrapper
    // Fallback: try .js version that calls window.__i18n_receive(data)
    window.__i18n_receive = function (data) {
      resolve(data);
    };
    var script = document.createElement('script');
    script.src = url.replace(/\.json$/, '.js');
    script.onerror = function () {
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
      reject(new Error('Script load failed: ' + url));
    };
    document.head.appendChild(script);
  }
  function getInlineData(code) {
    var key = NS + '.' + code;
    if (window.__I18N__ && window.__I18N__[key]) return window.__I18N__[key];
    return null;
  }

  function applyLang(d, code) {
    if (!baseline && Array.isArray(d.nodes)) captureBaseline(d.nodes);
    restoreBaseline();
    applyDict(d);
    current = code;
    localStorage.setItem(STORE_KEY, code);
    setDir();
    updateSwitcher();
  }

  function load(code) {
    if (code === 'en') {
      if (baseline) restoreBaseline();
      current = 'en';
      localStorage.setItem(STORE_KEY, 'en');
      setDir();
      updateSwitcher();
      return Promise.resolve();
    }
    var inline = getInlineData(code);
    if (inline) {
      applyLang(inline, code);
      return Promise.resolve();
    }
    return fetchJSON('assets/i18n/' + NS + '.' + code + '.json')
      .then(function (d) { applyLang(d, code); })
      .catch(function (e) {
        console.warn('[i18n] load failed for', code, e);
        if (code !== 'en') return load('en');
      });
  }

  function detectInitial() {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved && SUPPORTED.find(function (l) { return l.code === saved; })) return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('zh')) return 'zh';
    var two = nav.slice(0, 2);
    return SUPPORTED.find(function (l) { return l.code === two; }) ? two : 'en';
  }

  var AVAILABLE = {
    index: ['en','zh','ja','ko','es','fr','de','ru','pt','it'],
    closecrab: ['en','zh','ja','ko','es','fr','de','ru','pt','it','ar','hi'],
    blitz: ['en','zh','ja','ko','es','fr','de','ru','pt','it']
  };
  function getAvailable() {
    var list = AVAILABLE[NS];
    if (list) return new Set(list);
    return new Set(SUPPORTED.map(function (l) { return l.code; }));
  }

  function mountSwitcher() {
    if (document.querySelector('.bb-lang-switcher')) return;
    var wrap = document.createElement('div');
    wrap.className = 'bb-lang-switcher';
    var itemsHtml = SUPPORTED.map(function (l) {
      return '<button class="bb-lang-item" data-lang="' + l.code + '" type="button">' +
        '<span class="bb-lang-flag">' + l.flag + '</span>' +
        '<span class="bb-lang-name">' + l.name + '</span>' +
        '<span class="bb-lang-mark">\u2713</span></button>';
    }).join('');
    wrap.innerHTML =
      '<button class="bb-lang-btn" type="button" aria-label="Select language">' +
        '<span class="bb-lang-current"><span class="bb-lang-flag">\uD83C\uDF10</span><span class="bb-lang-code">EN</span></span>' +
        '<span class="bb-lang-caret">\u25BE</span></button>' +
      '<div class="bb-lang-menu">' +
        '<div class="bb-lang-menu-title">\uD83C\uDF10 Language / \u8BED\u8A00 / \u8A00\u8A9E</div>' +
        itemsHtml +
        '<div class="bb-lang-foot">Manual translations \u00B7 \u4EBA\u5DE5\u7FFB\u8BD1</div></div>';
    var navActions = document.querySelector('.nav-actions');
    if (navActions) {
      wrap.classList.add('bb-lang-innav');
      navActions.insertBefore(wrap, navActions.firstChild);
    } else {
      document.body.appendChild(wrap);
    }
    var btn = wrap.querySelector('.bb-lang-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
    wrap.querySelectorAll('.bb-lang-item').forEach(function (it) {
      it.addEventListener('click', function (e) {
        e.stopPropagation();
        var c = it.getAttribute('data-lang');
        wrap.classList.remove('open');
        load(c);
      });
    });
    var avail = getAvailable();
    wrap.querySelectorAll('.bb-lang-item').forEach(function (it) {
      var c = it.getAttribute('data-lang');
      if (!avail.has(c)) it.style.display = 'none';
    });
  }
  function injectStyles() {
    if (document.getElementById('bb-lang-style')) return;
    var s = document.createElement('style');
    s.id = 'bb-lang-style';
    s.textContent =
'.bb-lang-switcher{position:fixed;top:18px;right:18px;z-index:99999;font-family:"Sora","Inter","Space Grotesk",sans-serif}' +
'.bb-lang-switcher.bb-lang-innav{position:relative;top:auto;right:auto;z-index:120;display:inline-flex;align-items:center}' +
'.nav-actions{display:flex;align-items:center;gap:12px}' +
'.bb-lang-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;background:rgba(14,6,38,.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(139,92,246,.35);border-radius:10px;color:#f3f0ff;font-size:13px;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 1px rgba(139,92,246,.08) inset}' +
'.bb-lang-btn:hover{border-color:rgba(139,92,246,.7);box-shadow:0 6px 24px rgba(139,92,246,.35),0 0 0 1px rgba(139,92,246,.18) inset;transform:translateY(-1px)}' +
'.bb-lang-current{display:inline-flex;align-items:center;gap:6px}' +
'.bb-lang-flag{font-size:15px;line-height:1}' +
'.bb-lang-code{font-family:"JetBrains Mono",monospace;font-size:12px;color:#a78bfa}' +
'.bb-lang-caret{font-size:10px;color:#a99fce;transition:transform .25s}' +
'.bb-lang-switcher.open .bb-lang-caret{transform:rotate(180deg)}' +
'.bb-lang-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:230px;background:rgba(10,4,32,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(139,92,246,.32);border-radius:12px;padding:8px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(139,92,246,.1) inset;opacity:0;visibility:hidden;transform:translateY(-8px) scale(.96);transform-origin:top right;transition:all .22s cubic-bezier(.4,0,.2,1);max-height:70vh;overflow-y:auto}' +
'.bb-lang-switcher.open .bb-lang-menu{opacity:1;visibility:visible;transform:translateY(0) scale(1)}' +
'.bb-lang-menu-title{font-size:10px;letter-spacing:.18em;color:#6a5f8c;padding:8px 12px 6px;text-transform:uppercase;font-weight:700}' +
'.bb-lang-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;background:transparent;border:0;border-radius:8px;color:#d3cce8;font-size:13px;font-weight:500;cursor:pointer;text-align:left;transition:background .15s}' +
'.bb-lang-item:hover{background:rgba(139,92,246,.14);color:#fff}' +
'.bb-lang-item .bb-lang-flag{font-size:16px}' +
'.bb-lang-item .bb-lang-name{flex:1}' +
'.bb-lang-item .bb-lang-mark{opacity:0;color:#06d6a0;font-weight:700}' +
'.bb-lang-item.active{background:rgba(139,92,246,.18);color:#fff}' +
'.bb-lang-item.active .bb-lang-mark{opacity:1}' +
'.bb-lang-foot{font-size:10px;color:#6a5f8c;text-align:center;padding:8px 12px 4px;border-top:1px solid rgba(139,92,246,.12);margin-top:4px;letter-spacing:.06em}' +
'.bb-lang-menu::-webkit-scrollbar{width:6px}' +
'.bb-lang-menu::-webkit-scrollbar-thumb{background:rgba(139,92,246,.35);border-radius:3px}' +
'[dir="rtl"] .bb-lang-switcher{right:auto;left:18px}' +
'[dir="rtl"] .bb-lang-menu{right:auto;left:0;transform-origin:top left}' +
'@media(max-width:640px){.bb-lang-switcher{top:12px;right:12px}.bb-lang-switcher.bb-lang-innav{top:auto;right:auto}.bb-lang-btn{padding:7px 10px;font-size:12px}.bb-lang-menu{min-width:200px}}';
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();
    mountSwitcher();
    current = detectInitial();
    updateSwitcher();
    load(current);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.BBI18n = { load: load, current: function () { return current; }, supported: SUPPORTED };
})();

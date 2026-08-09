/* ============================================================
   Blitzball Labs — Pricing page behaviour
   Step 1: choose a product. Step 2: show that product's tiers,
   recoloured to the product's own theme. Deep-linkable via
   ?p=blitz / #blitz so ads and emails can jump straight in.
   ============================================================ */
(function () {
  var P = window.BB_PAY;
  if (!P) return;

  var TXT = {
    en: {
      eyebrow: 'Step 1 — pick your tool',
      h1a: 'Which one are you', h1b: 'buying today?',
      lede: 'Two very different tools, one very simple deal: pay once, own it forever. Pick a product to see its pricing.',
      b_tag: 'Native AI digital audio workstation',
      c_tag: 'Terminal-native AI coding agent',
      b_m1: 'instruments', b_m2: '/ CLAP host', b_m3: 'zero-latency core',
      c_m1: 'token context', c_m2: 'GGUF or API', c_m3: 'single binary',
      once_s: 'one-time', see: 'See Blitz pricing →', see2: 'See CloseCrab pricing →',
      hint_a: 'Already bought?', hint_b: 'Enter your license key to download →',
      back: 'All products', learn: 'Product tour →',
      pro: 'Pro', team: 'Studio / Team',
      pro_sub: 'Everything, for one person, forever.',
      team_sub: 'For studios and teams — 5 seats included.',
      per_once: 'one-time · lifetime v1.x updates',
      per_team: 'one-time · 5 seats',
      buy: 'Buy', soon: 'Coming soon',
      popular: 'Best value',
      note: 'Checkout is handled by <b>Creem</b>, our Merchant of Record — we never see or store your card number. Cards, Alipay and PayPal accepted. Your license key is emailed the moment payment clears.',
      f_blitz_pro: ['Full Blitz DAW, all 261 instruments', 'Programmable synth + Faust FX chain', 'VST3 / CLAP hosting, unlimited tracks', 'Composer AI, runs on your machine', 'Commercial-use license', 'Lifetime v1.x updates, no subscription'],
      f_blitz_team: ['Everything in Pro × 5 seats', 'Shared project & preset library', 'Team Mode collaboration', 'Dedicated support channel', 'Invoice / PO billing', 'Add more seats anytime'],
      f_crab_pro: ['Full CloseCrab agent, no usage caps', 'Local GGUF models or Claude / OpenAI', '1M token context window', 'Remote control + mobile companion', 'Commercial-use license', 'Lifetime v1.x updates, no subscription'],
      f_crab_team: ['Everything in Pro × 5 seats', 'Team leaderboard & shared presence', 'Shared prompt / config library', 'Dedicated support channel', 'Invoice / PO billing', 'Add more seats anytime']
    },
    zh: {
      eyebrow: '第一步 — 选择你的工具',
      h1a: '今天你想', h1b: '买哪一个？',
      lede: '两款完全不同的工具，一个极简的规则：一次付费，永久拥有。选一个产品查看它的定价。',
      b_tag: '原生 AI 数字音频工作站',
      c_tag: '终端原生 AI 编程智能体',
      b_m1: '种乐器', b_m2: '/ CLAP 宿主', b_m3: '零延迟内核',
      c_m1: 'token 上下文', c_m2: '本地或 API', c_m3: '单文件二进制',
      once_s: '一次买断', see: '查看 Blitz 定价 →', see2: '查看 CloseCrab 定价 →',
      hint_a: '已经购买？', hint_b: '输入序列号下载 →',
      back: '全部产品', learn: '产品介绍 →',
      pro: '专业版', team: '工作室 / 团队版',
      pro_sub: '一个人的全部功能，永久有效。',
      team_sub: '面向工作室与团队，含 5 个席位。',
      per_once: '一次买断 · 终身 v1.x 更新',
      per_team: '一次买断 · 5 个席位',
      buy: '购买', soon: '即将上线',
      popular: '最划算',
      note: '收银由我们的记录商户 <b>Creem</b> 处理 —— 我们不会接触或存储你的卡号。支持信用卡、支付宝与 PayPal。付款成功后序列号会立刻发到你的邮箱。',
      f_blitz_pro: ['完整 Blitz DAW，261 种乐器全解锁', '可编程合成器 + Faust 效果链', 'VST3 / CLAP 宿主，音轨无上限', '作曲 AI，完全在本地运行', '商业使用授权', '终身 v1.x 更新，无订阅'],
      f_blitz_team: ['包含专业版全部 × 5 席位', '共享工程与预设库', '团队协作模式', '专属支持渠道', '支持发票 / 对公结算', '可随时增加席位'],
      f_crab_pro: ['完整 CloseCrab 智能体，无用量上限', '本地 GGUF 模型或 Claude / OpenAI', '100 万 token 上下文', '远程控制 + 手机端伴侣', '商业使用授权', '终身 v1.x 更新，无订阅'],
      f_crab_team: ['包含专业版全部 × 5 席位', '团队排行榜与在线状态', '共享 prompt / 配置库', '专属支持渠道', '支持发票 / 对公结算', '可随时增加席位']
    }
  };

  var FEATURES = {
    blitz: { pro: 'f_blitz_pro', team: 'f_blitz_team' },
    closecrab: { pro: 'f_crab_pro', team: 'f_crab_team' }
  };

  function t() { return TXT[P.lang()] || TXT.en; }

  var els = {
    choose: document.getElementById('choose'),
    plans: document.getElementById('plans'),
    ico: document.getElementById('pxIco'),
    name: document.getElementById('pxName'),
    tag: document.getElementById('pxTag'),
    link: document.getElementById('pxLink'),
    tiers: document.getElementById('pxTiers'),
    pay: document.getElementById('pxPay'),
    back: document.getElementById('pxBack')
  };

  var currentProduct = null;

  function renderStaticText() {
    var d = t();
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var k = el.getAttribute('data-t');
      if (k === 'note') { if (d.note) el.innerHTML = d.note; return; }
      if (d[k] != null) el.textContent = d[k];
    });
    var hint = document.querySelector('.px-hint');
    if (hint) {
      hint.innerHTML = d.hint_a + ' <a href="download.html">' + d.hint_b + '</a>';
    }
  }

  function renderPayMethods() {
    var L = P.lang();
    els.pay.innerHTML = P.PAY_METHODS.map(function (m) {
      return '<span class="px-paym">' + m.icon + ' <b>' +
        (L === 'zh' ? m.name_zh : m.name_en) + '</b></span>';
    }).join('');
  }

  /* 150 → "150", 29.99 → "29<sup>.99</sup>" so cents stay legible without
     shouting as loudly as the dollars. */
  function priceHTML(usd) {
    var n = Number(usd);
    if (!isFinite(n)) return String(usd);
    if (n % 1 === 0) return String(n);
    var parts = n.toFixed(2).split('.');
    return parts[0] + '<sup class="px-cents">.' + parts[1] + '</sup>';
  }

  function tierCard(prod, tierKey, featured) {
    var d = t();
    var tier = prod.tiers[tierKey];
    if (!tier) return '';
    var url = P.checkoutURL(prod.id, tierKey);
    var feats = (d[FEATURES[prod.id][tierKey]] || []).map(function (f) {
      return '<li>' + f + '</li>';
    }).join('');
    var label = tierKey === 'pro' ? d.pro : d.team;
    var sub = tierKey === 'pro' ? d.pro_sub : d.team_sub;
    var per = tierKey === 'pro' ? d.per_once : d.per_team;

    return '' +
      '<div class="px-tier' + (featured ? ' feat' : '') + '">' +
        (featured ? '<div class="px-badge">' + d.popular + '</div>' : '') +
        '<h3>' + label + '</h3>' +
        '<div class="px-sub">' + sub + '</div>' +
        '<div class="px-price"><small>$</small>' + priceHTML(tier.usd) + '</div>' +
        '<div class="px-per">' + per + '</div>' +
        '<ul>' + feats + '</ul>' +
        '<button class="px-buy' + (featured ? '' : ' sec') + '"' +
          ' data-product="' + prod.id + '" data-tier="' + tierKey + '"' +
          (url ? '' : ' disabled') + '>' +
          (url ? d.buy + ' ' + prod.name + (tierKey === 'team' ? ' Team' : ' Pro')
               : d.soon) +
        '</button>' +
      '</div>';
  }

  function showProduct(id, push) {
    var prod = P.PRODUCTS[id];
    if (!prod) return;
    currentProduct = id;
    document.body.setAttribute('data-theme', prod.theme);

    var d = t();
    els.ico.textContent = prod.icon;
    els.name.textContent = prod.name;
    els.tag.textContent = P.lang() === 'zh' ? prod.tagline_zh : prod.tagline_en;
    els.link.href = prod.page;
    els.link.textContent = d.learn;

    els.tiers.innerHTML = tierCard(prod, 'pro', true) + tierCard(prod, 'team', false);
    renderPayMethods();

    els.choose.hidden = true;
    els.plans.hidden = false;

    document.querySelectorAll('.px-switch button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-goto') === id);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (push !== false) history.replaceState(null, '', '?p=' + id);
  }

  function showChooser() {
    currentProduct = null;
    document.body.setAttribute('data-theme', 'hub');
    els.plans.hidden = true;
    els.choose.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  }

  document.querySelectorAll('.px-card').forEach(function (card) {
    card.addEventListener('click', function () {
      showProduct(card.getAttribute('data-product'));
    });
  });
  document.querySelectorAll('.px-switch button').forEach(function (b) {
    b.addEventListener('click', function () { showProduct(b.getAttribute('data-goto')); });
  });
  els.back.addEventListener('click', showChooser);

  // Buy buttons are rendered dynamically → delegate.
  els.tiers.addEventListener('click', function (e) {
    var btn = e.target.closest('.px-buy');
    if (!btn || btn.disabled) return;
    P.goCheckout(btn.getAttribute('data-product'), btn.getAttribute('data-tier'));
  });

  // Deep link: ?p=blitz or #closecrab
  var initial = (new URLSearchParams(location.search).get('p') ||
                 location.hash.replace('#', '')).toLowerCase();
  renderStaticText();
  if (P.PRODUCTS[initial]) showProduct(initial, false);

  // Re-render when the language toggle flips <html lang>.
  new MutationObserver(function () {
    renderStaticText();
    if (currentProduct) showProduct(currentProduct, false);
    else renderPayMethods();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

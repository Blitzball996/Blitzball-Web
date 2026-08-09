/* ============================================================
   Blitzball Labs — Payment & product configuration
   Single source of truth for checkout links and pricing.
   Edit ONLY this file when a price or Creem link changes.
   ============================================================ */
(function (w) {
  var API = (function () {
    var dev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === 'file:';
    return dev ? 'http://localhost:8090' : '';
  })();

  /* Creem hosted-checkout links, per product per tier.
     '' = not configured yet → the UI shows a "coming soon" notice
     instead of a dead link. */
  var LINKS = {
    blitz: {
      pro: 'https://www.creem.io/payment/prod_7MP9FYacUK2RwtfD1LI3oe',
      team: ''
    },
    closecrab: {
      pro: 'https://www.creem.io/payment/prod_52UST52fNxBYDbP1fqrBCJ',
      team: ''
    }
  };

  var PRODUCTS = {
    blitz: {
      id: 'blitz',
      name: 'Blitz DAW',
      tagline_en: 'Native AI digital audio workstation',
      tagline_zh: '原生 AI 数字音频工作站',
      page: 'blitz.html',
      css: 'assets/css/pricing-blitz.css',
      theme: 'blitz',
      accent: '#8b5cf6',
      accent2: '#f72585',
      accent3: '#4cc9f0',
      icon: '♪',
      prefix: 'BDPR',
      tiers: {
        pro: { usd: 150, kind: 'once' },
        team: { usd: 599, kind: 'once', seats: 5 }
      }
    },
    closecrab: {
      id: 'closecrab',
      name: 'CloseCrab',
      tagline_en: 'Terminal-native AI coding agent',
      tagline_zh: '终端原生 AI 编程智能体',
      page: 'closecrab.html',
      css: 'assets/css/pricing-closecrab.css',
      theme: 'closecrab',
      accent: '#00ffd5',
      accent2: '#39ff7a',
      accent3: '#ff2e88',
      icon: '⌗',
      prefix: 'CCPR',
      tiers: {
        /* CloseCrab Pro is priced at 29.99 on Creem — keep these two in sync */
        pro: { usd: 29.99, kind: 'once' },
        team: { usd: 119.99, kind: 'once', seats: 5 }
      }
    }
  };

  /* Supported payment methods. WeChat Pay is NOT supported by our
     provider, so it is deliberately absent — do not re-add it. */
  var PAY_METHODS = [
    { icon: '💳', name_en: 'Visa · Mastercard · Amex', name_zh: 'Visa · Mastercard · Amex' },
    { icon: '🟦', name_en: 'Alipay', name_zh: '支付宝' },
    { icon: '🅿️', name_en: 'PayPal', name_zh: 'PayPal' }
  ];

  function lang() {
    var l = localStorage.getItem('bb_lang') || document.documentElement.lang || 'en';
    return l === 'zh' ? 'zh' : 'en';
  }

  function checkoutURL(productId, tier) {
    var p = LINKS[productId];
    return (p && p[tier]) || '';
  }

  /* Send the buyer to Creem, remembering which product they bought so the
     download page can pre-select it when they come back. */
  function goCheckout(productId, tier) {
    var url = checkoutURL(productId, tier);
    if (!url) {
      alert(lang() === 'zh'
        ? '该商品的支付链接还未上线，请稍后再试或邮件联系 929115409@qq.com。'
        : 'Checkout for this product is not live yet. Please try later or email 929115409@qq.com.');
      return false;
    }
    try {
      localStorage.setItem('bb_pending_product', productId);
      localStorage.setItem('bb_pending_tier', tier);
    } catch (e) { /* private mode — non-fatal */ }
    location.href = url;
    return true;
  }

  w.BB_PAY = {
    API: API,
    LINKS: LINKS,
    PRODUCTS: PRODUCTS,
    PAY_METHODS: PAY_METHODS,
    lang: lang,
    checkoutURL: checkoutURL,
    goCheckout: goCheckout
  };
})(window);

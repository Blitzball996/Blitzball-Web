/* ============================================================
   Blitzball Labs — Licensed download flow
   Posts the license key to /api/download/claim, then renders
   short-lived signed links and auto-starts the build that
   matches the visitor's OS.
   ============================================================ */
(function () {
  var P = window.BB_PAY;
  if (!P) return;

  var TXT = {
    en: {
      eyebrow: 'Licensed download', h1a: 'Your key.', h1b: 'Your build.',
      lede: "Enter the license key we emailed you after checkout. We'll unlock the installers for every platform — the download starts automatically.",
      paid_t: 'Payment received — thank you!',
      paid_s: 'Your license key is on its way by email (usually within a minute). Paste it below to start the download.',
      lab_key: 'License key', lab_mail: 'Email used at checkout', optional: '(recommended)',
      unlock: 'Unlock my download', unlocked: 'unlocked',
      ok_s: 'Your download is starting. Pick another platform below if you need a different build.',
      small_a: 'Lost your key?', small_b: 'Sign in to your account',
      small_c: "— every key you've bought is listed there.",
      next_t: 'Next step',
      next_s: 'Install, launch the app, and paste the same license key into the activation box. One key activates one device.',
      exp: 'These links expire in 30 minutes. Re-enter your key any time to get fresh ones.',
      starting: 'Starting download…',
      e_format: 'That does not look like a valid key. It should be 20 characters, like BDPR-7K3P-9WXM-2QH4-RT8C.',
      e_notfound: 'We could not find that license key. Check for typos, or contact 929115409@qq.com if you just paid and have not received a key.',
      e_revoked: 'This license has been revoked. Please contact 929115409@qq.com.',
      e_mail: 'That key exists, but the email does not match the one used at checkout.',
      e_rate: 'Too many attempts. Please wait a minute and try again.',
      e_net: 'Could not reach our servers. Check your connection and try again.'
    },
    zh: {
      eyebrow: '凭序列号下载', h1a: '你的序列号。', h1b: '你的安装包。',
      lede: '输入付款后发送到你邮箱的序列号，我们会为你解锁全部平台的安装包 —— 下载会自动开始。',
      paid_t: '已收到付款，感谢支持！',
      paid_s: '序列号正在通过邮件发送给你（通常一分钟内到达）。把它粘贴到下面即可开始下载。',
      lab_key: '序列号', lab_mail: '付款时使用的邮箱', optional: '（建议填写）',
      unlock: '解锁我的下载', unlocked: '已解锁',
      ok_s: '下载即将自动开始。需要其他平台的版本，请在下方选择。',
      small_a: '找不到序列号？', small_b: '登录你的账号',
      small_c: '—— 你购买过的所有序列号都在那里。',
      next_t: '下一步',
      next_s: '安装并启动软件，把同一个序列号粘贴到激活框中。一码激活一台设备。',
      exp: '这些下载链接 30 分钟后失效，随时重新输入序列号即可获取新链接。',
      starting: '开始下载…',
      e_format: '这看起来不是有效的序列号。序列号为 20 位字符，例如 BDPR-7K3P-9WXM-2QH4-RT8C。',
      e_notfound: '找不到该序列号。请检查是否输入有误；如果你刚刚付款但没收到序列号，请联系 929115409@qq.com。',
      e_revoked: '该序列号已被封禁，请联系 929115409@qq.com。',
      e_mail: '序列号存在，但邮箱与付款时使用的邮箱不一致。',
      e_rate: '尝试次数过多，请稍等一分钟后重试。',
      e_net: '无法连接服务器，请检查网络后重试。'
    }
  };

  function t() { return TXT[P.lang()] || TXT.en; }

  var form = document.getElementById('dlgForm');
  var keyIn = document.getElementById('dlgKey');
  var mailIn = document.getElementById('dlgEmail');
  var go = document.getElementById('dlgGo');
  var spin = go.querySelector('.dlg-spin');
  var errBox = document.getElementById('dlgErr');
  var okBox = document.getElementById('dlgOk');
  var paidBox = document.getElementById('dlgPaid');
  var filesBox = document.getElementById('dlgFiles');
  var expBox = document.getElementById('dlgExp');
  var okProd = document.getElementById('dlgOkProd');

  var ERRORS = {
    BAD_KEY_FORMAT: 'e_format', KEY_NOT_FOUND: 'e_notfound',
    KEY_REVOKED: 'e_revoked', EMAIL_MISMATCH: 'e_mail'
  };
  var ICONS = { windows: '⊞', macos: '⌘', linux: '◯' };
  var NAMES = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  function renderText() {
    var d = t();
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var k = el.getAttribute('data-t');
      if (d[k] != null) el.textContent = d[k];
    });
    var s = document.querySelector('.dlg-small');
    if (s) s.innerHTML = d.small_a + ' <a href="login.html">' + d.small_b + '</a> ' + d.small_c;
  }

  /* Format as the user types: BDPR-XXXX-XXXX-XXXX-XXXX */
  keyIn.addEventListener('input', function () {
    var raw = keyIn.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 20);
    var out = [];
    for (var i = 0; i < raw.length; i += 4) out.push(raw.slice(i, i + 4));
    keyIn.value = out.join('-');
    errBox.hidden = true;
  });

  function detectOS() {
    var ua = navigator.userAgent;
    if (/Windows|Win64|Win32/i.test(ua)) return 'windows';
    if (/Mac OS X|Macintosh/i.test(ua)) return 'macos';
    if (/Linux|X11/i.test(ua)) return 'linux';
    return 'windows';
  }

  /* Theme the page to the product the key belongs to. */
  function themeFor(product) {
    var fam = (product || '').slice(0, 2).toUpperCase();
    var id = fam === 'CC' ? 'closecrab' : 'blitz';
    var prod = P.PRODUCTS[id];
    document.body.setAttribute('data-theme', prod.theme);
    document.getElementById('dlgOkIco').textContent = prod.icon;
    return prod;
  }

  function showError(code) {
    var d = t();
    errBox.textContent = d[ERRORS[code] || 'e_net'] || d.e_net;
    errBox.hidden = false;
  }

  function busy(on) {
    go.disabled = on;
    spin.hidden = !on;
    go.querySelector('.dlg-go-t').textContent = on ? t().starting : t().unlock;
  }

  function triggerDownload(url) {
    // A hidden iframe starts the download without navigating away, so the
    // buyer keeps the page (and the other platform links) in front of them.
    var f = document.createElement('iframe');
    f.style.display = 'none';
    f.src = url;
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 90000);
  }

  function renderFiles(data) {
    var d = t();
    var prod = themeFor(data.product);
    okProd.textContent = data.product_name || prod.name;

    var mine = detectOS();
    filesBox.innerHTML = data.files.map(function (f) {
      var auto = f.platform === mine;
      return '<a class="dlg-file' + (auto ? ' auto' : '') + '" href="' +
        P.API + f.url + '" data-platform="' + f.platform + '">' +
        '<span class="dlg-file-ico">' + (ICONS[f.platform] || '⬇') + '</span>' +
        '<span class="dlg-file-txt">' +
          '<span class="dlg-file-name">' + (NAMES[f.platform] || f.platform) + '</span>' +
          '<span class="dlg-file-meta">' + f.label + ' · ' + f.size + '</span>' +
        '</span><span class="dlg-file-arrow">↓</span></a>';
    }).join('');

    expBox.textContent = d.exp;
    form.hidden = true;
    paidBox.hidden = true;
    okBox.hidden = false;
    renderText();

    // Auto-start the build for this OS.
    var auto = filesBox.querySelector('.dlg-file.auto') || filesBox.querySelector('.dlg-file');
    if (auto) setTimeout(function () { triggerDownload(auto.href); }, 700);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.hidden = true;
    var key = keyIn.value.trim();
    if (key.replace(/-/g, '').length !== 20) { showError('BAD_KEY_FORMAT'); return; }

    busy(true);
    fetch(P.API + '/api/download/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key, email: mailIn.value.trim() })
    }).then(function (r) {
      if (r.status === 429) throw new Error('RATE');
      return r.json().then(function (j) { return { status: r.status, body: j }; });
    }).then(function (res) {
      busy(false);
      if (res.body && res.body.ok) {
        try { localStorage.setItem('bb_last_key', key); } catch (e2) {}
        renderFiles(res.body);
      } else {
        showError((res.body && res.body.error) || 'NET');
      }
    }).catch(function (err) {
      busy(false);
      showError(err && err.message === 'RATE' ? 'RATE_LIMIT' : 'NET');
      if (err && err.message === 'RATE') {
        errBox.textContent = t().e_rate;
      }
    });
  });

  /* Coming back from Creem: show the thank-you banner and pre-theme the page
     to the product they just bought. */
  (function initReturn() {
    var q = new URLSearchParams(location.search);
    var paid = q.get('paid') === '1' || q.get('status') === 'success' ||
               q.has('checkout_id') || q.has('order_id');
    var pending = q.get('p');
    try { pending = pending || localStorage.getItem('bb_pending_product'); } catch (e) {}

    if (pending && P.PRODUCTS[pending]) {
      document.body.setAttribute('data-theme', P.PRODUCTS[pending].theme);
      keyIn.placeholder = P.PRODUCTS[pending].prefix + '-XXXX-XXXX-XXXX-XXXX';
    }
    if (paid) {
      paidBox.hidden = false;
      try { localStorage.removeItem('bb_pending_product'); } catch (e) {}
    }
    // Pre-fill a key passed by email link, e.g. download.html?key=...
    var k = q.get('key');
    if (k) { keyIn.value = k; keyIn.dispatchEvent(new Event('input')); }
  })();

  renderText();
  new MutationObserver(renderText).observe(document.documentElement,
    { attributes: true, attributeFilter: ['lang'] });
})();

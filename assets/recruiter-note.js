/* Easter egg: a short note for fellow recruiters, shown when the photo is clicked. Loaded lazily. */
(function () {
  if (window.__note) return;

  var EMAIL = 'matthieu.chaff@gmail.com';

  function track(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: title, event: true });
      }
    } catch (e) {}
  }

  var css = '' +
    '.rn-back{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,10,10,.72);opacity:0;transition:opacity .2s ease-out;}' +
    '.rn-back[hidden]{display:none;}' +
    '.rn-back.rn-on{opacity:1;}' +
    '.rn-card{width:100%;max-width:460px;max-height:calc(100vh - 40px);overflow-y:auto;background:#232324;border:1px solid #333334;border-radius:14px;padding:26px 26px 22px;color:#e8e8e8;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.5);transform:translateY(8px) scale(.98);transition:transform .25s ease-out;}' +
    '.rn-on .rn-card{transform:none;}' +
    '.rn-card:focus{outline:0;}' +
    '@keyframes rnIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '.rn-card>*{animation:rnIn .4s ease-out both;animation-delay:calc(var(--i,0)*80ms + 120ms);}' +
    '.rn-tag{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8a8a8a;margin:0 0 8px;font-weight:600;}' +
    '.rn-h{font-size:22px;line-height:1.25;font-weight:700;margin:0 0 14px;letter-spacing:-.01em;}' +
    '.rn-p{font-size:15px;line-height:1.6;margin:0 0 12px;color:#dcdcdc;}' +
    '.rn-p b{color:#fff;font-weight:600;}' +
    '.rn-sub{font-size:13px;color:#9a9a9a;margin:4px 0 6px;}' +
    '.rn-list{margin:0 0 14px;padding-left:18px;font-size:14.5px;line-height:1.55;color:#cfcfcf;}' +
    '.rn-list li{margin:0 0 4px;}' +
    '.rn-sign{font-size:14px;color:#9a9a9a;margin:0 0 16px;}' +
    '.rn-btn{font:inherit;font-size:14px;font-weight:600;color:#1c1c1d;background:#e8e8e8;border:0;border-radius:9px;padding:10px 16px;cursor:pointer;}' +
    '.rn-btn:hover{background:#fff;}' +
    '.rn-card a{color:#8ab4ff;overflow-wrap:anywhere;}' +
    '@media (max-width:480px){.rn-card{padding:20px 18px 18px;}.rn-h{font-size:20px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var back, card, lastFocus, closing = false, closeTimer = null, n = 0;

  function el(tag, cls, text) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text != null) x.textContent = text;
    x.style.setProperty('--i', n++);
    return x;
  }

  function build() {
    card.innerHTML = '';
    n = 0;
    card.appendChild(el('p', 'rn-tag', 'A note for my fellow recruiters'));
    card.appendChild(el('h2', 'rn-h', 'Will AI replace us? Not tomorrow.'));

    var p1 = el('p', 'rn-p');
    p1.appendChild(document.createTextNode('My completely unscientific estimate: '));
    p1.appendChild(Object.assign(document.createElement('b'), { textContent: '47%' }));
    p1.appendChild(document.createTextNode('. Risky, not fatal. People still hire people, and nobody negotiates an offer with a chatbot.'));
    card.appendChild(p1);

    var p2 = el('p', 'rn-p');
    p2.appendChild(document.createTextNode('But here is the catch: '));
    p2.appendChild(Object.assign(document.createElement('b'), { textContent: 'the AI will not take your job, a recruiter using it will.' }));
    p2.appendChild(document.createTextNode(' Those running LLMs for sharp, precise searches will quietly eat the ones who do not.'));
    card.appendChild(p2);

    card.appendChild(el('p', 'rn-sub', 'Start this week:'));
    var ul = el('ul', 'rn-list');
    ['Intake calls → search briefs and Boolean strings.',
     'Let the model screen the long list.',
     'Outreach that does not read like outreach.'].forEach(function (t) {
      var li = document.createElement('li'); li.textContent = t; ul.appendChild(li);
    });
    card.appendChild(ul);

    var p3 = el('p', 'rn-p');
    p3.appendChild(document.createTextNode('We are in this together. Want to compare notes? '));
    var a = document.createElement('a'); a.href = 'mailto:' + EMAIL; a.textContent = EMAIL;
    p3.appendChild(a);
    card.appendChild(p3);

    card.appendChild(el('p', 'rn-sign', '— Matthieu'));

    var btn = el('button', 'rn-btn', 'Challenge accepted');
    btn.type = 'button';
    btn.addEventListener('click', close);
    card.appendChild(btn);
    return btn;
  }

  function ensureDom() {
    if (back) return;
    back = document.createElement('div');
    back.className = 'rn-back';
    back.hidden = true;
    back.setAttribute('role', 'dialog');
    back.setAttribute('aria-modal', 'true');
    back.setAttribute('aria-label', 'A note for fellow recruiters');
    card = document.createElement('div');
    card.className = 'rn-card';
    card.tabIndex = -1;
    back.appendChild(card);
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    document.body.appendChild(back);
  }

  function isOpen() { return back && !back.hidden && !closing; }

  function setInert(on) {
    var w = document.querySelector('.wrap');
    if (!w) return;
    try { w.inert = on; } catch (e) {}
  }

  function open() {
    if (isOpen()) return;
    ensureDom();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    closing = false;
    lastFocus = document.activeElement;
    var btn = build();
    back.hidden = false;
    void back.offsetWidth;
    back.classList.add('rn-on');
    document.body.style.overflow = 'hidden';
    setInert(true);
    try { card.focus({ preventScroll: true }); } catch (e) {}
    track('recruiter-note-open', 'Recruiter note opened');
  }

  function close() {
    if (!isOpen()) return;
    closing = true;
    back.classList.remove('rn-on');
    document.body.style.overflow = '';
    setInert(false);
    closeTimer = setTimeout(function () { back.hidden = true; closing = false; closeTimer = null; }, 230);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  document.addEventListener('keydown', function (e) {
    if (isOpen() && e.key === 'Escape') { e.preventDefault(); close(); }
  });

  window.__note = { open: open, close: close };
})();

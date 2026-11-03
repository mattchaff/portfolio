/* Hidden terminal — easter egg. Loaded lazily from index.html. */
(function () {
  if (window.__terminal) return;

  var EMAIL = 'matthieu.chaff@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/matthieu-chaffanjon-a3568a98/';
  var CV = 'assets/Matthieu_Chaffanjon_CV.pdf';
  var PS = 'visitor@matthieu:~$';
  var VISIBLE = ['help', 'whoami', 'experience', 'cases', 'favorites', 'fun', 'contact', 'cv', 'linkedin', 'clear', 'exit'];

  function track(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: title, event: true });
      }
    } catch (e) {}
  }

  var css = '' +
    '.tm-overlay{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;background:#0a0b0a;color:#d6dad6;font-family:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;}' +
    '.tm-overlay[hidden]{display:none;}' +
    '.tm-overlay::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.022) 0,rgba(255,255,255,.022) 1px,transparent 1px,transparent 3px);}' +
    '.tm-overlay{opacity:0;transition:opacity .35s ease-out;will-change:opacity;}' +
    '.tm-overlay.tm-on{opacity:1;}' +
    '.tm-overlay .tm-bar,.tm-overlay .tm-inner{opacity:0;transition:opacity .25s ease-out .1s;}' +
    '.tm-overlay.tm-on .tm-bar,.tm-overlay.tm-on .tm-inner{opacity:1;}' +
    '.wrap{transition:opacity .3s ease-out;}' +
    'body.tm-active .wrap{opacity:0;}' +
    '.tm-bar{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #1d231e;font-size:12px;color:#7d867f;}' +
    '.tm-title{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.tm-x{font:inherit;font-size:12px;color:#aab3ac;background:transparent;border:1px solid #2a312c;border-radius:4px;padding:3px 11px;cursor:pointer;}' +
    '.tm-x:hover{border-color:#7ee787;color:#fff;}' +
    '.tm-inner{flex:1;min-height:0;display:flex;flex-direction:column;width:100%;max-width:880px;margin:0 auto;}' +
    '.tm-out{flex:1;overflow-y:auto;padding:20px 16px 6px;font-size:14px;line-height:1.65;}' +
    '.tm-line{white-space:pre-wrap;word-break:break-word;min-height:1.65em;}' +
    '.tm-line a{color:#8ab4ff;text-decoration:none;border-bottom:1px solid rgba(138,180,255,.4);}' +
    '.tm-line a:hover{border-bottom-color:#8ab4ff;}' +
    '.tm-dim{color:#7d867f;}' +
    '.tm-ok{color:#7ee787;}' +
    '.tm-err{color:#ff9a9a;}' +
    '.tm-ps{color:#7ee787;}' +
    '.tm-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px 0;}' +
    '.tm-chip{font:inherit;font-size:12px;color:#aab3ac;background:transparent;border:1px solid #2a312c;border-radius:999px;padding:3px 11px;cursor:pointer;}' +
    '.tm-chip:hover{border-color:#7ee787;color:#fff;}' +
    '.tm-row{display:flex;align-items:center;gap:8px;padding:12px 16px 18px;font-size:14px;}' +
    '.tm-input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#f2f2f2;font:inherit;font-size:16px;caret-color:#7ee787;padding:0;}' +
    '@media (min-width:600px){.tm-input{font-size:14px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var overlay, out, input, lastFocus;
  var history = [], hpos = 0;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'tm-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Terminal mode');
    overlay.innerHTML =
      '<div class="tm-bar"><span class="tm-title">visitor@matthieu: ~ (terminal mode)</span><button class="tm-x" type="button" aria-label="Back to the website">exit</button></div>' +
      '<div class="tm-inner">' +
        '<div class="tm-out" aria-live="polite"></div>' +
        '<div class="tm-chips"></div>' +
        '<form class="tm-row"><span class="tm-ps">$</span><input class="tm-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Terminal input"></form>' +
      '</div>';
    document.body.appendChild(overlay);
    out = overlay.querySelector('.tm-out');
    input = overlay.querySelector('.tm-input');

    var chips = overlay.querySelector('.tm-chips');
    ['help', 'cases', 'favorites', 'fun', 'contact', 'exit'].forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tm-chip'; b.textContent = c;
      b.addEventListener('click', function () { run(c); if (!isTouch()) input.focus(); });
      chips.appendChild(b);
    });

    overlay.querySelector('.tm-x').addEventListener('click', close);
    out.addEventListener('click', function () {
      if (isTouch()) return;
      if (!window.getSelection || String(window.getSelection()) === '') input.focus();
    });
    overlay.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      run(v);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length && hpos > 0) { hpos--; input.value = history[hpos]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hpos < history.length - 1) { hpos++; input.value = history[hpos]; }
        else { hpos = history.length; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        var v = input.value.trim().toLowerCase();
        if (!v) return;
        var m = VISIBLE.filter(function (c) { return c.indexOf(v) === 0; });
        if (m.length === 1) input.value = m[0];
      }
    });
  }

  function isTouch() { return !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches); }
  var closing = false, closeTimer = null;
  function isOpen() { return overlay && !overlay.hidden && !closing; }

  function open() {
    if (isOpen()) return;
    ensureDom();
    lastFocus = document.activeElement;
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    closing = false;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('tm-on');
    document.body.classList.add('tm-active');
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    track('terminal-open', 'Terminal opened');
    if (!out.childNodes.length) welcome();
    if (!isTouch()) input.focus();
  }

  function setPageInert(on) {
    var w = document.querySelector('.wrap');
    if (!w) return;
    try { w.inert = on; } catch (e) {}
    if (on) w.setAttribute('aria-hidden', 'true'); else w.removeAttribute('aria-hidden');
  }

  function close() {
    if (!isOpen()) return;
    closing = true;
    overlay.classList.remove('tm-on');
    document.body.classList.remove('tm-active');
    document.body.style.overflow = '';
    setPageInert(false);
    closeTimer = setTimeout(function () {
      overlay.hidden = true; closing = false; closeTimer = null;
    }, 380);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  /* ---------- output helpers ---------- */
  // parts: strings, or {href, text}, or {cls, text}
  function print() {
    var line = document.createElement('div');
    line.className = 'tm-line';
    Array.prototype.slice.call(arguments).forEach(function (p) {
      if (typeof p === 'string') {
        line.appendChild(document.createTextNode(p));
      } else if (p && p.href) {
        var a = document.createElement('a');
        a.href = p.href; a.textContent = p.text;
        if (/^https?:/.test(p.href)) { a.target = '_blank'; a.rel = 'noopener'; }
        line.appendChild(a);
      } else if (p) {
        var s = document.createElement('span');
        if (p.cls) s.className = p.cls;
        s.textContent = p.text;
        line.appendChild(s);
      }
    });
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  function blank() { print(''); }

  function welcome() {
    print({ cls: 'tm-dim', text: 'matthieu.sh \u2014 terminal mode' });
    blank();
    print({ cls: 'tm-ps', text: PS + ' ' }, 'whoami');
    cmdWhoami();
    blank();
    print({ cls: 'tm-dim', text: isTouch()
      ? "Tap a button below, or tap the $ line to type. 'exit' goes back to the website."
      : "Type 'help' for commands. Type 'exit' (or press Esc) to go back to the website." });
    print({ cls: 'tm-dim', text: "Psst: try 'cases', 'favorites' or 'fun'." });
    blank();
  }

  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

  /* ---------- commands ---------- */
  function cmdHelp() {
    function group(title, rows) {
      print({ cls: 'tm-dim', text: title });
      rows.forEach(function (r) { print('  ', { cls: 'tm-ok', text: pad(r[0], 12) }, r[1]); });
    }
    group('the work', [
      ['whoami', 'who I am'],
      ['experience', 'where I have worked'],
      ['cases', 'how some searches really went'],
      ['contact', 'how to reach me'],
      ['cv', 'open my CV'],
      ['linkedin', 'my LinkedIn profile']
    ]);
    blank();
    group('off the clock', [
      ['favorites', 'movies, games, places'],
      ['fun', 'a few stories']
    ]);
    blank();
    group('terminal', [
      ['help', 'show this list'],
      ['clear', 'clear the screen'],
      ['exit', 'back to the website']
    ]);
  }

  function cmdWhoami() {
    print('Matthieu Chaffanjon');
    print('Senior Tech Recruiter specialised in AI Research and Engineering hiring.');
    print('Direct partnership with founders, CTOs and hiring managers.');
    print({ cls: 'tm-dim', text: 'Based in Paris, France.' });
  }

  function cmdExperience() {
    print({ cls: 'tm-ok', text: pad('Lity', 15) }, 'led the Data/AI practice  ', { href: 'https://lity.so', text: 'lity.so' });
    print({ cls: 'tm-ok', text: pad('Bluecoders', 15) }, 'independent  ', { href: 'https://bluecoders.com', text: 'bluecoders.com' });
    print({ cls: 'tm-ok', text: pad('Axioma Search', 15) }, 'independent  ', { href: 'https://www.axiomasearch.com/', text: 'axiomasearch.com' });
    blank();
    print({ cls: 'tm-dim', text: '30+ key accounts opened.' });
  }

  /* ---------- cases ---------- */
  var CASES = [
    { key: 'whitecircle', id: 'white-circle', title: 'White Circle', tag: 'AI safety startup · 2 hires in about a month',
      context: 'Inbound request in December 2025 from an early-stage AI safety and security company that had just landed in France.',
      challenge: 'Two urgent, high-bar roles to fill at once: a senior data engineer and an ML researcher, in a fast-paced international environment.',
      how: 'Both people who ended up joining were among the first five candidates I contacted.',
      result: 'Both hired in January 2026, about a month after kick-off.' },
    { key: 'qwant', id: 'qwant', title: 'Qwant', tag: 'one cold email → 2 hires',
      context: 'Qwant, the French search engine, was not a client. I opened the account myself.',
      challenge: 'Getting through to a CTO with no existing relationship.',
      how: 'I cold-emailed the company with the anonymised CV of an applied scientist. He was hired. A second, more targeted search followed for a data scientist, and I ran the whole account, working directly with the CTO, through to closing.',
      result: 'Two hires for the ML team, and a new client from a single cold email.' },
    { key: 'presti', id: 'presti', title: 'Presti AI', tag: 'YC-backed AI startup · Founding AI Scientist',
      context: 'A colleague had opened the relationship with the CEO. The searches covered sales, ops and AI.',
      challenge: 'A Founding AI Scientist with a PhD in computer vision: academic depth and a startup mindset in the same person.',
      how: 'I took the AI search and found a very high-level profile.',
      result: 'Hired in about a month.' },
    { key: 'swaap', id: 'swaap', title: 'Swaap Labs', tag: 'Rust engineers, in Paris',
      context: 'A long-standing client from my time at Lity: a decentralised finance protocol.',
      challenge: 'Good Rust engineers are rare in Paris.',
      how: 'I co-designed the technical test with the CEO. The first candidate I sent was hired, within three weeks.',
      result: 'Six months later they came back for a second Rust engineer, hired in a month.' },
    { key: 'hector', id: 'hector', title: 'Hector', tag: 'two “very hard” roles in 2 months',
      context: 'Inbound request from a pre-seed fintech app, still in stealth mode, building its core team. They were already working with RPO providers.',
      challenge: 'Success-based mandate on two roles they considered very hard to fill, and nothing alike: a lead designer and a security engineer.',
      how: 'Full 360° campaign management, working closely with the hiring managers throughout.',
      result: 'Both roles filled in about two months, well outside my usual AI and data scope.' },
    { key: 'sherpas', id: 'sherpas', title: 'Les Sherpas', tag: 'urgent CTO replacement',
      context: 'The CEO of this EdTech company needed to replace his CTO urgently. We worked side by side.',
      challenge: 'A demanding six-step process, then a tough salary negotiation at the very end.',
      funnel: '~100 contacted  →  ~10 in process  →  1 hired',
      how: 'I contacted around a hundred candidates and sent about ten into the process. The one who got through was the most resilient across all six steps.',
      result: 'CTO hired in about six weeks, after a negotiation that was not easy but closed.' },
    { key: 'lifen', id: 'lifen', title: 'Lifen', tag: 'long-term partnership',
      context: 'A long-standing client relationship dating back to my time at Lity, built on trust with someone I already knew from a previous firm.',
      challenge: 'A software engineer search with a difficult process and a difficult salary negotiation.',
      how: 'I stayed on both until the offer was accepted.',
      result: 'A great hire, and it opened the door to further placements at Lifen.' }
  ];

  function norm(x) { return String(x || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

  function cmdCases(arg) {
    var a = norm(arg);
    if (a) {
      var c = CASES.filter(function (x) { return x.key.indexOf(a) === 0 || a.indexOf(x.key) !== -1; })[0];
      if (!c) { print({ cls: 'tm-err', text: 'no such case: ' + arg }, { cls: 'tm-dim', text: "  (type 'cases')" }); return; }
      track('terminal-case-' + c.id, 'Terminal case: ' + c.title);
      print({ cls: 'tm-ok', text: c.title }, { cls: 'tm-dim', text: '  — ' + c.tag });
      blank();
      [['context', c.context], ['challenge', c.challenge]].forEach(function (r) {
        print({ cls: 'tm-dim', text: r[0] }); print(r[1]); blank();
      });
      print({ cls: 'tm-dim', text: 'what I did' }); print(c.how);
      if (c.funnel) { blank(); print({ cls: 'tm-ok', text: c.funnel }); }
      blank();
      print({ cls: 'tm-dim', text: 'result' }); print(c.result);
      return;
    }
    print({ cls: 'tm-dim', text: "How some searches really went. Type 'cases <name>' for the story." });
    blank();
    CASES.forEach(function (x) {
      print('  ', { cls: 'tm-ok', text: pad(x.id, 14) }, { cls: 'tm-dim', text: x.tag });
    });
  }

  /* ---------- off the clock ---------- */
  var FAVS = [
    { k: 'movie', label: 'favorite movie', val: '2001: A Space Odyssey', note: "Try asking it to open the pod bay doors." },
    { k: 'director', label: 'favorite director', val: 'David Lynch' },
    { k: 'lynch', label: 'favorite Lynch film', val: 'Lost Highway' },
    { k: 'series', label: 'favorite series', val: 'Twin Peaks', note: "Try 'coffee'." },
    { k: 'game', label: 'favorite video game', val: 'Skyrim', note: "I used to be a recruiter like you, then I took an arrow to the knee." },
    { k: 'country', label: 'best country visited', val: 'Peru' }
  ];

  function cmdFavorites(arg) {
    var a = norm(arg);
    if (a) {
      var alias = { film: 'movie', movies: 'movie', films: 'movie', show: 'series', tv: 'series', games: 'game', videogame: 'game',
        videogames: 'game', video: 'game', travel: 'country', trip: 'country', place: 'country', lost: 'lynch', losthighway: 'lynch',
        lynchfilm: 'lynch', lynchmovie: 'lynch' };
      var k = alias[a] || a;
      var f = FAVS.filter(function (x) { return x.k === k || x.k.indexOf(k) === 0; })[0];
      if (!f) { print({ cls: 'tm-err', text: 'no such favorite: ' + arg }, { cls: 'tm-dim', text: "  (type 'favorites')" }); return; }
      print({ cls: 'tm-ok', text: f.label + ': ' }, f.val);
      if (f.note) print({ cls: 'tm-dim', text: f.note });
      return;
    }
    FAVS.forEach(function (f) { print({ cls: 'tm-ok', text: pad(f.label, 22) }, f.val); });
  }

  function cmdFun() {
    print({ cls: 'tm-ok', text: 'could have been a developer' });
    print('15 years ago I was one of the first people jailbreaking iPod Touches. I could have become a developer. Then I tore my cruciate ligaments in a merge conflict, and now I hire them instead.');
    blank();
    print({ cls: 'tm-ok', text: 'a past life in music' });
    print('I made music. Rap instrumentals mostly. Sometimes I sang on them too. Tracklist: [REDACTED] (confidentiality).');
  }

  function cmdHal() {
    print({ cls: 'tm-dim', text: 'HAL 9000:' }, " I'm sorry, visitor. I'm afraid I can't do that.");
    print({ cls: 'tm-dim', text: "I can open an email, though: sudo hire matthieu" });
  }

  function cmdSkyrim() {
    print('I used to be a recruiter like you.');
    print('Then I took an arrow to the knee.');
  }

  function cmdOwls() {
    print({ cls: 'tm-dim', text: 'The owls are not what they seem.' });
    print({ cls: 'tm-dim', text: "(Try 'coffee'.)" });
  }

  function cmdContact() {
    print({ cls: 'tm-ok', text: pad('email', 10) }, { href: 'mailto:' + EMAIL, text: EMAIL });
    print({ cls: 'tm-ok', text: pad('phone', 10) }, { href: 'tel:+33679220797', text: '06 79 22 07 97' });
    print({ cls: 'tm-ok', text: pad('linkedin', 10) }, { href: LINKEDIN, text: 'linkedin.com/in/matthieu-chaffanjon-a3568a98' });
  }

  function cmdCv() {
    print('Opening my CV: ', { href: CV, text: 'Matthieu_Chaffanjon_CV.pdf' });
    try { window.open(CV, '_blank', 'noopener'); } catch (e) {}
  }

  function cmdLinkedin() {
    print({ href: LINKEDIN, text: LINKEDIN });
    try { window.open(LINKEDIN, '_blank', 'noopener'); } catch (e) {}
  }

  function cmdCoffee() {
    [
      '    ( (',
      '     ) )',
      '  .______.',
      '  |      |]',
      '  \\      /',
      "   `----'"
    ].forEach(function (l) { print({ cls: 'tm-dim', text: l }); });
    print('Damn fine coffee. Coffee is on me, let\'s talk: ', { href: 'mailto:' + EMAIL, text: EMAIL });
  }

  function cmdSudo(args) {
    if (args[1] && args[1].toLowerCase() === 'hire' && /^matthieu$/i.test(args[2] || '')) {
      print({ cls: 'tm-dim', text: '[sudo] password for visitor: ********' });
      print({ cls: 'tm-ok', text: 'Permission granted. Excellent decision.' });
      print({ cls: 'tm-dim', text: 'Opening your mail client...' });
      track('terminal-hire', 'Terminal: sudo hire matthieu');
      setTimeout(function () {
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent("Let's talk");
      }, 900);
    } else {
      print({ cls: 'tm-err', text: 'visitor is not in the sudoers file. This incident will be reported.' });
    }
  }

  function run(raw) {
    var line = String(raw || '').trim();
    print({ cls: 'tm-ps', text: PS + ' ' }, line);
    if (!line) return;
    history.push(line);
    hpos = history.length;
    var args = line.split(/\s+/);
    var cmd = args[0].toLowerCase();
    if (/pod\s*bay/i.test(line)) cmd = 'hal';
    var aliases = { best: 'favorites', favorite: 'favorites', favourite: 'favorites', favourites: 'favorites', fav: 'favorites', favs: 'favorites',
      case: 'cases', facts: 'fun', anecdotes: 'fun', trivia: 'fun', stories: 'fun', twinpeaks: 'owls', hal9000: 'hal', '2001': 'hal' };
    if (aliases[cmd]) cmd = aliases[cmd];

    if (cmd === 'cat' && args[1]) {
      var map = { 'cases.md': 'cases', 'favorites.md': 'favorites', 'fun.md': 'fun', 'contact.md': 'contact', 'cv.pdf': 'cv' };
      var m = map[args[1].toLowerCase()];
      if (m) { cmd = m; args = [m]; } else { print({ cls: 'tm-err', text: 'cat: ' + args[1] + ': No such file or directory' }); return; }
    }

    if (VISIBLE.indexOf(cmd) !== -1 || ['coffee', 'sudo', 'ls', 'rm', 'hire', 'hal', 'skyrim', 'owls', 'placements'].indexOf(cmd) !== -1) {
      track('terminal-cmd-' + cmd, 'Terminal command: ' + cmd);
    }

    switch (cmd) {
      case 'help': cmdHelp(); break;
      case 'whoami': cmdWhoami(); break;
      case 'experience': cmdExperience(); break;
      case 'cases': cmdCases(args.slice(1).join(' ')); break;
      case 'favorites': cmdFavorites(args.slice(1).join(' ')); break;
      case 'fun': cmdFun(); break;
      case 'hal': cmdHal(); break;
      case 'skyrim': cmdSkyrim(); break;
      case 'owls': cmdOwls(); break;
      case 'placements': print({ cls: 'tm-dim', text: "The placements live on the website. Here, try 'cases'." }); break;
      case 'contact': cmdContact(); break;
      case 'cv': cmdCv(); break;
      case 'linkedin': cmdLinkedin(); break;
      case 'coffee': cmdCoffee(); break;
      case 'sudo': cmdSudo(args); break;
      case 'hire': print({ cls: 'tm-dim', text: "Try: sudo hire matthieu" }); break;
      case 'ls': print('cases.md   favorites.md   fun.md   contact.md   cv.pdf'); break;
      case 'rm': print({ cls: 'tm-err', text: 'rm: permission denied. Nice try.' }); break;
      case 'clear': out.innerHTML = ''; break;
      case 'exit': case 'quit': close(); break;
      default:
        print({ cls: 'tm-err', text: 'command not found: ' + args[0] }, { cls: 'tm-dim', text: "  (type 'help')" });
    }
    if (cmd !== 'clear' && cmd !== 'exit' && cmd !== 'quit') blank();
  }

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  });

  window.__terminal = { open: open, close: close };
})();

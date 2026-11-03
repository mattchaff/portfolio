/* Hidden terminal — easter egg. Loaded lazily from index.html. */
(function () {
  if (window.__terminal) return;

  var EMAIL = 'matthieu.chaff@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/matthieu-chaffanjon-a3568a98/';
  var CV = 'assets/Matthieu_Chaffanjon_CV.pdf';
  var PS = 'visitor@matthieu:~$';
  var VISIBLE = ['help', 'whoami', 'experience', 'placements', 'contact', 'cv', 'linkedin', 'clear', 'exit'];

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
    '@keyframes tmBoot{0%{opacity:0;transform:scale(.6,.01)}40%{opacity:1;transform:scale(1,.01)}100%{opacity:1;transform:none}}' +
    '.tm-overlay.tm-boot{animation:tmBoot .45s cubic-bezier(.2,.8,.2,1) both;}' +
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
    ['help', 'placements', 'contact', 'cv', 'exit'].forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tm-chip'; b.textContent = c;
      b.addEventListener('click', function () { run(c); input.focus(); });
      chips.appendChild(b);
    });

    overlay.querySelector('.tm-x').addEventListener('click', close);
    out.addEventListener('click', function () {
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

  function isOpen() { return overlay && !overlay.hidden; }

  function open() {
    if (isOpen()) return;
    ensureDom();
    lastFocus = document.activeElement;
    overlay.hidden = false;
    overlay.classList.remove('tm-boot');
    void overlay.offsetWidth;
    overlay.classList.add('tm-boot');
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    track('terminal-open', 'Terminal opened');
    if (!out.childNodes.length) welcome();
    if (!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches)) input.focus();
  }

  function setPageInert(on) {
    var w = document.querySelector('.wrap');
    if (!w) return;
    try { w.inert = on; } catch (e) {}
    if (on) w.setAttribute('aria-hidden', 'true'); else w.removeAttribute('aria-hidden');
  }

  function close() {
    if (!isOpen()) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    setPageInert(false);
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
    print({ cls: 'tm-dim', text: "Type 'help' for commands. Type 'exit' (or press Esc) to go back to the website." });
    blank();
  }

  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

  /* ---------- commands ---------- */
  function cmdHelp() {
    var rows = [
      ['help', 'show this list'],
      ['whoami', 'who I am'],
      ['experience', 'where I have worked'],
      ['placements', 'selected placements'],
      ['contact', 'how to reach me'],
      ['cv', 'open my CV'],
      ['linkedin', 'my LinkedIn profile'],
      ['clear', 'clear the screen'],
      ['exit', 'back to the website']
    ];
    rows.forEach(function (r) { print('  ', { cls: 'tm-ok', text: pad(r[0], 12) }, r[1]); });
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

  function cmdPlacements() {
    var rows = [].slice.call(document.querySelectorAll('tbody tr')).map(function (tr) {
      var c = tr.querySelector('.cand'), a = c && c.querySelector('a');
      var r = tr.querySelector('td.role'), co = tr.querySelector('.company');
      return {
        name: c ? c.textContent.trim() : '',
        href: a ? a.href : '',
        role: r ? r.textContent.trim() : '',
        company: co ? co.textContent.trim() : ''
      };
    });
    if (!rows.length) { print({ cls: 'tm-err', text: 'No placements found.' }); return; }
    if (window.innerWidth < 600) {
      rows.forEach(function (x) {
        print(x.href ? { href: x.href, text: x.name } : x.name);
        print({ cls: 'tm-dim', text: '  ' + x.role + ', ' + x.company });
      });
      return;
    }
    var wn = Math.max.apply(null, rows.map(function (x) { return x.name.length; })) + 2;
    var wr = Math.max.apply(null, rows.map(function (x) { return x.role.length; })) + 2;
    rows.forEach(function (x) {
      var nameParts = x.href ? [{ href: x.href, text: x.name }, pad('', wn - x.name.length)] : [pad(x.name, wn)];
      print.apply(null, nameParts.concat([{ cls: 'tm-dim', text: pad(x.role, wr) }, x.company]));
    });
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
    print("Coffee's on me. Let's talk: ", { href: 'mailto:' + EMAIL, text: EMAIL });
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

    if (cmd === 'cat' && args[1]) {
      var map = { 'placements.txt': 'placements', 'contact.md': 'contact', 'cv.pdf': 'cv' };
      var m = map[args[1].toLowerCase()];
      if (m) { cmd = m; } else { print({ cls: 'tm-err', text: 'cat: ' + args[1] + ': No such file or directory' }); return; }
    }

    if (VISIBLE.indexOf(cmd) !== -1 || ['coffee', 'sudo', 'ls', 'rm', 'hire'].indexOf(cmd) !== -1) {
      track('terminal-cmd-' + cmd, 'Terminal command: ' + cmd);
    }

    switch (cmd) {
      case 'help': cmdHelp(); break;
      case 'whoami': cmdWhoami(); break;
      case 'experience': cmdExperience(); break;
      case 'placements': cmdPlacements(); break;
      case 'contact': cmdContact(); break;
      case 'cv': cmdCv(); break;
      case 'linkedin': cmdLinkedin(); break;
      case 'coffee': cmdCoffee(); break;
      case 'sudo': cmdSudo(args); break;
      case 'hire': print({ cls: 'tm-dim', text: "Try: sudo hire matthieu" }); break;
      case 'ls': print('placements.txt   contact.md   cv.pdf'); break;
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

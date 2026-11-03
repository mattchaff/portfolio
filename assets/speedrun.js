/* Resume Screening Speedrun — easter egg. Loaded lazily from index.html. */
(function () {
  if (window.__speedrun) return;

  var TOTAL_SECONDS = 30;
  var DECK_SIZE = 10;

  // All candidates below are fictional.
  var POOL = [
    // meet every criterion
    { name: 'Camille Durand', headline: 'ML Engineer', years: 6, skills: ['PyTorch', 'CUDA', 'Python'], prod: true, tenure: 30 },
    { name: 'Sam Okafor', headline: 'Research Engineer', years: 5, skills: ['JAX', 'Python', 'Distributed training'], prod: true, tenure: 26 },
    { name: 'Léa Moreau', headline: 'Applied Scientist', years: 7, skills: ['PyTorch', 'vLLM', 'Kubernetes'], prod: true, tenure: 40 },
    { name: 'Noah Fischer', headline: 'Staff ML Engineer', years: 9, skills: ['PyTorch', 'Triton', 'Rust'], prod: true, tenure: 36 },
    { name: 'Inès Benali', headline: 'ML Engineer', years: 4, skills: ['PyTorch', 'FastAPI', 'Ray'], prod: true, tenure: 22 },
    { name: 'Jonas Weber', headline: 'Research Engineer', years: 5, skills: ['JAX', 'PyTorch', 'MLOps'], prod: true, tenure: 24 },
    { name: 'Priya Nair', headline: 'Senior ML Engineer', years: 8, skills: ['PyTorch', 'TensorRT', 'Python'], prod: true, tenure: 32 },
    { name: 'Mateo Rossi', headline: 'LLM Engineer', years: 4, skills: ['PyTorch', 'RAG', 'Postgres'], prod: true, tenure: 20 },
    // miss at least one criterion
    { name: 'Chris Walker', headline: 'AI Visionary & Prompt Whisperer', years: 2, skills: ['ChatGPT', 'Prompting', 'Canva'], prod: false, tenure: 8 },
    { name: 'Emma Laurent', headline: 'ML Engineer', years: 6, skills: ['PyTorch', 'Python', 'Jupyter'], prod: false, tenure: 28 },
    { name: 'Lucas Petit', headline: 'Senior ML Engineer', years: 7, skills: ['PyTorch', 'Spark', 'Airflow'], prod: true, tenure: 9 },
    { name: 'Sofia Alvarez', headline: 'Data Scientist', years: 5, skills: ['scikit-learn', 'SQL', 'Tableau'], prod: true, tenure: 30 },
    { name: 'Ben Taylor', headline: '10x AI Founder', years: 3, skills: ['PyTorch', 'Python', 'Pitch decks'], prod: true, tenure: 18 },
    { name: 'Aya Kobayashi', headline: 'Research Scientist', years: 6, skills: ['PyTorch', 'JAX', 'LaTeX'], prod: false, tenure: 40 },
    { name: 'Victor Marchand', headline: 'ML Engineer', years: 5, skills: ['TensorFlow 1.x', 'Java', 'Hadoop'], prod: true, tenure: 36 },
    { name: 'Nina Schultz', headline: 'ML Engineer', years: 4, skills: ['PyTorch', 'Docker', 'Python'], prod: true, tenure: 7 }
  ];

  function failures(p) {
    var f = [];
    if (p.years < 4) f.push('under 4 years of experience');
    if (!/PyTorch|JAX/.test(p.skills.join(' '))) f.push('no PyTorch or JAX');
    if (!p.prod) f.push('never shipped to production');
    if (p.tenure < 18) f.push('average tenure under 18 months');
    return f;
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildDeck() {
    var yes = shuffle(POOL.filter(function (p) { return failures(p).length === 0; }));
    var no = shuffle(POOL.filter(function (p) { return failures(p).length > 0; }));
    return shuffle(yes.slice(0, DECK_SIZE / 2).concat(no.slice(0, DECK_SIZE / 2)));
  }

  function track(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: title, event: true });
      }
    } catch (e) {}
  }

  function getBest() {
    try { return parseInt(localStorage.getItem('speedrun-best'), 10) || 0; } catch (e) { return 0; }
  }
  function setBest(v) {
    try { localStorage.setItem('speedrun-best', String(v)); } catch (e) {}
  }

  var css = '' +
    '.sr-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,10,10,.9);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:srFade .2s ease both;}' +
    '.sr-overlay[hidden]{display:none;}' +
    '@keyframes srFade{from{opacity:0}to{opacity:1}}' +
    '@keyframes srPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '.sr-panel{position:relative;width:100%;max-width:460px;max-height:calc(100vh - 32px);overflow:auto;background:var(--panel,#232324);border:1px solid var(--line,#333334);border-radius:10px;padding:24px;color:var(--text,#e8e8e8);}' +
    '.sr-close{position:absolute;top:10px;right:12px;background:none;border:0;color:var(--muted,#9a9a9a);font:inherit;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;}' +
    '.sr-close:hover{color:var(--text,#e8e8e8);}' +
    '.sr-eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#9a9a9a);margin:0 0 10px;}' +
    '.sr-title{font-size:22px;font-weight:700;margin:0 0 12px;letter-spacing:-.01em;}' +
    '.sr-text{font-size:14.5px;line-height:1.6;margin:0 0 14px;color:#cfcfcf;}' +
    '.sr-list{margin:0 0 18px;padding:0;list-style:none;font-size:14px;line-height:1.7;}' +
    '.sr-list li{padding-left:18px;position:relative;}' +
    '.sr-list li::before{content:"\\2022";position:absolute;left:4px;color:var(--muted,#9a9a9a);}' +
    '.sr-keys{font-size:12.5px;color:var(--muted,#9a9a9a);margin:12px 0 0;}' +
    '.sr-btn{font:inherit;font-size:14px;font-weight:600;color:var(--text,#e8e8e8);background:transparent;border:1px solid #4a4a4b;border-radius:6px;padding:10px 16px;cursor:pointer;text-decoration:none;display:inline-block;transition:border-color .15s ease,background .15s ease;}' +
    '.sr-btn:hover{border-color:var(--text,#e8e8e8);background:rgba(255,255,255,.04);}' +
    '.sr-btn.primary{background:var(--text,#e8e8e8);color:#1c1c1d;border-color:var(--text,#e8e8e8);}' +
    '.sr-btn.primary:hover{background:#fff;}' +
    '.sr-hud{display:flex;justify-content:space-between;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#9a9a9a);margin:0 0 8px;padding-right:28px;}' +
    '.sr-bar{height:3px;background:var(--line,#333334);border-radius:2px;overflow:hidden;margin:0 0 16px;}' +
    '.sr-bar i{display:block;height:100%;width:100%;background:var(--text,#e8e8e8);transform-origin:left;}' +
    '.sr-bar.low i{background:#ff8a8a;}' +
    '.sr-card{border:1px solid var(--line,#333334);border-radius:8px;padding:16px 16px 14px;background:rgba(255,255,255,.02);animation:srPop .18s ease both;}' +
    '.sr-name{font-size:18px;font-weight:700;margin:0 0 2px;}' +
    '.sr-headline{font-size:14px;color:#bdbdbd;margin:0 0 12px;}' +
    '.sr-row{display:flex;justify-content:space-between;gap:12px;font-size:13.5px;padding:7px 0;border-top:1px solid var(--line,#333334);}' +
    '.sr-row span:first-child{color:var(--muted,#9a9a9a);}' +
    '.sr-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;}' +
    '.sr-chip{font-size:12px;border:1px solid #4a4a4b;border-radius:999px;padding:1px 9px;}' +
    '.sr-fb{min-height:20px;font-size:13px;margin:10px 0 10px;}' +
    '.sr-fb.good{color:#8fdc9f;}' +
    '.sr-fb.bad{color:#ff9a9a;}' +
    '.sr-actions{display:flex;gap:10px;}' +
    '.sr-actions .sr-btn{flex:1;padding:13px 10px;}' +
    '.sr-actions .no{border-color:#6b3a3a;color:#ff9a9a;}' +
    '.sr-actions .no:hover{border-color:#ff9a9a;background:rgba(255,120,120,.07);}' +
    '.sr-actions .yes{border-color:#3a6b46;color:#8fdc9f;}' +
    '.sr-actions .yes:hover{border-color:#8fdc9f;background:rgba(120,220,150,.07);}' +
    '.sr-score{font-size:44px;font-weight:700;letter-spacing:-.02em;margin:2px 0 2px;}' +
    '.sr-rank{font-size:16px;font-weight:600;margin:0 0 6px;}' +
    '.sr-stats{font-size:13px;color:var(--muted,#9a9a9a);margin:0 0 14px;}' +
    '.sr-end-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;}' +
    '@media (max-width:560px){.sr-panel{padding:20px 18px;}.sr-title{font-size:20px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var overlay, panel, lastFocus, state, timerId;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'sr-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Resume screening speedrun');
    overlay.innerHTML = '<div class="sr-panel"><button class="sr-close" type="button" aria-label="Close">&times;</button><div class="sr-body"></div></div>';
    document.body.appendChild(overlay);
    panel = overlay.querySelector('.sr-body');
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.sr-close').addEventListener('click', close);
  }

  function isOpen() { return overlay && !overlay.hidden; }

  function open() {
    if (isOpen()) return;
    ensureDom();
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    track('speedrun-open', 'Speedrun opened');
    showIntro();
  }

  function close() {
    if (!isOpen()) return;
    stopTimer();
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function focusFirst() {
    var b = panel.querySelector('button, a');
    if (b) b.focus();
  }

  function showIntro() {
    state = null;
    stopTimer();
    panel.innerHTML =
      '<p class="sr-eyebrow">Easter egg unlocked</p>' +
      '<h2 class="sr-title">Resume Screening Speedrun</h2>' +
      '<p class="sr-text">You are the recruiter. Ten fictional profiles, thirty seconds. Shortlist the ones that match the brief and reject the rest.</p>' +
      '<p class="sr-eyebrow">The brief: Senior ML Engineer, LLM inference</p>' +
      '<ul class="sr-list">' +
        '<li>4+ years of experience</li>' +
        '<li>PyTorch or JAX</li>' +
        '<li>Has shipped a model to production</li>' +
        '<li>Average tenure of 18+ months</li>' +
      '</ul>' +
      '<button class="sr-btn primary" type="button" data-act="start">Start the clock</button>' +
      '<p class="sr-keys">Keyboard: ← reject, → shortlist, Esc to quit.</p>';
    panel.querySelector('[data-act="start"]').addEventListener('click', start);
    var best = getBest();
    if (best) {
      var b = document.createElement('p');
      b.className = 'sr-keys';
      b.textContent = 'Your best score: ' + best;
      panel.appendChild(b);
    }
    focusFirst();
  }

  function start() {
    state = {
      deck: buildDeck(),
      idx: 0,
      correct: 0,
      wrong: 0,
      startedAt: Date.now(),
      feedback: null
    };
    renderCard();
    timerId = setInterval(tick, 100);
  }

  function timeLeft() {
    return Math.max(0, TOTAL_SECONDS - (Date.now() - state.startedAt) / 1000);
  }

  function tick() {
    if (!state) return;
    var left = timeLeft();
    var bar = panel.querySelector('.sr-bar');
    var t = panel.querySelector('.sr-time');
    if (bar) {
      bar.firstChild.style.transform = 'scaleX(' + (left / TOTAL_SECONDS) + ')';
      bar.classList.toggle('low', left <= 8);
    }
    if (t) t.textContent = Math.ceil(left) + 's';
    if (left <= 0) finish(true);
  }

  function renderCard() {
    var p = state.deck[state.idx];
    var fb = state.feedback;
    panel.innerHTML =
      '<div class="sr-hud"><span>Profile ' + (state.idx + 1) + ' / ' + DECK_SIZE + '</span><span class="sr-time">' + Math.ceil(timeLeft()) + 's</span></div>' +
      '<div class="sr-bar"><i style="transform:scaleX(' + (timeLeft() / TOTAL_SECONDS) + ')"></i></div>' +
      '<div class="sr-card">' +
        '<p class="sr-name">' + p.name + '</p>' +
        '<p class="sr-headline">' + p.headline + '</p>' +
        '<div class="sr-row"><span>Experience</span><span>' + p.years + ' years</span></div>' +
        '<div class="sr-row"><span>Skills</span><span class="sr-chips">' + p.skills.map(function (s) { return '<span class="sr-chip">' + s + '</span>'; }).join('') + '</span></div>' +
        '<div class="sr-row"><span>Shipped to production</span><span>' + (p.prod ? 'Yes' : 'No') + '</span></div>' +
        '<div class="sr-row"><span>Average tenure</span><span>' + p.tenure + ' months</span></div>' +
      '</div>' +
      '<p class="sr-fb ' + (fb ? fb.cls : '') + '" aria-live="polite">' + (fb ? fb.text : '') + '</p>' +
      '<div class="sr-actions">' +
        '<button class="sr-btn no" type="button" data-answer="no">← Reject</button>' +
        '<button class="sr-btn yes" type="button" data-answer="yes">Shortlist →</button>' +
      '</div>';
    panel.querySelector('[data-answer="no"]').addEventListener('click', function () { answer(false); });
    panel.querySelector('[data-answer="yes"]').addEventListener('click', function () { answer(true); });
  }

  function answer(shortlist) {
    if (!state || state.idx >= DECK_SIZE) return;
    var p = state.deck[state.idx];
    var fails = failures(p);
    var isMatch = fails.length === 0;
    if (shortlist === isMatch) {
      state.correct++;
      state.feedback = { cls: 'good', text: 'Good call.' };
    } else {
      state.wrong++;
      state.feedback = {
        cls: 'bad',
        text: isMatch
          ? 'Missed: ' + p.name.split(' ')[0] + ' ticked every box.'
          : 'Not quite: ' + fails[0] + '.'
      };
    }
    state.idx++;
    if (state.idx >= DECK_SIZE) { finish(false); return; }
    renderCard();
  }

  function rankFor(correct) {
    if (correct >= 9) return ['Head of Talent', 'Your pipeline is cleaner than my CRM.'];
    if (correct >= 7) return ['Senior Recruiter', 'Solid. You would survive an intake call with a picky CTO.'];
    if (correct >= 5) return ['Junior Sourcer', 'Keyword matching detected. Read the whole profile next time.'];
    return ['Intern with a LinkedIn Premium trial', 'Spray and pray detected.'];
  }

  function finish(timedOut) {
    stopTimer();
    var left = timeLeft();
    var answered = state.idx;
    var score = Math.max(0, state.correct * 100 - state.wrong * 50 + Math.round(left) * 3);
    var best = getBest();
    var isBest = score > best;
    if (isBest) setBest(score);
    var rank = rankFor(state.correct);
    track('speedrun-finish', 'Speedrun finished: ' + score);
    panel.innerHTML =
      '<p class="sr-eyebrow">' + (timedOut ? "Time's up" : 'Pipeline cleared') + '</p>' +
      '<div class="sr-score">' + score + '</div>' +
      '<p class="sr-rank">' + rank[0] + '</p>' +
      '<p class="sr-text">' + rank[1] + '</p>' +
      '<p class="sr-stats">' + state.correct + ' correct, ' + state.wrong + ' wrong' +
        (answered < DECK_SIZE ? ', ' + (DECK_SIZE - answered) + ' left in the pipeline' : ', ' + Math.round(TOTAL_SECONDS - left) + 's on the clock') +
        (isBest && best ? ' · new best!' : '') + '</p>' +
      '<p class="sr-text">Need a recruiter who actually reads the profiles?</p>' +
      '<div class="sr-end-actions">' +
        '<a class="sr-btn primary" href="mailto:matthieu.chaff@gmail.com">Say hello</a>' +
        '<button class="sr-btn" type="button" data-act="again">Play again</button>' +
        '<button class="sr-btn" type="button" data-act="close">Close</button>' +
      '</div>';
    panel.querySelector('[data-act="again"]').addEventListener('click', showIntro);
    panel.querySelector('[data-act="close"]').addEventListener('click', close);
    state = null;
    focusFirst();
  }

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (state) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); answer(false); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); answer(true); }
      return;
    }
    if (e.key === 'Tab') {
      var f = overlay.querySelectorAll('button, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.__speedrun = { open: open, close: close };
})();

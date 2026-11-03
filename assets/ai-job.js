/* Easter egg: "Will AI replace your job?" Loaded lazily when the photo is clicked. */
(function () {
  if (window.__aijob) return;

  var EMAIL = 'matthieu.chaff@gmail.com';

  function track(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: title, event: true });
      }
    } catch (e) {}
  }

  /* [regex on the lowercased, accent-free job, % chance, one-liner]. First match wins. */
  var JOBS = [
    [/^(an? |the )?(ai|a\.i\.|chatgpt|claude|llm|robot|bot|gpt)( model| agent)?$/, 100, 'You are the AI. A newer model came out while you were reading this.'],
    [/recruit|recrut|talent|sourcer|headhunt|chasseur de t|\bhr\b|\brh\b|human resources|ressources humaines|people ops|people partner/, 47, 'Fellow recruiter: risky, not fatal. Nobody replaces us tomorrow.', 'recruiter'],
    [/machine learning|\bml\b|ai research|research scientist|deep learning|\bnlp\b/, 14, 'You are building the thing. Hard to fire the builder. For now.'],
    [/data scien|data analy|analyste|analytics/, 66, 'The notebook is already writing itself.'],
    [/software|developer|developpeur|programmer|programmeur|front.?end|back.?end|full.?stack|devops|\bdev\b|coder/, 62, 'AI writes the code. You explain it to the PM.'],
    [/ceo|founder|fondateur|fondatrice|dirigeant|entrepreneur|co-?founder/, 22, 'Someone has to take the blame.'],
    [/account(ant|ing)|comptable|bookkeep|compta/, 82, 'The spreadsheet saw this coming.'],
    [/lawyer|avocat|paralegal|juriste|attorney/, 58, 'Billable hours versus tokens. Good luck.'],
    [/translat|traduct|interpret/, 91, 'Lost in translation. Mostly your job.'],
    [/copywrit|writer|redact|journalist|journalis|editor|ecrivain/, 78, 'It already generated three versions of this sentence.'],
    [/designer|graphiste|\bux\b|\bui\b|illustrat/, 60, 'It can draw. It cannot read the client\'s mind. Yet.'],
    [/marketing|\bseo\b|community manager|growth/, 68, 'The campaign wrote itself. The results, less so.'],
    [/consult/, 72, 'The slides generate themselves. The invoice does not.'],
    [/sales|commercial|business dev|account exec|\bsdr\b|vendeur|vendeuse/, 52, 'People still buy from people. Mostly.'],
    [/product (manager|owner)|project manager|chef de projet|\bpm\b|manager/, 55, 'The meetings stay. The manager is optional.'],
    [/customer (support|service|success)|support client|call ?cent|telemarket|helpdesk|help desk|standardist/, 88, 'Have you tried turning it off and on again? So has the bot.'],
    [/data entry|saisie|secretar|secretaire|assistant(e)?\b|receptionist|administrat/, 85, 'The inbox sorts itself now.'],
    [/bank|trader|finance|invest|insurance|assurance/, 66, 'The model reads the 10-K faster than you read the title.'],
    [/driver|chauffeur|taxi|uber|truck|livreur|delivery/, 74, 'The robotaxis are already circling the block.'],
    [/teacher|professeur|prof\b|enseignant|instituteur|institutrice|lecturer/, 24, 'Try handling 28 teenagers on a Friday afternoon.'],
    [/nurse|infirmi|aide.?soignant|caregiver/, 8, 'Bedside manner is still human-only.'],
    [/doctor|medecin|physician|surgeon|chirurgien|dentist|dentiste|pharmac/, 18, 'It reads scans well. It still cannot hold a hand.'],
    [/plumb|plombier|electric|carpent|menuisier|mason|macon|roof|couvreur|mechanic|mecanicien|builder|peintre|painter/, 5, 'Robots still cannot fit under a sink.'],
    [/chef|cuisin|\bcook|baker|boulang|patiss|waiter|serveu|barista|bartender/, 12, 'Taste is hard to prompt.'],
    [/farmer|agricult|paysan|fisherman|pecheur/, 15, 'The cows are not on LinkedIn.'],
    [/artist|musici|actor|acteur|actrice|comedian|humoris|singer|chanteu|dj\b/, 40, 'Generating a song is easy. Being cool is hard.'],
    [/influenc|youtub|streamer|tiktok|content creator/, 70, 'Its virtual avatar is already better lit than you.'],
    [/student|etudiant|eleve|lyceen/, 35, 'It already did your homework. You are on your own for the exam.'],
    [/politic|depute|senator|senateur|minist|maire|mayor/, 4, 'Not even AI wants this job.'],
    [/astronaut|astronaute/, 3, 'Space is hard. Even for robots.'],
    [/firefight|pompier|police|policier|gendarme|soldier|soldat|militaire/, 6, 'Robots do not run into burning buildings. Yet.'],
    [/pilot|pilote/, 20, 'Autopilot has been around for decades. You are still there.'],
    [/unemploy|jobless|chomeur|sans emploi|no job|nothing|^none$|^rien$/, 0, 'You cannot replace what does not exist. (I know a recruiter, though.)']
  ];

  function normalize(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }

  function verdict(pct) {
    if (pct >= 100) return 'Congratulations, you were replaced before finishing the sentence.';
    if (pct >= 85) return 'Ouch. Bad luck. Start preparing something.';
    if (pct >= 70) return 'Hmm. Maybe time to update that CV.';
    if (pct >= 50) return 'Coin flip. Keep an eye on the headlines.';
    if (pct >= 25) return 'Safe-ish. For now.';
    if (pct >= 10) return 'Relax. The robots are struggling with this one.';
    return 'Basically AI-proof. The robots are scared of you.';
  }

  function assess(job) {
    var n = normalize(job);
    for (var i = 0; i < JOBS.length; i++) {
      if (JOBS[i][0].test(n)) return { pct: JOBS[i][1], quip: JOBS[i][2], kind: JOBS[i][3] || '' };
    }
    return { pct: 8 + (hash(n) % 85), quip: "Never heard of it. The oracle improvised.", kind: '' };
  }

  var css = '' +
    '.aj-back{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,10,10,.72);opacity:0;transition:opacity .2s ease-out;}' +
    '.aj-back[hidden]{display:none;}' +
    '.aj-back.aj-on{opacity:1;}' +
    '.aj-card{width:100%;max-width:440px;max-height:calc(100vh - 40px);overflow-y:auto;background:#232324;border:1px solid #333334;border-radius:14px;padding:26px 24px 22px;color:#e8e8e8;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.5);transform:translateY(8px) scale(.98);transition:transform .25s ease-out;}' +
    '.aj-on .aj-card{transform:none;}' +
    '.aj-q{font-size:20px;font-weight:600;line-height:1.3;margin:0 0 6px;}' +
    '.aj-sub{font-size:14px;color:#9a9a9a;margin:0 0 16px;line-height:1.5;}' +
    '.aj-form{display:flex;gap:8px;}' +
    '.aj-input{flex:1;min-width:0;font:inherit;font-size:16px;color:#f2f2f2;background:#1c1c1d;border:1px solid #3a3a3b;border-radius:9px;padding:10px 12px;outline:0;}' +
    '.aj-input:focus{border-color:#8ab4ff;}' +
    '.aj-btn{font:inherit;font-size:14px;font-weight:600;color:#1c1c1d;background:#e8e8e8;border:0;border-radius:9px;padding:10px 16px;cursor:pointer;}' +
    '.aj-btn:hover{background:#fff;}' +
    '.aj-ghost{font:inherit;font-size:14px;color:#aaa;background:transparent;border:1px solid #3a3a3b;border-radius:9px;padding:9px 14px;cursor:pointer;}' +
    '.aj-ghost:hover{color:#fff;border-color:#777;}' +
    '.aj-step{font-size:14px;color:#9a9a9a;margin:0 0 14px;min-height:1.5em;}' +
    '.aj-bar{height:6px;border-radius:99px;background:#1c1c1d;overflow:hidden;}' +
    '.aj-bar>i{display:block;height:100%;width:0;background:#8ab4ff;border-radius:99px;transition:width 1.7s cubic-bezier(.3,.6,.3,1);}' +
    '.aj-num{font-size:68px;line-height:1;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin:2px 0 6px;}' +
    '.aj-lab{font-size:14px;color:#9a9a9a;margin:0 0 16px;}' +
    '.aj-job{color:#e8e8e8;}' +
    '.aj-quip{font-size:15px;line-height:1.5;margin:0 0 6px;color:#e8e8e8;}' +
    '.aj-verdict{font-size:15px;line-height:1.5;margin:0 0 16px;font-weight:600;}' +
    '.aj-note{font-size:12px;color:#6b6b6b;margin:14px 0 0;line-height:1.5;}' +
    '.aj-list{margin:0 0 14px;padding-left:18px;font-size:14px;line-height:1.55;color:#cfcfcf;}' +
    '.aj-list li{margin:0 0 4px;}' +
    '.aj-sub2{font-size:13px;color:#9a9a9a;margin:0 0 6px;}' +
    '.aj-row{display:flex;gap:8px;flex-wrap:wrap;}' +
    '.aj-card a{color:#8ab4ff;overflow-wrap:anywhere;}' +
    '@media (max-width:480px){.aj-card{padding:20px 18px 18px;}.aj-num{font-size:52px;}.aj-q{font-size:18px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var back, card, lastFocus, timers = [], closing = false, closeTimer = null;

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function ensureDom() {
    if (back) return;
    back = el('div', 'aj-back');
    back.hidden = true;
    back.setAttribute('role', 'dialog');
    back.setAttribute('aria-modal', 'true');
    back.setAttribute('aria-label', 'Will AI replace your job?');
    card = el('div', 'aj-card');
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

  function showQuestion(prefill) {
    clearTimers();
    card.innerHTML = '';
    card.appendChild(el('p', 'aj-q', 'What is your job?'));
    card.appendChild(el('p', 'aj-sub', 'Quick scientific analysis of how likely AI is to take it.'));
    var form = el('form', 'aj-form');
    var input = el('input', 'aj-input');
    input.type = 'text'; input.maxLength = 60; input.placeholder = 'e.g. recruiter';
    input.setAttribute('aria-label', 'Your job');
    input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
    if (prefill) input.value = prefill;
    var btn = el('button', 'aj-btn', 'Analyse'); btn.type = 'submit';
    form.appendChild(input); form.appendChild(btn);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) { input.focus(); return; }
      analyse(v);
    });
    card.appendChild(form);
    card.appendChild(el('p', 'aj-note', 'No data leaves this page.'));
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 60);
  }

  function analyse(job) {
    clearTimers();
    track('aijob-play', 'AI job game played');
    card.innerHTML = '';
    card.appendChild(el('p', 'aj-q', 'Analysing…'));
    var step = el('p', 'aj-step', 'Scanning your daily tasks…');
    var bar = el('div', 'aj-bar'); var fill = document.createElement('i'); bar.appendChild(fill);
    card.appendChild(step); card.appendChild(bar);
    var steps = ['Scanning your daily tasks…', 'Asking a very confident neural network…', 'Reading this morning\'s headlines…'];
    later(function () { fill.style.width = '100%'; }, 30);
    later(function () { step.textContent = steps[1]; }, 600);
    later(function () { step.textContent = steps[2]; }, 1200);
    later(function () { showResult(job); }, 1900);
  }

  function showResult(job) {
    var r = assess(job);
    card.innerHTML = '';
    var num = el('div', 'aj-num', '0%');
    card.appendChild(num);
    var lab = el('p', 'aj-lab');
    lab.appendChild(document.createTextNode('chance that '));
    lab.appendChild(el('span', 'aj-job', 'your job (' + job + ')'));
    lab.appendChild(document.createTextNode(' gets replaced by AI.'));
    card.appendChild(lab);
    card.appendChild(el('p', 'aj-quip', r.quip));
    if (r.kind === 'recruiter') {
      card.appendChild(el('p', 'aj-quip', 'People still hire people. But recruiters who use LLMs for sharp, precise searches will quietly eat the ones who do not. The AI will not take your job. A recruiter with an AI will.'));
      card.appendChild(el('p', 'aj-sub2', 'Start this week:'));
      var ul = el('ul', 'aj-list');
      ['Intake calls \u2192 search briefs and Boolean strings.',
       'Let the model screen the long list.',
       'Outreach that does not read like outreach.'].forEach(function (t) { ul.appendChild(el('li', '', t)); });
      card.appendChild(ul);
      var p = el('p', 'aj-quip');
      p.appendChild(document.createTextNode('We are in this together. Compare notes? '));
      var a = document.createElement('a'); a.href = 'mailto:' + EMAIL; a.textContent = EMAIL;
      p.appendChild(a);
      card.appendChild(p);
    } else {
      card.appendChild(el('p', 'aj-verdict', verdict(r.pct)));
    }

    var row = el('div', 'aj-row');
    var again = el('button', 'aj-btn', 'Try another job'); again.type = 'button';
    again.addEventListener('click', function () { showQuestion(''); });
    var done = el('button', 'aj-ghost', 'Close'); done.type = 'button';
    done.addEventListener('click', close);
    row.appendChild(again); row.appendChild(done);
    card.appendChild(row);
    card.appendChild(el('p', 'aj-note', 'Based on 100% unscientific vibes and this week’s headlines.'));

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { num.textContent = r.pct + '%'; return; }
    var t0 = null, dur = 1100;
    function tick(ts) {
      if (!isOpen()) return;
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      num.textContent = Math.round(r.pct * e) + '%';
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function open() {
    if (isOpen()) return;
    ensureDom();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    closing = false;
    lastFocus = document.activeElement;
    showQuestion('');
    back.hidden = false;
    void back.offsetWidth;
    back.classList.add('aj-on');
    document.body.style.overflow = 'hidden';
    setInert(true);
    track('aijob-open', 'AI job game opened');
  }

  function close() {
    if (!isOpen()) return;
    closing = true;
    clearTimers();
    back.classList.remove('aj-on');
    document.body.style.overflow = '';
    setInert(false);
    closeTimer = setTimeout(function () { back.hidden = true; closing = false; closeTimer = null; }, 230);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  document.addEventListener('keydown', function (e) {
    if (isOpen() && e.key === 'Escape') { e.preventDefault(); close(); }
  });

  window.__aijob = { open: open, close: close, _assess: assess };
})();

// Daredevil, a fan tribute — the echo.
// Sound travels at a constant speed, so rings expand linearly and every element
// lights the moment the ring reaches its nearest edge.

(() => {
  const root = document.documentElement;
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const SPEED = 1150; // px per second
  const motionOK = () => !reduceMQ.matches && !root.classList.contains('all-lit');

  /* ---------- nav height (the hero tucks under the nav by this much) ---------- */

  const navEl = document.querySelector(".nav");
  new ResizeObserver(() => root.style.setProperty("--nav-h", navEl.offsetHeight + "px")).observe(navEl);

  /* ---------- braille headline ---------- */

  const BRAILLE = { D: [1, 4, 5], A: [1], R: [1, 2, 3, 5], E: [1, 5], V: [1, 2, 3, 6], I: [2, 4], L: [1, 2, 3] };
  const cellsEl = document.querySelector('.cells');
  for (const ch of cellsEl.dataset.word) {
    const cell = document.createElement('span');
    cell.className = 'cell';
    cell.dataset.echo = 'cell';
    const dots = document.createElement('span');
    dots.className = 'dots';
    for (let p = 1; p <= 6; p++) {
      const d = document.createElement('span');
      d.className = BRAILLE[ch].includes(p) ? 'dot on' : 'dot';
      dots.append(d);
    }
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.textContent = ch;
    cell.append(dots, letter);
    cellsEl.append(cell);
  }

  // Glyph widths differ, so equal braille columns leave the I–L gap wide. Set the
  // letters at equal gaps across the row and centre each cell's dots under its letter.
  function layoutWord() {
    const box = cellsEl.getBoundingClientRect();
    const rows = [];
    for (const cell of cellsEl.children) {
      const top = Math.round(cell.getBoundingClientRect().top);
      if (rows.at(-1)?.top !== top) rows.push({ top, cells: [] });
      rows.at(-1).cells.push(cell);
    }
    const widthOf = cell => cell.querySelector('.letter').getBoundingClientRect().width;
    let gap = Infinity;
    for (const row of rows) {
      if (row.cells.length < 2) continue;
      const sum = row.cells.reduce((a, c) => a + widthOf(c), 0);
      gap = Math.min(gap, (box.width - sum) / (row.cells.length - 1));
    }
    for (const row of rows) {
      let x = 0;
      for (const cell of row.cells) {
        const w = widthOf(cell), left = cell.getBoundingClientRect().left - box.left;
        const letter = cell.querySelector('.letter'), dots = cell.querySelector('.dots');
        letter.style.left = x - left + 'px';
        letter.style.translate = '0 -52%';
        dots.style.left = x + w / 2 - left - dots.offsetWidth / 2 + 'px';
        x += w + gap;
      }
    }
  }
  (document.fonts?.ready ?? Promise.resolve()).then(layoutWord);
  new ResizeObserver(layoutWord).observe(cellsEl);

  /* ---------- lighting ---------- */

  const restOf = el => parseFloat(getComputedStyle(el).opacity);

  // Interruptible: a new echo starts from whatever opacity is on screen now.
  function glow(el, { peak = 1, dur, delay, from, extra }) {
    const prev = el._glow;
    const start = prev ? restOf(el) : from;
    if (prev) prev.cancel();
    const frames = [
      { opacity: start, transform: extra?.[0] ?? 'none', easing: EASE_OUT },
      { opacity: peak, transform: extra?.[1] ?? 'none', offset: 0.07 },
      { opacity: peak, transform: extra?.[1] ?? 'none', offset: 0.32, easing: 'ease-in-out' },
      { opacity: from, transform: extra?.[0] ?? 'none' },
    ];
    const anim = el.animate(frames, { duration: dur, delay, fill: 'backwards' });
    el._glow = anim;
    anim.onfinish = anim.oncancel = () => { if (el._glow === anim) el._glow = null; };
  }

  const REST = 0.62, REST_LETTER = 0.07;

  function light(el, delay, dur, peak = 1) {
    const kind = el.dataset.echo;
    if (kind === 'photo') {
      glow(el.querySelector('.color'), { from: 0, peak, dur: dur * 1.25, delay });
    } else if (kind === 'cell') {
      glow(el.querySelector('.letter'), { from: REST_LETTER, peak, dur: dur * 1.2, delay });
      for (const dot of el.querySelectorAll('.dot.on')) {
        dotFlip(dot, delay, dur * 1.2);
      }
    } else {
      glow(el, { from: REST, peak, dur, delay });
    }
  }

  // ink dot shrinks away, a small red point stays behind
  function dotFlip(dot, delay, dur) {
    // ink dot shrinks away as the letter arrives; starts from what is on screen,
    // so a second tap never flashes the dot back to full
    const now = pe => {
      const cs = getComputedStyle(dot, pe);
      const m = /matrix\(([^,]+)/.exec(cs.transform);
      return { o: parseFloat(cs.opacity), s: m ? parseFloat(m[1]) : 1 };
    };
    const startB = now('::before');
    for (const a of dot._flip || []) a.cancel();
    const frames = (a, b, from = a) => [
      { opacity: from.o, transform: `scale(${from.s})`, easing: EASE_OUT },
      { opacity: b.o, transform: `scale(${b.s})`, offset: 0.07 },
      { opacity: b.o, transform: `scale(${b.s})`, offset: 0.32, easing: 'ease-in-out' },
      { opacity: a.o, transform: `scale(${a.s})` },
    ];
    dot._flip = [
      dot.animate(frames({ o: 0.72, s: 1 }, { o: 0, s: 0.4 }, startB), { duration: dur, delay, pseudoElement: '::before', fill: 'backwards' }),
    ];
  }

  /* ---------- the echo ---------- */

  const layer = document.querySelector('.echo-layer');
  const hero = document.querySelector('.hero');
  const heroLit = document.querySelector('.hero-lit');
  let live = 0;

  function ring(x, y, maxR, cls, delay, peak) {
    if (live > 8) return;
    const el = document.createElement('span');
    el.className = 'ring' + (cls ? ' ' + cls : '');
    const size = maxR * 2;
    el.style.width = el.style.height = size + 'px';
    layer.append(el);
    live++;
    const dur = (maxR / SPEED) * 1000;
    const at = s => `translate(${x - maxR}px, ${y - maxR}px) scale(${s})`;
    const a = el.animate(
      [
        { transform: at(0.01), opacity: peak },
        { transform: at(1), opacity: 0 },
      ],
      { duration: dur, delay, easing: 'linear', fill: 'backwards' }
    );
    a.onfinish = () => { el.remove(); live--; };
  }

  function nearest(rect, x, y) {
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    return Math.hypot(dx, dy);
  }

  function echo(x, y, { big = true } = {}) {
    if (!motionOK()) return;
    const vw = innerWidth, vh = innerHeight;
    const maxR = big ? Math.min(Math.hypot(vw, vh), 1500) : 260;
    const dur = big ? 2800 : 1500;
    ring(x, y, maxR, 'lead', 0, 0.9);
    ring(x, y, maxR, '', 110, big ? 0.45 : 0.3);

    // read every rect first, then start animations, so layout is measured once
    const hits = [];
    for (const el of document.querySelectorAll('[data-echo]')) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40 || r.width === 0) continue;
      const d = nearest(r, x, y);
      if (d <= maxR) hits.push([el, d]);
    }
    for (const [el, d] of hits) light(el, (d / SPEED) * 1000, dur, big ? 1 : 0.86);

    const hr = hero.getBoundingClientRect();
    if (y > hr.top && y < hr.bottom) {
      heroLit.style.setProperty('--x', x - hr.left + 'px');
      heroLit.style.setProperty('--y', y - hr.top + 'px');
      const prev = heroLit._glow;
      const start = prev ? restOf(heroLit) : 0;
      if (prev) prev.cancel();
      heroLit._glow = heroLit.animate(
        [
          { opacity: start, easing: EASE_OUT },
          { opacity: big ? 1 : 0.55, offset: 0.08 },
          { opacity: big ? 1 : 0.55, offset: 0.3, easing: 'ease-in-out' },
          { opacity: 0 },
        ],
        { duration: dur }
      );
    }
    quicken(big ? 6 : 1);
  }

  // A press is the strongest signal: light on pointer-down, not on release.
  addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    echo(e.clientX, e.clientY, { big: true });
  }, { passive: true });

  // Hover sends small pings, rate-limited so moving the mouse never floods the page.
  let lastX = -999, lastY = -999, lastT = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !finePointer.matches) return;
    const now = performance.now();
    if (now - lastT < 600 || Math.hypot(e.clientX - lastX, e.clientY - lastY) < 260) return;
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    echo(e.clientX, e.clientY, { big: false });
  }, { passive: true });

  /* ---------- heartbeat (hero) ---------- */

  const bpmEl = document.querySelector('.bpm');
  const line = document.querySelector('.pulse-line');
  let bpm = 72, beatAnim = null;
  function startBeat() {
    beatAnim?.cancel();
    if (reduceMQ.matches) return;
    beatAnim = line.animate(
      [
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: 0.7 },
        { clipPath: 'inset(0 0 0 0)', opacity: 0.25 },
      ],
      { duration: 60000 / bpm, iterations: Infinity, easing: 'linear' }
    );
  }
  // every echo raises his pulse a little; it settles back to 72
  function quicken(n) {
    bpm = Math.min(118, bpm + n);
    render();
  }
  function render() {
    bpmEl.textContent = Math.round(bpm);
    if (beatAnim) beatAnim.updatePlaybackRate(bpm / 72);
  }
  setInterval(() => { if (bpm > 72) { bpm = Math.max(72, bpm - 2); render(); } }, 1000);
  startBeat();
  reduceMQ.addEventListener('change', startBeat);

  /* ---------- rogues & allies ---------- */

  const PEOPLE = {
    foggy:    { name: 'Foggy Nelson', role: 'Ally', bpm: 96, amp: 0.8, jitter: 0.05, desc: 'His law partner and best friend since law school. Hears everything, forgives most of it.' },
    karen:    { name: 'Karen Page', role: 'Ally', bpm: 70, amp: 0.85, jitter: 0.02, desc: 'Came to Nelson & Murdock as their secretary and became the person who knew Matt best.' },
    stick:    { name: 'Stick', role: 'Mentor', bpm: 46, amp: 0.6, jitter: 0, desc: 'The blind master who taught a grieving boy to use his senses as weapons, then walked away.' },
    elektra:  { name: 'Elektra Natchios', role: 'Ally, sometimes', bpm: 58, amp: 0.9, jitter: 0.03, desc: 'His first love, met at college. Trained as an assassin; never quite on his side or against it.' },
    kingpin:  { name: 'Wilson Fisk, the Kingpin', role: 'Rogue', bpm: 52, amp: 1, jitter: 0, desc: 'Runs the city’s crime like a business. In Born Again he learns Matt’s name and nearly ends him.' },
    bullseye: { name: 'Bullseye', role: 'Rogue', bpm: 84, amp: 1, jitter: 0.45, desc: 'A killer who never misses with anything he throws. His pulse never settles, and neither does he.' },
  };

  Object.assign(PEOPLE, window.__ddWorstPeople); // dev-only worst-case fixture (dev/worst.js)

  // Seeded so a person's rhythm is the same every time you listen.
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  function ecgPath(person, w = 600, h = 160) {
    const p = { amp: 0.85, jitter: 0, bpm: 72, ...person };
    const rand = rng([...p.name].reduce((a, c) => a + c.charCodeAt(0), 7));
    const mid = h * 0.6, beatW = w / (p.bpm / 20); // a 20-second strip folded into the width
    let x = 0, d = `M0 ${mid}`;
    while (x < w) {
      const j = 1 + (rand() - 0.5) * 2 * p.jitter;
      const bw = beatW * j, a = p.amp * (1 + (rand() - 0.5) * p.jitter * 1.4);
      const pts = [
        [0.18, 0], [0.24, -0.08], [0.3, 0], [0.38, 0], [0.41, 0.12],
        [0.45, -0.85 * a], [0.49, 0.3 * a], [0.53, 0], [0.66, 0], [0.74, -0.16], [0.82, 0], [1, 0],
      ];
      for (const [fx, fy] of pts) d += ` L${(x + fx * bw).toFixed(1)} ${(mid + fy * h * 0.62).toFixed(1)}`;
      x += bw;
    }
    return d;
  }

  const buttons = document.querySelectorAll('.roster button');
  const ecg = document.querySelector('.ecg svg');
  const ecgPathEl = ecg.querySelector('path');
  const readoutText = document.querySelector('.readout-text');
  const out = {
    name: document.querySelector('.readout-name'),
    role: document.querySelector('.readout-role'),
    bpm: document.querySelector('.readout-bpm'),
    desc: document.querySelector('.readout-desc'),
  };
  let current = 'foggy', sweep = null;

  function select(id) {
    if (id === current && sweep) return;
    current = id;
    const p = PEOPLE[id];
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.person === id));
    ecgPathEl.setAttribute('d', ecgPath(p));
    out.name.textContent = p.name;
    out.role.textContent = p.role;
    out.bpm.textContent = p.bpm;
    out.desc.textContent = p.desc;
    sweep?.cancel();
    if (reduceMQ.matches) return;
    // interruptible: sweeping the mouse down the roster never restarts from blank
    const from = readoutText._swap ? parseFloat(getComputedStyle(readoutText).opacity) : 0.35;
    readoutText._swap?.cancel();
    readoutText._swap = readoutText.animate([{ opacity: Math.min(from, 0.35) }, { opacity: 1 }], { duration: 160, easing: EASE_OUT });
    // the monitor draws left to right at the person's own pace
    sweep = ecg.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: 20000 / (p.bpm / 20) * 1.2, iterations: Infinity, easing: 'linear' }
    );
  }

  for (const b of buttons) {
    b.addEventListener('click', () => select(b.dataset.person));
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && finePointer.matches) select(b.dataset.person); });
  }
  current = null;
  select('foggy');

  /* ---------- arriving at Hell's Kitchen ---------- */

  // The destination answers: one echo from its lead photograph once the scroll lands.
  const hkLead = document.querySelector('.hk-a .frame');
  for (const a of document.querySelectorAll('a[href="#hells-kitchen"]')) {
    a.addEventListener('click', () => {
      if (!motionOK()) return;
      // wait until the smooth scroll has actually settled (it can outlast any fixed timeout)
      const t0 = performance.now();
      let lastY = -1, still = 0;
      const poll = setInterval(() => {
        still = scrollY === lastY ? still + 1 : 0;
        lastY = scrollY;
        const r = hkLead.getBoundingClientRect();
        const arrived = r.top < innerHeight && r.bottom > 0 && still >= 2;
        if (!arrived && performance.now() - t0 < 3000) return;
        clearInterval(poll);
        echo(r.left + r.width / 2, Math.min(r.top + r.height / 2, innerHeight * 0.6));
      }, 100);
    });
  }

  /* ---------- entrances ---------- */

  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  // stagger siblings that arrive together
  for (const group of document.querySelectorAll('.run-list, .hk-mosaic, .hk-strip, .who')) {
    [...group.querySelectorAll(':scope > .reveal')].forEach((el, i) => el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms'));
  }
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- lights toggle ---------- */

  const lightsBtn = document.querySelector('.lights-toggle');
  const syncLights = () => {
    const on = root.classList.contains('all-lit');
    lightsBtn.setAttribute('aria-pressed', String(on));
  };
  lightsBtn.addEventListener('click', () => {
    root.classList.toggle('all-lit');
    try { localStorage.setItem('dd-lights', root.classList.contains('all-lit') ? 'on' : 'off'); } catch (e) {}
    syncLights();
  });
  syncLights();

  /* ---------- first echo: the page listens once on arrival ---------- */

  if (motionOK()) {
    const first = () => {
      const r = cellsEl.getBoundingClientRect();
      if (r.bottom > 0) echo(r.left + r.width * 0.5, r.top + r.height * 0.5, { big: true });
    };
    (document.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(first, 450));
  }
})();

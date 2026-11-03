// Dev-only: worst-case content fixture behind a Demo / Worst case / Big text toggle.
// Loaded only on localhost (see the loader at the end of index.html). Never ships.
(() => {
  if (!["localhost", "127.0.0.1"].includes(location.hostname)) return;
  const params = new URLSearchParams(location.search);
  const mode = params.get('data') || 'demo';

  const WORST_TEXT = [
    ['#who-title', 'Ein Anwalt, der mit den Ohren sieht'],
    ['#runs-title', 'Sechzig Jahre, zehn Durchläufe'],
    ['#people-title', 'Schurken und Verbündete, nach Herzschlag'],
    ['#hk-title', "Hell's Kitchen ist ein echter Ort"],
    ['.run:nth-child(2) .run-title', 'Daredevil: The Man Without Fear, Volume 2 Omnibus<span class="run-by">Brian Michael Bendis, Alex Maleev, David Mack, Manuel Gutiérrez &amp; Matt Hollingsworth</span>'],
    ['.run:nth-child(3) .run-years', '2001–2006'],
    ['.run:nth-child(4) .run-why', 'A long-form, politically charged arc that rewards a second read and a library card with no late fees.'],
    ['.hk-c figcaption', "West 46th Street between Ninth and Tenth Avenues, July 1973. Photograph by Danny Lyon for the EPA's Documerica project."],
    ['.hk-a figcaption', 'Neon in a shop window.'],
  ];

  if (mode === 'worst') {
    for (const [sel, html] of WORST_TEXT) {
      const el = document.querySelector(sel);
      if (el) el.innerHTML = html;
    }
    window.__ddWorstPeople = {
      kingpin: { name: 'Wilson Grant Fisk, the Kingpin of Crime', role: 'Rogue', bpm: 118, desc: 'Runs the city’s crime like a business and the business like a war. In Born Again he learns Matt’s name, takes his practice, his licence, his apartment and his savings, and nearly ends him without ever throwing a punch himself.' },
    };
  }
  if (mode === 'bigtext') document.documentElement.style.fontSize = '200%';

  const bar = document.createElement('div');
  bar.setAttribute('style', 'position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:99;display:flex;gap:2px;padding:3px;background:#d4d4d8;border-radius:999px;font:12px/1 system-ui,sans-serif');
  for (const [k, label] of [['demo', 'Demo data'], ['worst', 'Worst case'], ['bigtext', 'Text 200%']]) {
    const a = document.createElement('a');
    a.href = '?data=' + k;
    a.textContent = label;
    a.setAttribute('style', `padding:7px 12px;border-radius:999px;text-decoration:none;color:#111;${k === mode ? 'background:#fff' : ''}`);
    bar.append(a);
  }
  document.body.append(bar);
})();

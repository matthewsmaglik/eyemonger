(function () {
  var tiles = [
    { n: '01', c: 'film', f: 1, wide: 1, tags: 'film · brand', bg: '#EDEBE4', fg: '#0E0E0E', v: 'loop-01-drift' },
    { n: '02', c: 'design', f: 1, tags: 'graphic design · culture', bg: '#0E0E0E', fg: '#EDEBE4', v: 'loop-02-bloom' },
    { n: '03', c: 'direction', f: 1, tags: 'creative direction · brand', bg: '#2440D8', fg: '#EDEBE4' },
    { n: '04', c: 'producing', tags: 'producing · film', bg: '#9C9A94', fg: '#0E0E0E' },
    { n: '05', c: 'original', f: 1, tags: 'film · original', bg: '#CBA97E', fg: '#0E0E0E', v: 'loop-03-mesh' },
    { n: '06', c: 'direction', f: 1, wide: 1, tags: 'creative direction · culture', bg: '#B8321C', fg: '#EDEBE4', v: 'loop-06-flow' },
    { n: '07', c: 'design', tags: 'graphic design · brand', bg: '#EDEBE4', fg: '#0E0E0E' },
    { n: '08', c: 'producing', tags: 'producing · culture', bg: '#1F4D4A', fg: '#EDEBE4', v: 'loop-04-tide' },
    { n: '09', c: 'film', tags: 'film · culture', bg: '#0E0E0E', fg: '#EDEBE4' },
    { n: '10', c: 'original', tags: 'graphic design · original', bg: '#E3B23C', fg: '#0E0E0E', v: 'loop-05-iris' }
  ];
  var wall = document.getElementById('wall');
  tiles.forEach(function (t, i) {
    var el = document.createElement('article');
    el.className = 'tile' + (t.wide ? ' wide' : '');
    el.dataset.c = t.c;
    el.dataset.f = t.f ? '1' : '0';
    el.style.setProperty('--bg', t.bg);
    el.style.setProperty('--fg', t.fg);
    el.innerHTML =
      (t.v ? '<video class="bgv" src="media/' + t.v + '.mp4" poster="media/' + t.v + '.jpg" muted loop playsinline preload="metadata" aria-hidden="true"></video>' : '') +
      '<span class="corner tl">' + t.n + '</span>' +
      '<span class="corner tr">' + t.tags + '</span>' +
      '<span class="eye" data-eye="t' + i + '" aria-hidden="true">( o )</span>' +
      '<div class="corner bl"><strong>[PROJECT TITLE]</strong><span>[CLIENT] · [YEAR]</span></div>' +
      '<div class="corner br"><button type="button" data-play="' + i + '">quick play</button><a href="#work">case study</a></div>';
    wall.appendChild(el);
  });

  // placeholder loops: play only while on screen, never with reduced motion
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  function playIt(v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var vids = Array.prototype.slice.call(wall.querySelectorAll('video'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !still.matches) playIt(en.target); else en.target.pause();
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  } else if (!still.matches) {
    vids.forEach(playIt);
  }

  var P = [[-0.6, -0.8, 1], [0.6, 0, 1], [-0.6, 0, 1], [-0.6, 0.8, 1], [0, 0, 0.1], [0.6, 0.8, 1]];
  function rest(id) {
    if (/^[pq]\d$/.test(id)) return P[+id[1]];
    if (id === 'wm') return [0, 0, 1];
    if (id === 'ab') return [0, 0.8, 1];
    var h = 7;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1009;
    return P[h % 6];
  }
  function typed(v, shut, n) {
    n = n || 3;
    var ch = 'o';
    if (v[2] < 0.15) ch = 'O';
    else if (v[1] < -0.4) ch = '°';
    else if (v[1] > 0.4) ch = '.';
    if (shut) ch = '-';
    var mid = Math.floor(n / 2);
    var slot = (v[2] < 0.15 || shut) ? mid : Math.max(0, Math.min(n - 1, Math.round((v[0] + 1) / 2 * (n - 1))));
    var s = '(';
    for (var j = 0; j < n; j++) s += j === slot ? ch : ' ';
    return s + ')';
  }

  var eyes = Array.prototype.slice.call(document.querySelectorAll('[data-eye]'));
  var looks = {}, shut = {}, pt = null, lastMove = 0, raf = 0;

  function render() {
    eyes.forEach(function (el) {
      var id = el.dataset.eye;
      var off = !!el.closest('.off');
      var s = typed(looks[id] || rest(id), off || shut[id], +el.dataset.n || 3);
      if (el.textContent !== s) el.textContent = s;
    });
  }
  function look(x, y) {
    looks = {};
    eyes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width) return;
      var dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.min(1, d / Math.max(30, r.width * 1.2));
      looks[el.dataset.eye] = [dx / d * k, dy / d * k, k];
    });
    render();
  }
  document.addEventListener('pointermove', function (e) {
    pt = [e.clientX, e.clientY];
    lastMove = Date.now();
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; look(pt[0], pt[1]); });
  });
  document.addEventListener('pointerleave', function () { lastMove = 0; });
  window.addEventListener('scroll', function () {
    if (pt && Date.now() - lastMove < 5000) look(pt[0], pt[1]);
  }, { passive: true });

  setInterval(function () {
    if (Date.now() - lastMove < 5000) return;
    if (Math.random() < 0.3) { looks = {}; render(); return; }
    look(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
  }, 2400);

  var blinkTo = 0;
  setInterval(function () {
    var ids = eyes.map(function (el) { return el.dataset.eye; });
    var all = Math.random() < 0.04;
    shut = {};
    if (all) ids.forEach(function (id) { shut[id] = true; });
    else for (var i = 0; i < 2; i++) shut[ids[Math.floor(Math.random() * ids.length)]] = true;
    render();
    clearTimeout(blinkTo);
    blinkTo = setTimeout(function () { shut = {}; render(); }, all ? 200 : 160);
  }, 700);

  // filters
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.filters button'));
  function setFilter(f) {
    buttons.forEach(function (b) {
      var on = b.dataset.f === f;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(wall.children, function (t) {
      var match = f === 'all' || (f === 'featured' ? t.dataset.f === '1' : t.dataset.c === f);
      t.classList.toggle('off', !match);
    });
    render();
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.f); }); });

  // quick play
  var player = document.getElementById('player');
  var closeBtn = document.getElementById('plClose');
  var opener = null;
  wall.addEventListener('click', function (e) {
    var b = e.target.closest('[data-play]');
    if (!b) return;
    var t = tiles[+b.dataset.play];
    opener = b;
    player.style.setProperty('--bg', t.bg);
    player.style.setProperty('--fg', t.fg);
    var pv = document.getElementById('plVideo');
    if (t.v) {
      pv.poster = 'media/' + t.v + '.jpg';
      pv.src = 'media/' + t.v + '.mp4';
      pv.hidden = false;
      if (!still.matches) playIt(pv);
    } else {
      pv.pause(); pv.removeAttribute('src'); pv.load(); pv.hidden = true;
    }
    document.getElementById('plTitle').textContent = t.n + '  [PROJECT TITLE]';
    player.hidden = false;
    closeBtn.focus();
    if (pt) look(pt[0], pt[1]); else render();
  });
  function closePlayer() {
    player.hidden = true;
    document.getElementById('plVideo').pause();
    if (opener) opener.focus();
  }
  closeBtn.addEventListener('click', closePlayer);
  player.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePlayer(); });

  render();
})();

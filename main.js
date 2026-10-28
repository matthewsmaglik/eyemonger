(function () {
  var tiles = [
    { n: '01', c: 'video', wide: 1, tags: 'video · brand', bg: '#EDEBE4', fg: '#0E0E0E', v: 'loop-01-drift' },
    { n: '02', c: 'graphics', tags: 'graphics · culture', bg: '#0E0E0E', fg: '#EDEBE4', v: 'loop-02-bloom' },
    { n: '03', c: 'global', tags: 'global · brand', bg: '#2C5FD0', fg: '#EDEBE4' },
    { n: '04', c: 'photo', tags: 'photo · culture', bg: '#8FA5B5', fg: '#0E0E0E' },
    { n: '05', c: 'video', tags: 'video · original', bg: '#C9892F', fg: '#0E0E0E', v: 'loop-03-mesh' },
    { n: '06', c: 'graphics', wide: 1, tags: 'graphics · brand', bg: '#6E5AA8', fg: '#EDEBE4' },
    { n: '07', c: 'photo', tags: 'photo · brand', bg: '#EDEBE4', fg: '#0E0E0E' },
    { n: '08', c: 'global', tags: 'global · culture', bg: '#5F7D52', fg: '#EDEBE4', v: 'loop-04-tide' },
    { n: '09', c: 'video', tags: 'video · culture', bg: '#7B4A2A', fg: '#EDEBE4' },
    { n: '10', c: 'graphics', tags: 'graphics · original', bg: '#8D7B3C', fg: '#0E0E0E', v: 'loop-05-iris' }
  ];
  var wall = document.getElementById('wall');
  tiles.forEach(function (t, i) {
    var el = document.createElement('article');
    el.className = 'tile' + (t.wide ? ' wide' : '');
    el.dataset.c = t.c;
    el.dataset.i = i;
    el.style.setProperty('--bg', t.bg);
    el.style.setProperty('--fg', t.fg);
    el.innerHTML =
      (t.v ? '<video class="bgv" src="media/' + t.v + '.mp4?v=2" poster="media/' + t.v + '.jpg?v=2" muted loop playsinline preload="metadata" aria-hidden="true"></video>' : '') +
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
  var vids = Array.prototype.slice.call(document.querySelectorAll('video.bgv:not(#plVideo)'));
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
    if (id === 'wm' || id === 'te') return [0, 0, 1];
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
      var match = f === 'all' || t.dataset.c === f;
      t.classList.toggle('off', !match);
    });
    render();
  }
  var FILTERS = buttons.map(function (b) { return b.dataset.f; });
  function setHash(h) { try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (err) {} }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      setFilter(b.dataset.f);
      setHash(b.dataset.f === 'all' ? 'work' : b.dataset.f);
    });
  });
  function fromHash() {
    var h = location.hash.slice(1);
    if (h && h !== 'all' && FILTERS.indexOf(h) > -1) {
      setFilter(h);
      document.getElementById('work').scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', fromHash);

  // quick play
  var player = document.getElementById('player');
  var closeBtn = document.getElementById('plClose');
  var pv = document.getElementById('plVideo');
  var opener = null, current = -1;
  function visible() {
    return Array.prototype.filter.call(wall.children, function (t) { return !t.classList.contains('off'); })
      .map(function (t) { return +t.dataset.i; });
  }
  function show(i) {
    var t = tiles[i];
    current = i;
    player.style.setProperty('--bg', t.bg);
    player.style.setProperty('--fg', t.fg);
    if (t.v) {
      pv.poster = 'media/' + t.v + '.jpg?v=2';
      pv.src = 'media/' + t.v + '.mp4?v=2';
      pv.hidden = false;
      if (!still.matches) playIt(pv);
    } else {
      pv.pause(); pv.removeAttribute('src'); pv.load(); pv.hidden = true;
    }
    document.getElementById('plTitle').textContent = t.n + '  [PROJECT TITLE]';
    var vis = visible();
    document.getElementById('plCount').textContent = String(vis.indexOf(i) + 1).padStart(2, '0') + ' / ' + String(vis.length).padStart(2, '0');
  }
  function openPlayer(i, from) {
    opener = from || null;
    show(i);
    player.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function step(d) {
    var vis = visible();
    if (!vis.length) return;
    var k = vis.indexOf(current);
    show(vis[(k + d + vis.length) % vis.length]);
  }
  function closePlayer() {
    player.hidden = true;
    pv.pause();
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }
  wall.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    var tile = e.target.closest('.tile');
    if (!tile || tile.classList.contains('off')) return;
    openPlayer(+tile.dataset.i, e.target.closest('[data-play]') || tile.querySelector('[data-play]'));
  });
  closeBtn.addEventListener('click', closePlayer);
  document.getElementById('plPrev').addEventListener('click', function () { step(-1); });
  document.getElementById('plNext').addEventListener('click', function () { step(1); });
  player.addEventListener('click', function (e) { if (e.target === player || e.target === pv) closePlayer(); });
  document.addEventListener('keydown', function (e) {
    if (player.hidden) return;
    if (e.key === 'Escape') closePlayer();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });

  // copy email
  var mailBtn = document.getElementById('copyMail');
  var copied = document.getElementById('copied');
  var copiedTo = 0;
  function flash(msg) {
    copied.textContent = msg;
    clearTimeout(copiedTo);
    copiedTo = setTimeout(function () { copied.textContent = ''; }, 1800);
  }
  function selectMail() {
    try {
      var r = document.createRange(); r.selectNodeContents(mailBtn);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    } catch (err) {}
  }
  mailBtn.addEventListener('click', function () {
    var addr = mailBtn.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(function () { flash('copied'); }, function () { selectMail(); flash('selected, press copy'); });
    } else { selectMail(); flash('selected, press copy'); }
  });

  // back to top eye
  var topEye = document.getElementById('topEye');
  var hero = document.querySelector('.hero');
  function topEyeState() {
    var on = window.scrollY > hero.offsetHeight * 0.8 && player.hidden;
    topEye.classList.toggle('on', on);
    topEye.tabIndex = on ? 0 : -1;
  }
  window.addEventListener('scroll', topEyeState, { passive: true });
  topEye.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: still.matches ? 'auto' : 'smooth' });
    setHash('');
  });

  // in-page links glide to their section
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: still.matches ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', '#' + id); } catch (err) {}
  });

  fromHash();
  topEyeState();
  render();
})();

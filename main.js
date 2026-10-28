/* Home page: the work wall, filters and quick play. Needs projects.js and eyes.js first. */
(function () {
  var tiles = window.EM_PROJECTS;
  var D = window.EM_CASE_DEFAULTS;
  var EM = window.EM;
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
      '<div class="corner bl"><strong>' + (t.title || D.title) + '</strong><span>' + (t.client || D.client) + ' · ' + (t.year || D.year) + '</span></div>' +
      '<div class="corner br"><button type="button" data-play="' + i + '">quick play</button><a href="project.html#' + t.slug + '">case study</a></div>';
    wall.appendChild(el);
  });
  EM.refresh();
  EM.watchVideos(wall);

  // filters, mirrored in the address (#video etc.) so a filtered view can be shared
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.filters button'));
  var FILTERS = buttons.map(function (b) { return b.dataset.f; });
  function setFilter(f) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === f ? 'true' : 'false'); });
    Array.prototype.forEach.call(wall.children, function (t) {
      t.classList.toggle('off', !(f === 'all' || t.dataset.c === f));
    });
    EM.render();
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      setFilter(b.dataset.f);
      EM.setHash(b.dataset.f === 'all' ? 'work' : b.dataset.f);
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
  function pad(n) { return String(n).padStart(2, '0'); }
  function show(i) {
    var t = tiles[i];
    current = i;
    player.style.setProperty('--bg', t.bg);
    player.style.setProperty('--fg', t.fg);
    if (t.v) {
      pv.poster = 'media/' + t.v + '.jpg?v=2';
      pv.src = 'media/' + t.v + '.mp4?v=2';
      pv.hidden = false;
      if (!EM.still.matches) EM.playIt(pv);
    } else {
      pv.pause(); pv.removeAttribute('src'); pv.load(); pv.hidden = true;
    }
    document.getElementById('plTitle').textContent = t.n + '  ' + (t.title || D.title);
    document.getElementById('plCase').href = 'project.html#' + t.slug;
    var vis = visible();
    document.getElementById('plCount').textContent = pad(vis.indexOf(i) + 1) + ' / ' + pad(vis.length);
  }
  function openPlayer(i, from) {
    opener = from || null;
    show(i);
    player.hidden = false;
    document.body.style.overflow = 'hidden';
    EM.topEyeState();
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
    EM.topEyeState();
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

  fromHash();
})();

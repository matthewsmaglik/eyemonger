/* Shared by every page: the typed eyes (cursor tracking, blinking, idle wandering),
   placeholder video playback, smooth in-page links, copy email, and the back-to-top eye. */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var page = document.body.dataset.page || 'home';

  // ---- eyes ----
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

  var eyes = [], looks = {}, shut = {}, pt = null, lastMove = 0, raf = 0;
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
  function refresh() {
    eyes = Array.prototype.slice.call(document.querySelectorAll('[data-eye]'));
    if (pt) look(pt[0], pt[1]); else render();
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
    if (!ids.length) return;
    var all = Math.random() < 0.04;
    shut = {};
    if (all) ids.forEach(function (id) { shut[id] = true; });
    else for (var i = 0; i < 2; i++) shut[ids[Math.floor(Math.random() * ids.length)]] = true;
    render();
    clearTimeout(blinkTo);
    blinkTo = setTimeout(function () { shut = {}; render(); }, all ? 200 : 160);
  }, 700);

  // ---- placeholder loops: play only on screen, never with reduced motion ----
  function playIt(v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !still.matches) playIt(en.target); else en.target.pause();
    });
  }, { rootMargin: '200px 0px' }) : null;
  function watchVideos(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('video.bgv:not(#plVideo)'), function (v) {
      if (v.dataset.watched) return;
      v.dataset.watched = '1';
      if (io) io.observe(v); else if (!still.matches) playIt(v);
    });
  }

  function setHash(h) { try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (err) {} }

  // ---- in-page links glide to their section ----
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: still.matches ? 'auto' : 'smooth', block: 'start' });
    if (page === 'home') setHash(id);
  });

  // ---- copy email ----
  var mailBtn = document.getElementById('copyMail');
  var copied = document.getElementById('copied');
  if (mailBtn && copied) {
    var copiedTo = 0;
    var flash = function (msg) {
      copied.textContent = msg;
      clearTimeout(copiedTo);
      copiedTo = setTimeout(function () { copied.textContent = ''; }, 1800);
    };
    var selectMail = function () {
      try {
        var r = document.createRange(); r.selectNodeContents(mailBtn);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      } catch (err) {}
    };
    mailBtn.addEventListener('click', function () {
      var addr = mailBtn.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(function () { flash('copied'); }, function () { selectMail(); flash('selected, press copy'); });
      } else { selectMail(); flash('selected, press copy'); }
    });
  }

  // ---- back to top eye ----
  var topEye = document.getElementById('topEye');
  var firstScreen = document.querySelector('[data-first]');
  function topEyeState() {
    if (!topEye) return;
    var player = document.getElementById('player');
    var limit = firstScreen ? firstScreen.offsetHeight * 0.8 : 600;
    var on = window.scrollY > limit && (!player || player.hidden);
    topEye.classList.toggle('on', on);
    topEye.tabIndex = on ? 0 : -1;
  }
  if (topEye) {
    window.addEventListener('scroll', topEyeState, { passive: true });
    topEye.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: still.matches ? 'auto' : 'smooth' });
      if (page === 'home') setHash('');
    });
  }

  window.EM = {
    still: still,
    playIt: playIt,
    watchVideos: watchVideos,
    setHash: setHash,
    refresh: refresh,
    render: render,
    topEyeState: topEyeState
  };
  refresh();
  watchVideos();
  topEyeState();
})();

/* Case study page. Reads the project from the address (project.html#project-01) and fills the template.
   Needs projects.js and eyes.js first. */
(function () {
  var list = window.EM_PROJECTS;
  var D = window.EM_CASE_DEFAULTS;
  var EM = window.EM;
  var PALETTE = [
    ['#0E0E0E', '#EDEBE4'], ['#EDEBE4', '#0E0E0E'], ['#8FA5B5', '#0E0E0E'], ['#8D7B3C', '#0E0E0E'],
    ['#6E5AA8', '#EDEBE4'], ['#2C5FD0', '#EDEBE4'], ['#7B4A2A', '#EDEBE4'], ['#5F7D52', '#EDEBE4'],
    ['#C9892F', '#0E0E0E'], ['#3A2418', '#EDEBE4']
  ];
  var CREDITS_SHOWN = 16;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function field(p, k) { return p[k] != null ? p[k] : D[k]; }
  function video(v) {
    return '<video class="bgv" src="media/' + v + '.mp4?v=2" poster="media/' + v + '.jpg?v=2" muted loop playsinline preload="metadata" aria-hidden="true"></video>';
  }
  // palette colors in a fixed order that starts after this project's own color
  function swatches(p, count) {
    var start = PALETTE.findIndex(function (c) { return c[0] === p.bg; });
    var out = [];
    for (var k = 1; out.length < count; k++) out.push(PALETTE[(start + k) % PALETTE.length]);
    return out;
  }
  function block(cls, colors, label, eyeId, v) {
    return '<figure class="' + cls + '" style="--bg:' + colors[0] + ';--fg:' + colors[1] + '">' +
      (v ? video(v) : '') +
      '<span class="corner tl">' + label + '</span>' +
      '<span class="eye" data-eye="' + eyeId + '" aria-hidden="true">( o )</span>' +
      '</figure>';
  }

  function render() {
    var slug = location.hash.slice(1);
    var i = Math.max(0, list.findIndex(function (p) { return p.slug === slug; }));
    var p = list[i];
    var title = field(p, 'title');
    document.title = (title.charAt(0) === '[' ? 'Case study ' + p.n : title) + ' · Eyemonger';

    // hero
    var hero = $('caseHero');
    hero.style.setProperty('--bg', p.bg);
    hero.style.setProperty('--fg', p.fg);
    var old = hero.querySelector('video');
    if (old) old.remove();
    if (p.v) hero.insertAdjacentHTML('afterbegin', video(p.v));
    $('heroTags').textContent = p.tags;
    $('heroCount').textContent = p.n + ' / ' + pad(list.length);

    // title, facts, copy
    $('caseTitle').textContent = title;
    $('caseLine').textContent = field(p, 'line');
    $('fClient').textContent = field(p, 'client');
    $('fRole').textContent = field(p, 'role');
    $('fYear').textContent = field(p, 'year');
    $('fFormat').textContent = field(p, 'format');
    $('cLede').textContent = field(p, 'lede');
    $('cBrief').textContent = field(p, 'brief');
    $('cMade').textContent = field(p, 'made');
    $('cReception').textContent = field(p, 'reception');
    $('cQuote').textContent = field(p, 'quote');
    $('cQuoteBy').textContent = field(p, 'quoteBy');

    // stills: one wide, two halves, three thirds
    var sw = swatches(p, 10);
    var html = '';
    var shapes = ['s-wide', 's-half', 's-half', 's-third', 's-third', 's-third'];
    shapes.forEach(function (cls, k) {
      html += block('still ' + cls, sw[k], '[STILL ' + pad(k + 1) + ']', 's' + k, null);
    });
    $('stills').innerHTML = html;

    // behind the scenes
    html = '';
    for (var b = 0; b < 4; b++) html += block('still s-bts', sw[6 + b] || sw[b], '[BTS ' + pad(b + 1) + ']', 'b' + b, null);
    $('bts').innerHTML = html;

    // press and awards
    $('press').innerHTML = field(p, 'press').map(function (r) {
      return '<li><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></li>';
    }).join('');
    $('awards').innerHTML = field(p, 'awards').map(function (r) {
      return '<li><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></li>';
    }).join('');

    // credits, folded after the first few
    var n = 0;
    $('credits').innerHTML = field(p, 'credits').map(function (g) {
      var groupStart = n;
      return '<div class="credit-group' + (groupStart >= CREDITS_SHOWN ? ' extra' : '') + '"><h3>' + esc(g[0]) + '</h3><dl>' + g[1].map(function (r) {
        n++;
        return '<div' + (n > CREDITS_SHOWN ? ' class="extra"' : '') + '><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
      }).join('') + '</dl></div>';
    }).join('');
    var more = $('moreCredits');
    var credits = $('credits');
    credits.classList.remove('open');
    more.hidden = n <= CREDITS_SHOWN;
    more.setAttribute('aria-expanded', 'false');
    more.dataset.n = n;
    more.textContent = '(show all ' + n + ' credits)';

    // next project
    var q = list[(i + 1) % list.length];
    var next = $('next');
    next.href = 'project.html#' + q.slug;
    next.style.setProperty('--bg', q.bg);
    next.style.setProperty('--fg', q.fg);
    old = next.querySelector('video');
    if (old) old.remove();
    if (q.v) next.insertAdjacentHTML('afterbegin', video(q.v));
    $('nextTitle').textContent = field(q, 'title');
    $('nextTags').textContent = q.tags;
    $('nextCount').textContent = q.n + ' / ' + pad(list.length);

    EM.refresh();
    EM.watchVideos();
  }

  $('moreCredits').addEventListener('click', function () {
    var open = $('credits').classList.toggle('open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.textContent = open ? '(show fewer credits)' : '(show all ' + this.dataset.n + ' credits)';
  });

  window.addEventListener('hashchange', function () {
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  render();
})();

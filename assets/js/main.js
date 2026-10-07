/* GrowLab — 공통 스크립트 */
(function () {
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: 스크롤 시 흰 배경 ---------- */
  var header = document.querySelector('[data-header]');
  var topBtn = document.querySelector('.q-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (topBtn) topBtn.classList.toggle('is-on', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = doc.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    document.querySelectorAll('.gnb a').forEach(function (a) {
      a.addEventListener('click', function () { doc.classList.remove('nav-open'); });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.classList.contains('nav-open')) { doc.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('.reveal, .process');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Tabs (채널) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = !on;
        if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  });

  /* ---------- Copy email ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var o = btn.textContent; btn.textContent = '복사됨'; setTimeout(function () { btn.textContent = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  /* ---------- Hero: 고객 여정 성장 곡선 ---------- */
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var svg = hero.querySelector('.growth');
  var nodes = Array.prototype.slice.call(hero.querySelectorAll('.g-node'));

  // 0~1000 × 0~600 좌표계의 노드 위치 (검색 → 블로그 → 플레이스 → 인스타그램 → 문의)
  var P = [[-20, 590], [175, 548], [430, 468], [640, 340], [800, 214], [935, 86]];
  var NODE_INDEX = [1, 2, 3, 4, 5];

  nodes.forEach(function (n, i) {
    var p = P[NODE_INDEX[i]];
    n.style.setProperty('--x', (p[0] / 10).toFixed(2));
    n.style.setProperty('--y', (p[1] / 6).toFixed(2));
  });

  var line = svg.querySelector('.growth-line');
  var glow = svg.querySelector('.growth-glow');
  var area = svg.querySelector('.growth-area');
  var arrow = svg.querySelector('.growth-arrow');
  var pulse = svg.querySelector('.growth-pulse');
  var W = 0, H = 0, L = 0, fracs = [];
  var progress = reduceMotion ? 1 : 0;

  function pathFor(pts) {
    // Catmull-Rom → cubic Bézier
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 0.18 * 1.0;
      var c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
      var c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
      d += ' C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }

  function layout() {
    var r = svg.getBoundingClientRect();
    W = r.width; H = r.height;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var pts = P.map(function (p) { return [p[0] / 1000 * W, p[1] / 600 * H]; });
    var d = pathFor(pts);
    line.setAttribute('d', d); glow.setAttribute('d', d);
    var end = pts[pts.length - 1];
    area.setAttribute('d', d + ' L' + end[0] + ',' + H + ' L' + pts[0][0] + ',' + H + ' Z');
    L = line.getTotalLength();
    // 각 노드가 곡선 위 어디쯤인지 (0~1)
    var samples = 300; fracs = [];
    NODE_INDEX.forEach(function (idx) {
      var target = pts[idx], best = 0, bestD = Infinity;
      for (var s = 0; s <= samples; s++) {
        var q = line.getPointAtLength(L * s / samples);
        var dd = (q.x - target[0]) * (q.x - target[0]) + (q.y - target[1]) * (q.y - target[1]);
        if (dd < bestD) { bestD = dd; best = s / samples; }
      }
      fracs.push(best);
    });
    // 끝 화살표 방향
    var a = line.getPointAtLength(L), b = line.getPointAtLength(L - 6);
    var ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
    arrow.setAttribute('transform', 'translate(' + (a.x + 4) + ',' + a.y + ') rotate(' + ang + ')');
    render();
  }

  function render() {
    var off = L * (1 - progress);
    line.style.strokeDasharray = L + ' ' + L; line.style.strokeDashoffset = off;
    glow.style.strokeDasharray = L + ' ' + L; glow.style.strokeDashoffset = off;
    nodes.forEach(function (n, i) { n.classList.toggle('is-on', progress >= fracs[i] - 0.001); });
    arrow.style.opacity = progress >= 0.999 ? 1 : 0;
  }

  layout();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });

  requestAnimationFrame(function () { hero.classList.add('is-live'); });
  if (reduceMotion) return;

  var DRAW_MS = 2600, start = null;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function draw(ts) {
    if (start === null) start = ts + 350;
    var t = Math.max(0, Math.min(1, (ts - start) / DRAW_MS));
    progress = ease(t); render();
    if (t < 1) requestAnimationFrame(draw); else startPulse();
  }
  requestAnimationFrame(draw);

  // 곡선을 따라 흐르는 빛 (화면에 보일 때만)
  var visible = true, pStart = null, PULSE_MS = 3400, PAUSE_MS = 1400;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) requestAnimationFrame(tick); }, { threshold: 0 }).observe(hero);
  }
  var running = false;
  function startPulse() { running = true; requestAnimationFrame(tick); }
  function tick(ts) {
    if (!running || !visible) return;
    if (pStart === null) pStart = ts;
    var t = ((ts - pStart) % (PULSE_MS + PAUSE_MS)) / PULSE_MS;
    if (t <= 1) {
      var q = line.getPointAtLength(L * ease(t));
      pulse.setAttribute('cx', q.x); pulse.setAttribute('cy', q.y);
      pulse.style.opacity = t < 0.08 ? t / 0.08 : (t > 0.9 ? (1 - t) / 0.1 : 1);
    } else {
      pulse.style.opacity = 0;
    }
    requestAnimationFrame(tick);
  }
})();

/* Click-to-play for Gabriel DaCruz's site. Nothing loads from YouTube or SoundCloud until a visitor
   presses play: then a YouTube video opens in a dialog (youtube-nocookie.com), and a SoundCloud
   playlist replaces its own button. Without JavaScript every link still opens the original page.
   Owner: site@AgentiCCells.gabriel-dacruz. Code Apache-2.0. */
(function () {
  var d = document, opener = null, dlg = d.getElementById('player');
  function frame(src, title, h) {
    var f = d.createElement('iframe');
    f.src = src; f.title = title; f.loading = 'lazy';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
    if (h) f.height = h;
    return f;
  }
  d.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = t.closest('a[data-yt]');
    if (a && dlg && dlg.showModal) {
      e.preventDefault();
      var id = a.getAttribute('data-yt'), title = a.getAttribute('data-title') || 'Video';
      dlg.classList.toggle('vertical', a.classList.contains('short'));
      dlg.querySelector('.pbox').replaceChildren(frame('https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0', title));
      dlg.querySelector('.pt').textContent = title;
      dlg.querySelector('.pyt').href = a.href;
      opener = a; dlg.showModal(); return;
    }
    a = t.closest('a[data-sc]');
    if (a) {
      e.preventDefault();
      var src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://api.soundcloud.com/playlists/' + a.getAttribute('data-sc')) + '&color=%23e0b56a&auto_play=true&visual=false&show_comments=false';
      var f = frame(src, a.getAttribute('data-title') || 'SoundCloud', 360);
      f.className = 'sc-frame'; a.replaceWith(f); f.focus();
    }
  });
  // Filter chips over each set of video groups, built from the group headings (no markup needed).
  var pt = (d.documentElement.lang || '').indexOf('pt') === 0;
  d.querySelectorAll('.vids').forEach(function (box) {
    var groups = box.querySelectorAll('.vgroup');
    if (groups.length < 2) return;
    var bar = d.createElement('div'); bar.className = 'vfilter'; bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', pt ? 'Filtrar os vídeos' : 'Filter the videos');
    function chip(label, g) {
      var b = d.createElement('button'); b.type = 'button'; b.textContent = label;
      b.setAttribute('aria-pressed', g === 'all' ? 'true' : 'false');
      b.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        groups.forEach(function (x) { x.hidden = !(g === 'all' || x === g); });
      });
      bar.appendChild(b);
    }
    chip(pt ? 'Todos' : 'All', 'all');
    groups.forEach(function (g) { var h = g.querySelector('h4'); if (h) chip(h.textContent, g); });
    box.insertBefore(bar, box.firstChild);
  });
  // The designs picker, opened from any link marked data-designs.
  var dd = d.getElementById('designs');
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-designs]');
    if (a && dd && dd.showModal && !e.metaKey && !e.ctrlKey) { e.preventDefault(); opener = a; dd.showModal(); }
  });
  if (dd) dd.addEventListener('click', function (e) {
    if (e.target.closest('.pclose') || e.target === dd) dd.close();
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target.closest('.pclose')) { dlg.close(); return; }
      if (e.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
    });
    dlg.addEventListener('close', function () { dlg.querySelector('.pbox').replaceChildren(); if (opener) { opener.focus(); opener = null; } });
  }
})();

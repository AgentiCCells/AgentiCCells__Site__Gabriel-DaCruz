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

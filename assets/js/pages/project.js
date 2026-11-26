/* Página del proyecto: video de YouTube embebido y enlaces */
(function () {
  var P = window.PC;
  var cfg = window.PC_CONFIG || {};

  // Acepta youtube.com/watch?v=, youtu.be/, /shorts/, /embed/ o solo el ID
  function youtubeId(url) {
    if (!url) return '';
    url = url.trim();
    if (/^[\w-]{11}$/.test(url)) return url;
    var m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  var id = youtubeId(cfg.videoUrl);
  var frame = document.getElementById('video-frame');
  if (id) {
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0" title="Video de demostración del proyecto PetCare" loading="lazy" ' +
      'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  } else {
    frame.innerHTML = '<div class="video-placeholder"><div><span class="play">' + P.icon('play') + '</span>' +
      '<strong style="color:#fff;font-size:1.125rem">El video de demostración aparecerá aquí</strong>' +
      '<p style="margin-top:6px">Agrega el enlace de YouTube en <code style="background:#3e4c59;color:#fff">assets/js/config.js</code></p></div></div>';
  }

  var links = [];
  if (cfg.figmaUrl) links.push('<a class="btn btn--secundario" href="' + cfg.figmaUrl + '" target="_blank" rel="noopener">Prototipo en Figma (Actividad 2)' + P.icon('external-link') + '</a>');
  if (cfg.repoUrl) links.push('<a class="btn btn--secundario" href="' + cfg.repoUrl + '" target="_blank" rel="noopener">Código en GitHub' + P.icon('external-link') + '</a>');
  document.getElementById('enlaces').innerHTML = '<span style="display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center">' + links.join('') + '</span>';
})();

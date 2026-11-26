/* =========================================================
   Tema claro / oscuro (HU-01 · mantenimiento perfectivo)
   - La primera vez respeta la preferencia del sistema.
   - Si el usuario elige un tema, se guarda en localStorage.
   - El <head> de cada página aplica el tema antes de pintar
     (ver el script en línea) para evitar el parpadeo.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});
  var KEY = 'petcare:tema';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Íconos Lucide (ISC) que usa el botón del tema
  P.ICONS = P.ICONS || {};
  P.ICONS.moon = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />';
  P.ICONS.sun = '<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />';

  function guardado() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }

  function aplicar(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', tema === 'oscuro' ? '#111A22' : '#0F766E');
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      var oscuro = tema === 'oscuro';
      b.setAttribute('aria-pressed', String(oscuro));
      b.setAttribute('title', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    });
  }

  P.tema = {
    actual: function () {
      return document.documentElement.getAttribute('data-tema') ||
        guardado() || (media && media.matches ? 'oscuro' : 'claro');
    },
    poner: function (tema) {
      try { window.localStorage.setItem(KEY, tema); } catch (e) { /* modo privado */ }
      aplicar(tema);
    },
    alternar: function () { P.tema.poner(P.tema.actual() === 'oscuro' ? 'claro' : 'oscuro'); },
    sincronizar: function () { aplicar(P.tema.actual()); }
  };

  // Si el usuario no ha elegido, seguimos los cambios del sistema
  if (media && media.addEventListener) {
    media.addEventListener('change', function (e) { if (!guardado()) aplicar(e.matches ? 'oscuro' : 'claro'); });
  }

  aplicar(P.tema.actual());
})();

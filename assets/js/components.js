/* =========================================================
   Componentes reutilizables (Web Components).
   Igual que en Figma se crearon componentes maestros (encabezado,
   pie, tarjeta de servicio…), aquí cada uno se programa una sola
   vez y se reutiliza en todas las páginas: <pc-header>, <pc-footer>.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});
  var I = function (n, c) { return P.icon(n, c); };

  /* ---------- Encabezado global + menú móvil (M2) ---------- */
  var NAV = [
    { id: 'inicio', txt: 'Inicio', href: 'index.html' },
    { id: 'servicios', txt: 'Servicios', href: 'servicios.html' },
    { id: 'como', txt: 'Cómo funciona', href: 'index.html#como-funciona' },
    { id: 'contacto', txt: 'Contacto', href: 'index.html#contacto' },
    { id: 'proyecto', txt: 'El proyecto', href: 'proyecto.html' }
  ];

  class PcHeader extends HTMLElement {
    connectedCallback() {
      var active = this.getAttribute('active') || '';
      var user = P.store.user();
      var cur = function (id) { return id === active ? ' aria-current="page"' : ''; };
      var cuenta = user
        ? '<a class="header-user" href="mi-cuenta.html"' + cur('cuenta') + '>' + I('circle-user') + P.esc(user.nombre.split(' ')[0]) + '</a>'
        : '<a class="header-user" href="ingresar.html">' + I('user') + 'Ingresar</a>';

      this.innerHTML =
        '<header class="site-header">' +
        '<div class="container site-header__inner">' +
        '<a class="logo" href="index.html" aria-label="PetCare, ir al inicio">' + I('paw-print') + 'PetCare</a>' +
        '<nav class="nav" aria-label="Navegación principal"><ul>' +
        NAV.map(function (n) { return '<li><a href="' + n.href + '"' + cur(n.id) + '>' + n.txt + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<div class="header-actions">' + cuenta + '<a class="btn btn--sm" href="agendar.html">Agendar cita</a></div>' +
        '<button class="theme-toggle" type="button" aria-label="Modo oscuro" aria-pressed="false">' +
        I('moon', 'theme-toggle__luna') + I('sun', 'theme-toggle__sol') + '</button>' +
        '<button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil">' + I('menu') + '</button>' +
        '</div></header>' +
        '<div class="mobile-menu" id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú">' +
        '<div class="mobile-menu__top"><a class="logo" href="index.html">' + I('paw-print') + 'PetCare</a>' +
        '<button class="menu-toggle" type="button" data-close aria-label="Cerrar menú" style="display:inline-flex">' + I('x') + '</button></div>' +
        '<nav aria-label="Menú móvil">' +
        NAV.map(function (n) { return '<a href="' + n.href + '"' + cur(n.id) + '>' + n.txt + I('chevron-right') + '</a>'; }).join('') +
        '<a href="' + (user ? 'mi-cuenta.html' : 'ingresar.html') + '"' + cur('cuenta') + '>Mi cuenta' + I('chevron-right') + '</a>' +
        '</nav>' +
        '<div class="mobile-menu__ctas"><a class="btn" href="agendar.html">Agendar cita</a>' +
        (user ? '<a class="btn btn--secundario" href="mi-cuenta.html">Hola, ' + P.esc(user.nombre.split(' ')[0]) + '</a>' : '<a class="btn btn--secundario" href="ingresar.html">Ingresar</a>') +
        '</div>' +
        '<ul class="mobile-menu__contact"><li>' + I('phone') + '+57 604 000 0000</li><li>' + I('clock') + 'Lun a Dom · 7:00 a 20:00</li><li>' + I('map-pin') + '3 sedes en Medellín</li></ul>' +
        '</div>';

      var menu = this.querySelector('.mobile-menu');
      var openBtn = this.querySelector('.site-header .menu-toggle');
      var closeBtn = menu.querySelector('[data-close]');
      var self = this;
      function setOpen(open) {
        menu.classList.toggle('is-open', open);
        openBtn.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('no-scroll', open);
        var main = document.querySelector('main');
        if (main) main.inert = open;
        if (open) closeBtn.focus(); else openBtn.focus();
      }
      var temaBtn = this.querySelector('.theme-toggle');
      if (P.tema) {
        temaBtn.addEventListener('click', function () { P.tema.alternar(); });
        P.tema.sincronizar();
      } else { temaBtn.hidden = true; }
      openBtn.addEventListener('click', function () { setOpen(true); });
      closeBtn.addEventListener('click', function () { setOpen(false); });
      menu.addEventListener('click', function (e) { if (e.target.closest('nav a')) { menu.classList.remove('is-open'); document.body.classList.remove('no-scroll'); var m = document.querySelector('main'); if (m) m.inert = false; } });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false); });
      self._ready = true;
    }
  }

  /* ---------- Pie de página ---------- */
  class PcFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<footer class="site-footer"><div class="container">' +
        '<div class="footer-grid">' +
        '<div class="footer-brand"><a class="logo" href="index.html">' + I('paw-print') + 'PetCare</a>' +
        '<p>Servicios profesionales para perros y gatos en Medellín: salud, belleza, paseos y guardería en un solo lugar.</p></div>' +
        '<div class="footer-col footer-col--extra"><h2>Servicios</h2><ul>' +
        '<li><a href="servicios.html?categoria=veterinaria">Veterinaria</a></li>' +
        '<li><a href="servicio.html?id=bano-peluqueria">Baño y peluquería</a></li>' +
        '<li><a href="servicios.html?categoria=paseos">Paseos</a></li>' +
        '<li><a href="servicios.html?categoria=guarderia">Guardería</a></li></ul></div>' +
        '<div class="footer-col"><h2>Empresa</h2><ul>' +
        '<li><a href="proyecto.html">Sobre el proyecto</a></li>' +
        '<li><a href="proyecto.html#video">Video de demostración</a></li>' +
        '<li><a href="index.html#como-funciona">Cómo funciona</a></li>' +
        '<li><a href="index.html#contacto">Sedes y contacto</a></li></ul></div>' +
        '<div class="footer-col footer-col--extra"><h2>Contacto</h2><ul>' +
        '<li>+57 604 000 0000</li><li>Cra. 43A #1-50, El Poblado</li><li>Lun a Dom · 7:00 a 20:00</li></ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' PetCare · Proyecto académico de Jesua Herazo Moreno · Marca ficticia</span>' +
        '<span><a href="proyecto.html#aviso">Términos</a> · <a href="proyecto.html#aviso">Privacidad</a> · <a href="proyecto.html#aviso">Tratamiento de datos</a></span></div>' +
        '</div></footer>';
    }
  }

  customElements.define('pc-header', PcHeader);
  customElements.define('pc-footer', PcFooter);

  /* ---------- Favoritos (HU-02) ---------- */
  P.ICONS.heart = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />';

  P.favButton = function (s) {
    var fav = P.store.user() ? P.store.esFavorito(s.id) : false;
    return '<button class="fav-btn" type="button" data-fav="' + s.id + '" aria-pressed="' + fav + '"' +
      ' aria-label="Guardar ' + P.esc(s.nombre) + ' en favoritos" title="' + (fav ? 'Quitar de favoritos' : 'Guardar en favoritos') + '">' +
      I('heart') + '</button>';
  };

  // Un solo manejador para todos los corazones del sitio
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    var id = b.getAttribute('data-fav');
    if (!P.store.user()) {
      P.toast('Ingresa a tu cuenta para guardar favoritos.', 'heart');
      setTimeout(function () { location.href = 'ingresar.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'servicios.html'); }, 1200);
      return;
    }
    var s = P.getServicio(id);
    var ahora = P.store.toggleFavorito(id);
    document.querySelectorAll('[data-fav="' + id + '"]').forEach(function (x) {
      x.setAttribute('aria-pressed', String(ahora));
      x.setAttribute('title', ahora ? 'Quitar de favoritos' : 'Guardar en favoritos');
    });
    P.toast((s ? s.nombre : 'Servicio') + (ahora ? ' se guardó en tus favoritos.' : ' se quitó de tus favoritos.'), 'heart');
    document.dispatchEvent(new CustomEvent('pc:favoritos', { detail: { id: id, favorito: ahora } }));
  });

  /* ---------- Tarjeta de servicio (componente de la Act. 2) ---------- */
  P.serviceCard = function (s) {
    return '<article class="card service-card">' + P.favButton(s) +
      '<div class="service-card__media">' + P.art(s.art) + '</div>' +
      '<div class="service-card__body">' +
      '<span><span class="tag">' + P.CATEGORIAS[s.categoria] + '</span></span>' +
      '<h3><a href="servicio.html?id=' + s.id + '">' + s.nombre + '</a></h3>' +
      '<p>' + s.corta + '</p>' +
      '<div class="service-card__meta"><span>' + I('star', 'star') + s.rating.toLocaleString('es-CO') + '</span><span>' + I('clock') + P.fmtDuracion(s.duracion) + '</span></div>' +
      '<div class="service-card__foot"><span class="service-card__price">Desde ' + P.money(s.desde) + '</span>' +
      '<span class="link-arrow" aria-hidden="true">Ver más' + I('arrow-right') + '</span></div>' +
      '</div></article>';
  };

  /* ---------- Avisos breves (toast) ---------- */
  P.toast = function (msg, icon) {
    var zone = document.querySelector('.toast-zone');
    if (!zone) {
      zone = document.createElement('div');
      zone.className = 'toast-zone'; zone.setAttribute('role', 'status'); zone.setAttribute('aria-live', 'polite');
      document.body.appendChild(zone);
    }
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = I(icon || 'info') + '<span>' + P.esc(msg) + '</span>';
    zone.appendChild(t);
    setTimeout(function () { t.classList.add('is-leaving'); setTimeout(function () { t.remove(); }, 250); }, 4200);
  };

  /* ---------- Animación al hacer scroll (respeta "reducir movimiento") ---------- */
  P.reveal = function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- Validación de formularios ---------- */
  P.setError = function (field, msg) {
    var f = field.closest('.field');
    if (!f) return;
    var err = f.querySelector('.field-error');
    if (!err) { err = document.createElement('p'); err.className = 'field-error'; err.id = (field.id || 'f') + '-error'; f.appendChild(err); }
    if (msg) {
      f.classList.add('has-error'); err.innerHTML = I('triangle-alert') + P.esc(msg);
      field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', err.id);
    } else {
      f.classList.remove('has-error'); field.removeAttribute('aria-invalid');
    }
  };
  P.validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  P.validCelular = function (v) { return /^3\d{9}$/.test(v.replace(/[\s-]/g, '')); };

  /* ---------- Botón flotante de WhatsApp por sede (HU-04 · adaptativo) ---------- */
  P.waLink = function (sedeId) {
    var sede = P.SEDES[sedeId];
    var nums = (window.PC_CONFIG && window.PC_CONFIG.whatsapp) || {};
    var num = String(nums[sedeId] || '').replace(/\D/g, '');
    var txt = 'Hola, PetCare ' + sede.nombre + '. Quisiera información sobre sus servicios para mi mascota.';
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(txt);
  };

  P.whatsappWidget = function () {
    if (document.querySelector('.wa') || !P.SEDES) return;
    var box = document.createElement('div');
    box.className = 'wa';
    box.innerHTML =
      '<div class="wa__panel" id="wa-panel" role="dialog" aria-labelledby="wa-titulo" hidden>' +
      '<div class="wa__head"><strong id="wa-titulo">¿Con qué sede quieres hablar?</strong>' +
      '<button class="icon-btn" type="button" data-wa-cerrar aria-label="Cerrar">' + I('x') + '</button></div>' +
      '<p class="wa__hint">Te respondemos por WhatsApp en horario de atención.</p><ul>' +
      Object.keys(P.SEDES).map(function (k) {
        var s = P.SEDES[k];
        return '<li><a href="' + P.waLink(k) + '" target="_blank" rel="noopener">' + I('map-pin') +
          '<span><strong>' + s.nombre + '</strong><small>' + s.horario + '</small></span>' + I('arrow-right') + '</a></li>';
      }).join('') + '</ul></div>' +
      '<button class="wa__fab" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Escríbenos por WhatsApp">' + I('message-circle') + '</button>';
    document.body.appendChild(box);

    var panel = box.querySelector('.wa__panel'), fab = box.querySelector('.wa__fab');
    function abrir(si) {
      panel.hidden = !si;
      fab.setAttribute('aria-expanded', String(si));
      if (si) panel.querySelector('a').focus();
    }
    fab.addEventListener('click', function () { abrir(panel.hidden); });
    box.querySelector('[data-wa-cerrar]').addEventListener('click', function () { abrir(false); fab.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { abrir(false); fab.focus(); } });
    document.addEventListener('click', function (e) { if (!panel.hidden && !box.contains(e.target)) abrir(false); });
  };

  document.addEventListener('DOMContentLoaded', function () {
    P.hydrateIcons();
    P.reveal();
    P.whatsappWidget();
  });
})();

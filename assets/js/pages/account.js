/* Mi cuenta (D7 / M5): resumen, mascotas, citas, perfil */
(function () {
  var P = window.PC;
  var $ = function (id) { return document.getElementById(id); };
  var user = P.store.user();
  if (!user) { location.replace('ingresar.html?next=mi-cuenta.html'); return; }

  function iniciales(n) { return n.split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }

  function render() {
    user = P.store.user();
    var pets = P.store.pets(), prox = P.store.proximas(), hist = P.store.historial();
    var anio = new Date().getFullYear();
    var esteAnio = P.store.citas().filter(function (c) { return c.estado !== 'cancelada' && c.fecha.slice(0, 4) === String(anio); }).length;

    $('u-avatar').textContent = iniciales(user.nombre);
    $('u-nombre').textContent = user.nombre;
    $('u-email').textContent = user.email;
    $('saludo').textContent = 'Hola, ' + user.nombre.split(' ')[0];

    var n = prox[0];
    $('stats').innerHTML =
      '<div class="card stat"><span class="bubble">' + P.icon('calendar') + '</span><span><small>Próxima cita</small><strong>' + (n ? P.fmtFecha(n.fecha) + ' · ' + n.hora : 'Sin citas') + '</strong></span></div>' +
      '<div class="card stat"><span class="bubble">' + P.icon('paw-print') + '</span><span><small>Mascotas registradas</small><strong>' + pets.length + '</strong></span></div>' +
      '<div class="card stat"><span class="bubble">' + P.icon('check') + '</span><span><small>Citas este año</small><strong>' + esteAnio + '</strong></span></div>';
    $('next-card').innerHTML = n
      ? '<small>Próxima cita</small><strong>' + P.esc(n.servicioNombre) + ' · ' + P.esc(n.mascotaNombre) + '</strong><span>' + P.fmtFecha(n.fecha) + ' · ' + P.fmtHora(n.hora) + ' · ' + P.SEDES[n.sede].nombre + '</span>'
      : '<small>Próxima cita</small><strong>No tienes citas pendientes</strong><span>Toca «Agendar» para reservar una.</span>';

    // Mascotas con etiquetas de estado (semáforo)
    $('lista-mascotas').innerHTML = pets.length ? pets.map(function (m) {
      var tags = m.vacunas === 'al-dia' ? '<span class="tag">Vacunas al día</span>' : '<span class="tag tag--ambar">Vacuna pendiente</span>';
      var sig = prox.filter(function (c) { return c.mascota === m.id; })[0];
      if (sig) {
        var d = P.diasHasta(sig.fecha);
        var corto = P.getServicio(sig.servicio) ? P.CATEGORIAS[P.getServicio(sig.servicio).categoria] : 'Cita';
        tags += '<span class="tag tag--ambar">' + corto + (d === 0 ? ' hoy' : d === 1 ? ' mañana' : ' en ' + d + ' días') + '</span>';
      }
      var datos = [P.ESPECIES[m.especie] === 'Otra' ? '' : (m.raza || P.ESPECIES[m.especie]), m.edad, m.peso].filter(Boolean).map(P.esc).join(' · ');
      return '<article class="card pet-card"><span class="pet-avatar pet-avatar--lg">' + P.petArt(m) + '</span><div>' +
        '<h3>' + P.esc(m.nombre) + '</h3><p>' + (datos || P.TAMANOS[m.tamano]) + '</p><div class="tags">' + tags + '</div>' +
        '<button class="link-btn" type="button" data-ficha="' + m.id + '">Ver ficha' + P.icon('arrow-right') + '</button></div></article>';
    }).join('') : '<div class="card empty" style="grid-column:1/-1"><span class="bubble-lg">' + P.icon('paw-print') + '</span><h3>Aún no tienes mascotas registradas</h3><p class="muted">Agrégalas para agendar más rápido.</p></div>';

    renderFavoritos();

    // Exportar CSV (HU-03): deshabilitado si no hay citas
    var hayCitas = P.store.citas().length > 0;
    $('btn-exportar').disabled = !hayCitas;
    $('btn-exportar').title = hayCitas ? 'Descargar todas tus citas en un archivo para Excel' : 'Aún no tienes citas para exportar';

    // Próximas citas
    $('lista-citas').innerHTML = prox.length ? '<div class="table-wrap"><table class="table"><thead><tr><th scope="col">Fecha</th><th scope="col">Servicio</th><th scope="col">Mascota</th><th scope="col">Sede</th><th scope="col">Estado</th><th scope="col"><span class="sr-only">Acciones</span></th></tr></thead><tbody>' +
      prox.map(function (c) {
        var e = P.ESTADOS[c.estado] || P.ESTADOS.confirmada;
        return '<tr><td data-col="fecha">' + P.fmtFecha(c.fecha) + ' · ' + c.hora + '</td><td data-col="servicio">' + P.esc(c.servicioNombre) + '</td>' +
          '<td data-col="mascota">' + P.esc(c.mascotaNombre) + '</td><td data-col="sede">' + P.SEDES[c.sede].nombre + '</td>' +
          '<td data-col="estado"><span class="tag ' + e.cls + '">' + e.txt + '</span></td>' +
          '<td data-col="acciones"><div class="actions"><a class="link-btn" href="agendar.html?reprogramar=' + encodeURIComponent(c.id) + '">Reprogramar</a>' +
          '<button class="link-btn link-btn--danger" type="button" data-cancelar="' + P.esc(c.id) + '">Cancelar</button></div></td></tr>';
      }).join('') + '</tbody></table></div>'
      : '<div class="card empty"><span class="bubble-lg">' + P.icon('calendar') + '</span><h3>No tienes citas próximas</h3><a class="btn btn--sm" href="agendar.html" style="width:auto">Agendar una cita</a></div>';

    $('historial').innerHTML = hist.length ? hist.map(function (c) {
      var e = P.ESTADOS[c.estado] || P.ESTADOS.atendida;
      return '<li><div>' + P.esc(c.servicioNombre) + ' · ' + P.esc(c.mascotaNombre) + (c.estado === 'cancelada' ? ' <span class="tag ' + e.cls + '">' + e.txt + '</span>' : '') + '</div><span>' + P.fmtFecha(c.fecha) + '</span></li>';
    }).join('') : '<li class="muted">Aquí verás las citas atendidas y canceladas.</li>';

    $('p-nombre').value = user.nombre;
    $('p-celular').value = user.celular || '';
    $('p-email').value = user.email;
  }

  // Mis favoritos (HU-02)
  function renderFavoritos() {
    var favs = P.store.favoritos().map(P.getServicio).filter(Boolean);
    $('lista-favoritos').innerHTML = favs.length ? favs.map(P.serviceCard).join('') :
      '<div class="card empty" style="grid-column:1/-1"><span class="bubble-lg">' + P.icon('heart') + '</span><h3>Aún no tienes servicios favoritos</h3>' +
      '<p class="muted">Toca el corazón de un servicio en el catálogo para guardarlo aquí.</p>' +
      '<a class="btn btn--sm" href="servicios.html" style="width:auto">Ver el catálogo</a></div>';
  }
  document.addEventListener('pc:favoritos', renderFavoritos);

  // Exportar historial de citas (HU-03)
  $('btn-exportar').addEventListener('click', function () {
    var citas = P.store.citas();
    if (!citas.length) return;
    P.csv.descargar(P.csv.nombreArchivo(), P.csv.construir(citas));
    P.toast('Descargamos ' + citas.length + (citas.length === 1 ? ' cita' : ' citas') + ' en un archivo CSV.', 'download');
  });

  // Cerrar sesión
  document.querySelectorAll('[data-logout]').forEach(function (b) {
    b.addEventListener('click', function () { P.store.logout(); location.href = 'index.html'; });
  });

  // Agregar mascota
  var dlgM = $('dlg-mascota');
  $('btn-add-pet').addEventListener('click', function () { $('form-mascota').reset(); P.setError($('m-nombre'), ''); dlgM.showModal(); $('m-nombre').focus(); });
  $('m-guardar').addEventListener('click', function (e) {
    var nombre = $('m-nombre').value.trim();
    if (nombre.length < 2) { e.preventDefault(); P.setError($('m-nombre'), 'Escribe el nombre.'); $('m-nombre').focus(); return; }
    P.store.addPet({ nombre: nombre, especie: $('m-especie').value, raza: $('m-raza').value.trim(), tamano: $('m-tamano').value,
      edad: $('m-edad').value.trim(), peso: $('m-peso').value.trim(), vacunas: $('m-vacunas').checked ? 'al-dia' : 'pendiente' });
    render(); P.toast(nombre + ' se agregó a tus mascotas.', 'paw-print');
  });

  // Ficha de la mascota
  var dlgF = $('dlg-ficha');
  dlgF.querySelector('[data-close]').addEventListener('click', function () { dlgF.close(); });
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-ficha]');
    if (f) {
      var m = P.store.pet(f.getAttribute('data-ficha'));
      var citas = P.store.citas().filter(function (c) { return c.mascota === m.id; }).sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });
      $('dlg-ficha-t').textContent = 'Ficha de ' + m.nombre;
      $('ficha-body').innerHTML = '<div style="display:flex;gap:16px;align-items:center"><span class="pet-avatar pet-avatar--lg">' + P.petArt(m) + '</span>' +
        '<dl class="kv" style="flex:1"><div><dt>Especie</dt><dd>' + P.ESPECIES[m.especie] + '</dd></div><div><dt>Raza</dt><dd>' + (P.esc(m.raza) || '—') + '</dd></div>' +
        '<div><dt>Tamaño</dt><dd>' + P.TAMANOS[m.tamano] + '</dd></div><div><dt>Edad · peso</dt><dd>' + (P.esc([m.edad, m.peso].filter(Boolean).join(' · ')) || '—') + '</dd></div></dl></div>' +
        '<label class="check"><input type="checkbox" id="f-vacunas"' + (m.vacunas === 'al-dia' ? ' checked' : '') + '><span>Vacunas al día</span></label>' +
        '<h3 style="font-size:1.0625rem">Citas</h3><ul class="history">' + (citas.length ? citas.map(function (c) {
          return '<li><div>' + P.esc(c.servicioNombre) + ' <span class="tag ' + P.ESTADOS[c.estado].cls + '">' + P.ESTADOS[c.estado].txt + '</span></div><span>' + P.fmtFecha(c.fecha) + '</span></li>';
        }).join('') : '<li class="muted">Sin citas todavía.</li>') + '</ul>';
      $('f-vacunas').addEventListener('change', function () { P.store.updatePet(m.id, { vacunas: this.checked ? 'al-dia' : 'pendiente' }); render(); });
      dlgF.showModal();
      return;
    }
    var c = e.target.closest('[data-cancelar]');
    if (c) {
      var cita = P.store.cita(c.getAttribute('data-cancelar'));
      $('cancelar-txt').textContent = cita.servicioNombre + ' para ' + cita.mascotaNombre + ' el ' + P.fmtFecha(cita.fecha) + ' a las ' + P.fmtHora(cita.hora) + '. Puedes volver a agendar cuando quieras.';
      var dlg = $('dlg-cancelar');
      dlg.onclose = function () {
        if (dlg.returnValue === 'si') { P.store.updateCita(cita.id, { estado: 'cancelada' }); render(); P.toast('Cita cancelada. Liberamos el horario.', 'circle-check'); }
      };
      dlg.returnValue = ''; dlg.showModal();
    }
  });

  // Perfil
  $('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('p-nombre'), cel = $('p-celular');
    var e1 = n.value.trim().length >= 3 ? '' : 'Escribe tu nombre completo.';
    var e2 = !cel.value.trim() || P.validCelular(cel.value) ? '' : 'Celular de 10 dígitos que empiece por 3.';
    P.setError(n, e1); P.setError(cel, e2);
    if (e1 || e2) return;
    P.store.updateUser({ nombre: n.value.trim(), celular: cel.value.trim() });
    render(); P.toast('Guardamos tus cambios.', 'circle-check');
  });
  $('borrar-datos').addEventListener('click', function () {
    if (window.confirm('¿Borrar tu sesión, mascotas y citas de este navegador? No se puede deshacer.')) { P.store.reset(); location.href = 'index.html'; }
  });

  // Menú lateral: resaltar la sección visible
  var links = document.querySelectorAll('#dash-nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.dash-section').forEach(function (s) { io.observe(s); });
  }

  render();
})();

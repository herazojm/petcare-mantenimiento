/* =========================================================
   Agendar cita (D4 / M4) — flujo principal del sitio.
   Paso 1: mascota + servicio + sede · Paso 2: fecha y hora ·
   Paso 3: datos de contacto. El resumen y el total se actualizan
   en vivo; al confirmar se guarda la cita y se va a la confirmación.
   ========================================================= */
(function () {
  var P = window.PC;
  var $ = function (id) { return document.getElementById(id); };
  var user = P.store.user();

  // ---------- Estado ----------
  var reprogramar = P.qs('reprogramar') ? P.store.cita(P.qs('reprogramar')) : null;
  if (reprogramar && reprogramar.estado === 'cancelada') reprogramar = null;
  var servicioInicial = P.getServicio(P.qs('servicio')) || (reprogramar && P.getServicio(reprogramar.servicio));
  var st = {
    mascota: reprogramar ? reprogramar.mascota : null,
    servicio: servicioInicial ? servicioInicial.id : '',
    sede: reprogramar ? reprogramar.sede : '',
    fecha: reprogramar ? reprogramar.fecha : '',
    hora: '',
    mes: null,
    intentado: false
  };
  var tamanoURL = P.TAMANOS[P.qs('tamano')] ? P.qs('tamano') : null;

  if (reprogramar) {
    $('titulo').textContent = 'Reprograma tu cita';
    document.title = 'Reprogramar cita · PetCare';
    $('volver').href = 'mi-cuenta.html#citas';
    $('volver').querySelector('span').textContent = 'Volver a mis citas';
  } else if (servicioInicial) {
    $('volver').href = 'servicio.html?id=' + servicioInicial.id;
    $('volver').querySelector('span').textContent = 'Volver al servicio';
  }

  // Si la mascota pedida no existe, elegir la primera
  var pets = P.store.pets();
  if (!st.mascota && pets.length) st.mascota = pets[0].id;

  // Prellenar contacto
  var c = reprogramar ? reprogramar.contacto : user;
  if (c) {
    $('c-nombre').value = c.nombre || '';
    $('c-celular').value = c.celular || '';
    $('c-email').value = c.email || '';
  }
  if (reprogramar) { $('c-notas').value = reprogramar.notas || ''; $('c-whatsapp').checked = reprogramar.whatsapp; }

  function servicio() { return P.getServicio(st.servicio); }
  function mascota() { return P.store.pet(st.mascota); }
  function tamano() { var m = mascota(); return m ? m.tamano : (tamanoURL || 'mediano'); }

  // ---------- Paso 1: mascotas ----------
  function renderMascotas() {
    pets = P.store.pets();
    $('mascotas').innerHTML = pets.map(function (m) {
      return '<div class="pet-option"><input type="radio" name="mascota" id="pet-' + m.id + '" value="' + m.id + '"' + (m.id === st.mascota ? ' checked' : '') + '>' +
        '<label for="pet-' + m.id + '"><span class="pet-avatar">' + P.petArt(m) + '</span><span><strong>' + P.esc(m.nombre) + '</strong>' +
        '<small>' + P.ESPECIES[m.especie] + ' · ' + P.esc(m.raza || P.TAMANOS[m.tamano]) + '</small></span><span class="check-mark">' + P.icon('check') + '</span></label></div>';
    }).join('') + '<button type="button" class="add-pet-btn" id="agregar-mascota">' + P.icon('plus') + 'Agregar mascota</button>';
    $('agregar-mascota').addEventListener('click', function () { $('nueva-mascota').hidden = false; $('np-nombre').focus(); });
    // El formulario de nueva mascota viene visible en el HTML (evita saltos de diseño);
    // se oculta si ya hay mascotas guardadas.
    if (pets.length) $('nueva-mascota').hidden = true; else if (tamanoURL) $('np-tamano').value = tamanoURL;
  }
  $('mascotas').addEventListener('change', function (e) { if (e.target.name === 'mascota') { st.mascota = e.target.value; actualizar(); } });

  $('np-guardar').addEventListener('click', function () {
    var nombre = $('np-nombre').value.trim();
    if (nombre.length < 2) { P.setError($('np-nombre'), 'Escribe el nombre de tu mascota.'); $('np-nombre').focus(); return; }
    P.setError($('np-nombre'), '');
    var m = P.store.addPet({ nombre: nombre, especie: $('np-especie').value, tamano: $('np-tamano').value, raza: $('np-raza').value.trim() });
    st.mascota = m.id;
    $('nueva-mascota').hidden = true;
    $('np-nombre').value = ''; $('np-raza').value = '';
    renderMascotas(); $('nueva-mascota').hidden = true; actualizar();
    P.toast(m.nombre + ' quedó guardada en tus mascotas.', 'paw-print');
  });
  $('np-cancelar').addEventListener('click', function () { $('nueva-mascota').hidden = true; });

  // ---------- Paso 1: servicio y sede ----------
  function renderServicios() {
    var m = mascota();
    $('servicio').innerHTML = '<option value="">Elige un servicio…</option>' + Object.keys(P.CATEGORIAS).map(function (cat) {
      return '<optgroup label="' + P.CATEGORIAS[cat] + '">' + P.SERVICIOS.filter(function (s) { return s.categoria === cat; }).map(function (s) {
        var ok = !m || s.especies.indexOf(m.especie) >= 0;
        return '<option value="' + s.id + '"' + (s.id === st.servicio ? ' selected' : '') + (ok ? '' : ' disabled') + '>' + s.nombre + (ok ? '' : ' (no disponible para ' + P.ESPECIES[m.especie].toLowerCase() + ')') + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }
  function renderSedes() {
    var s = servicio();
    var lista = s ? s.sedes : Object.keys(P.SEDES);
    if (lista.indexOf(st.sede) < 0) st.sede = lista[0];
    $('sede').innerHTML = lista.map(function (k) { return '<option value="' + k + '"' + (k === st.sede ? ' selected' : '') + '>Sede ' + P.SEDES[k].nombre + ' · ' + P.SEDES[k].direccion + '</option>'; }).join('');
  }
  $('servicio').addEventListener('change', function () { st.servicio = this.value; renderSedes(); st.hora = ''; renderHorarios(); actualizar(); });
  $('sede').addEventListener('change', function () { st.sede = this.value; st.hora = ''; renderHorarios(); actualizar(); });

  // ---------- Paso 2: calendario ----------
  var DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  function renderCalendario() {
    var hoy = P.hoy();
    var limite = P.addDays(hoy, 60);
    if (!st.mes) { var base = st.fecha ? P.parseISO(st.fecha) : hoy; st.mes = new Date(base.getFullYear(), base.getMonth(), 1); }
    var y = st.mes.getFullYear(), mo = st.mes.getMonth();
    var primero = new Date(y, mo, 1), dias = new Date(y, mo + 1, 0).getDate();
    var offset = (primero.getDay() + 6) % 7; // semana empieza el lunes
    var titulo = P.cap(primero.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }));
    var prevOk = new Date(y, mo, 1) > new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    var nextOk = new Date(y, mo + 1, 1) <= limite;
    var h = '<div class="calendar__head"><button type="button" class="icon-btn" data-mes="-1" aria-label="Mes anterior"' + (prevOk ? '' : ' disabled') + '>' + P.icon('chevron-left') + '</button>' +
      '<strong aria-live="polite">' + titulo + '</strong>' +
      '<button type="button" class="icon-btn" data-mes="1" aria-label="Mes siguiente"' + (nextOk ? '' : ' disabled') + '>' + P.icon('chevron-right') + '</button></div>' +
      '<div class="calendar__grid">' + DOW.map(function (d) { return '<span class="dow" aria-hidden="true">' + d + '</span>'; }).join('');
    for (var i = 0; i < offset; i++) h += '<span></span>';
    for (var d = 1; d <= dias; d++) {
      var f = new Date(y, mo, d), iso = P.toISO(f);
      var abierto = P.diaAbierto(f);
      h += '<button type="button" data-fecha="' + iso + '"' + (abierto ? '' : ' disabled') + (iso === st.fecha ? ' aria-pressed="true"' : ' aria-pressed="false"') +
        (iso === P.toISO(hoy) ? ' class="is-today"' : '') + ' aria-label="' + P.fmtFecha(iso, true) + '">' + d + '</button>';
    }
    $('calendario').innerHTML = h + '</div>';
  }
  $('calendario').addEventListener('click', function (e) {
    var m = e.target.closest('[data-mes]');
    if (m && !m.disabled) { st.mes = new Date(st.mes.getFullYear(), st.mes.getMonth() + +m.getAttribute('data-mes'), 1); renderCalendario(); return; }
    var d = e.target.closest('[data-fecha]');
    if (d && !d.disabled) elegirFecha(d.getAttribute('data-fecha'));
  });

  // Tira horizontal de días (móvil)
  function renderTira() {
    var hoy = P.hoy(), h = '';
    for (var i = 0; i < 21; i++) {
      var f = P.addDays(hoy, i), iso = P.toISO(f);
      h += '<button type="button" data-fecha="' + iso + '" aria-pressed="' + (iso === st.fecha) + '">' +
        '<span>' + P.cap(f.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '')) + '</span><strong>' + f.getDate() + '</strong>' +
        '<span class="sr-only"> de ' + f.toLocaleDateString('es-CO', { month: 'long' }) + '</span></button>';
    }
    $('tira-dias').innerHTML = h;
    var sel = $('tira-dias').querySelector('[aria-pressed="true"]');
    if (sel) $('tira-dias').scrollLeft = Math.max(0, sel.offsetLeft - 8);
  }
  $('tira-dias').addEventListener('click', function (e) { var d = e.target.closest('[data-fecha]'); if (d) elegirFecha(d.getAttribute('data-fecha')); });

  function elegirFecha(iso) {
    st.fecha = iso; st.hora = '';
    var f = P.parseISO(iso); st.mes = new Date(f.getFullYear(), f.getMonth(), 1);
    renderCalendario(); renderTira(); renderHorarios(); actualizar();
  }

  // ---------- Paso 2: horarios ----------
  function renderHorarios() {
    if (!st.fecha) {
      $('slots-titulo').textContent = 'Horarios disponibles';
      $('horarios').innerHTML = '<p class="slots-empty">Elige un día en el calendario para ver los horarios.</p>';
      return;
    }
    var lista = P.horarios(st.fecha, st.sede, reprogramar && reprogramar.id);
    $('slots-titulo').textContent = 'Horarios disponibles · ' + P.fmtFecha(st.fecha);
    var libres = lista.filter(function (x) { return x.disponible; }).length;
    $('horarios').innerHTML = lista.map(function (x) {
      var txt = x.hora.replace(/^0/, '') + (x.motivo === 'lleno' ? ' · lleno' : x.motivo === 'tuya' ? ' · tu cita' : '');
      return '<button type="button" data-hora="' + x.hora + '"' + (x.disponible ? '' : ' disabled') + ' aria-pressed="' + (x.hora === st.hora) + '"' +
        ' aria-label="' + P.fmtHora(x.hora) + (x.disponible ? '' : ', no disponible') + '">' + txt + '</button>';
    }).join('') + (libres ? '' : '<p class="slots-empty">No quedan horarios este día en esta sede. Prueba otro día u otra sede.</p>');
  }
  $('horarios').addEventListener('click', function (e) {
    var b = e.target.closest('[data-hora]'); if (!b || b.disabled) return;
    st.hora = b.getAttribute('data-hora'); renderHorarios(); actualizar();
  });

  // ---------- Validación ----------
  function validarContacto(mostrar) {
    var ok = true;
    var n = $('c-nombre'), cel = $('c-celular'), em = $('c-email');
    var errN = n.value.trim().length < 3 ? 'Escribe tu nombre completo.' : '';
    var errC = !P.validCelular(cel.value) ? 'Escribe un celular colombiano de 10 dígitos que empiece por 3.' : '';
    var errE = !P.validEmail(em.value.trim()) ? 'Escribe un correo válido, p. ej. nombre@correo.com.' : '';
    if (mostrar) { P.setError(n, errN); P.setError(cel, errC); P.setError(em, errE); }
    if (errN || errC || errE) ok = false;
    return ok;
  }
  ['c-nombre', 'c-celular', 'c-email'].forEach(function (id) {
    $(id).addEventListener('input', function () { if (st.intentado) validarContacto(true); actualizar(); });
    $(id).addEventListener('blur', function () { if (this.value) validarContacto(true); });
  });

  function compatible() { var s = servicio(), m = mascota(); return !(s && m && s.especies.indexOf(m.especie) < 0); }

  // ---------- Resumen, pasos y total ----------
  function actualizar() {
    var s = servicio(), m = mascota();
    renderServiciosSiCambia();

    var alerta = $('aviso-especie');
    if (!compatible()) {
      alerta.innerHTML = P.icon('triangle-alert') + '<span>' + s.nombre + ' no está disponible para ' + P.ESPECIES[m.especie].toLowerCase() + 's. Elige otro servicio u otra mascota.</span>';
      alerta.classList.add('is-visible');
    } else alerta.classList.remove('is-visible');

    var tam = tamano();
    $('r-servicio').innerHTML = '<span class="pet-avatar">' + P.art(s ? s.art : 'paw') + '</span><span><strong>' + (s ? s.nombre : 'Elige un servicio') + '</strong>' +
      '<small>' + P.TAMANOS[tam] + (s ? ' · ' + P.fmtDuracion(s.duracion) : '') + '</small></span>';

    var guion = '<span class="muted">—</span>';
    $('r-datos').innerHTML =
      '<div><dt>Mascota</dt><dd>' + (m ? P.esc(m.nombre) + (m.raza ? ' (' + P.esc(m.raza) + ')' : '') : guion) + '</dd></div>' +
      '<div><dt>Fecha</dt><dd>' + (st.fecha ? P.fmtFecha(st.fecha) + ' ' + P.parseISO(st.fecha).getFullYear() : guion) + '</dd></div>' +
      '<div><dt>Hora</dt><dd>' + (st.hora ? P.fmtHora(st.hora) : guion) + '</dd></div>' +
      '<div><dt>Sede</dt><dd>' + (st.sede ? P.SEDES[st.sede].nombre : guion) + '</dd></div>';

    var sub = s ? s.precios[tam] : 0;
    var primera = reprogramar ? reprogramar.descuento > 0 : P.store.esPrimeraCita();
    var desc = s && primera ? Math.round(sub * P.DESCUENTO_PRIMERA) : 0;
    st.subtotal = sub; st.descuento = desc; st.total = sub - desc;
    $('r-precios').innerHTML = '<div><dt>Subtotal</dt><dd>' + P.money(sub) + '</dd></div>' +
      (desc ? '<div class="discount"><dt>Descuento primera cita (10 %)</dt><dd>−' + P.money(desc) + '</dd></div>' : '');
    $('r-total').textContent = P.money(st.total);
    $('m-total').textContent = P.money(st.total);

    // Estado de los pasos
    var p1 = !!(m && s && st.sede && compatible());
    var p2 = !!(st.fecha && st.hora);
    var p3 = validarContacto(false);
    var activo = !p1 ? 1 : !p2 ? 2 : 3;
    document.querySelectorAll('#stepper [data-step]').forEach(function (li) {
      var n = +li.getAttribute('data-step'), hecho = n === 1 ? p1 : n === 2 ? p2 : (p1 && p2 && p3);
      li.classList.toggle('is-done', hecho && n !== activo);
      li.classList.toggle('is-active', n === activo);
      li.querySelector('.dot').innerHTML = hecho && n !== activo ? P.icon('check') : n;
      if (n === activo) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    document.querySelectorAll('#stepper .line').forEach(function (l, i) { l.classList.toggle('is-done', i === 0 ? p1 : p2); });
    var hechos = (p1 ? 1 : 0) + (p2 ? 1 : 0) + (p1 && p2 && p3 ? 1 : 0);
    $('progreso').style.width = Math.max(10, hechos / 3 * 100) + '%';
    $('paso-texto').textContent = 'Paso ' + activo + ' de 3 · ' + ['Mascota y servicio', 'Fecha y hora', 'Datos de contacto'][activo - 1];
  }
  var ultimoPet = null;
  function renderServiciosSiCambia() { if (ultimoPet !== st.mascota) { ultimoPet = st.mascota; renderServicios(); } }

  // ---------- Confirmar ----------
  $('form').addEventListener('submit', function (e) {
    e.preventDefault();
    st.intentado = true;
    var s = servicio(), m = mascota(), errores = [], foco = null;
    if (!m) { errores.push('Elige o agrega la mascota.'); foco = foco || $('agregar-mascota'); }
    if (!s) { errores.push('Elige un servicio.'); foco = foco || $('servicio'); }
    if (!compatible()) { errores.push('El servicio no está disponible para esa mascota.'); foco = foco || $('servicio'); }
    if (!st.fecha) { errores.push('Elige el día de la cita.'); foco = foco || $('calendario'); }
    else if (!st.hora) { errores.push('Elige la hora de la cita.'); foco = foco || $('horarios'); }
    else if (!P.horarios(st.fecha, st.sede, reprogramar && reprogramar.id).some(function (x) { return x.hora === st.hora && x.disponible; })) {
      errores.push('Ese horario acaba de ocuparse, elige otro.'); st.hora = ''; renderHorarios(); foco = foco || $('horarios');
    }
    if (!validarContacto(true)) { errores.push('Revisa tus datos de contacto.'); foco = foco || document.querySelector('.field.has-error .input'); }

    var box = $('errores');
    if (errores.length) {
      box.innerHTML = P.icon('triangle-alert') + '<span>' + errores.join(' ') + '</span>';
      box.classList.add('is-visible');
      actualizar();
      if (foco) { foco.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (foco.focus) foco.focus({ preventScroll: true }); }
      return;
    }
    box.classList.remove('is-visible');

    var contacto = { nombre: $('c-nombre').value.trim(), celular: $('c-celular').value.trim(), email: $('c-email').value.trim() };
    var id;
    if (reprogramar) {
      P.store.updateCita(reprogramar.id, { fecha: st.fecha, hora: st.hora, sede: st.sede, servicio: s.id, servicioNombre: s.nombre, mascota: m.id, mascotaNombre: m.nombre, tamano: m.tamano,
        subtotal: st.subtotal, descuento: st.descuento, total: st.total, contacto: contacto, notas: $('c-notas').value.trim(), whatsapp: $('c-whatsapp').checked, estado: 'confirmada' });
      id = reprogramar.id;
    } else {
      id = P.store.addCita({
        servicio: s.id, servicioNombre: s.nombre, mascota: m.id, mascotaNombre: m.nombre, tamano: m.tamano, sede: st.sede,
        fecha: st.fecha, hora: st.hora, subtotal: st.subtotal, descuento: st.descuento, total: st.total,
        contacto: contacto, notas: $('c-notas').value.trim(), whatsapp: $('c-whatsapp').checked, estado: 'confirmada'
      }).id;
    }
    if (user && !user.celular) P.store.updateUser({ celular: contacto.celular });
    location.href = 'confirmacion.html?id=' + encodeURIComponent(id) + (reprogramar ? '&reprogramada=1' : '');
  });

  // ---------- Arranque ----------
  renderMascotas();
  renderServicios(); ultimoPet = st.mascota;
  renderSedes();
  if (!st.fecha) {
    // Preseleccionar el primer día con horarios libres
    for (var i = 0; i < 7; i++) {
      var iso = P.toISO(P.addDays(P.hoy(), i));
      if (P.horarios(iso, st.sede).some(function (x) { return x.disponible; })) { st.fecha = iso; break; }
    }
  }
  renderCalendario(); renderTira(); renderHorarios(); actualizar();
})();

/* Cita confirmada (D5 / M6): resumen + agregar al calendario (.ics) */
(function () {
  var P = window.PC;
  var box = document.getElementById('confirmacion');
  var c = P.store.cita(P.qs('id'));

  if (!c) {
    box.innerHTML = '<span class="confirm__icon" style="background:var(--ambar-claro);color:var(--ambar-texto)">' + P.icon('calendar') + '</span>' +
      '<h1 style="font-size:2rem">No encontramos esa cita</h1><p class="muted">Puede que se haya agendado en otro navegador o que el enlace esté incompleto.</p>' +
      '<div class="confirm__ctas"><a class="btn" href="agendar.html">Agendar una cita</a><a class="btn btn--secundario" href="index.html">Volver al inicio</a></div>';
    return;
  }

  var s = P.getServicio(c.servicio), sede = P.SEDES[c.sede];
  var reprogramada = P.qs('reprogramada') === '1';
  var user = P.store.user();

  box.innerHTML =
    '<span class="confirm__icon">' + P.icon('check') + '</span>' +
    '<h1 style="font-size:clamp(2rem,1.6rem + 1.4vw,2.5rem)">' + (reprogramada ? '¡Cita reprogramada!' : '¡Cita agendada!') + '</h1>' +
    '<p class="muted" style="max-width:44ch">Te enviamos la confirmación a <strong>' + P.esc(c.contacto.email) + '</strong>' +
    (c.whatsapp ? ' y te llegará un recordatorio por WhatsApp un día antes.' : '.') + '</p>' +
    '<dl class="kv">' +
    '<div><dt>Servicio</dt><dd>' + P.esc(c.servicioNombre) + '</dd></div>' +
    '<div><dt>Mascota</dt><dd>' + P.esc(c.mascotaNombre) + '</dd></div>' +
    '<div><dt>Fecha y hora</dt><dd>' + P.fmtFecha(c.fecha) + ' · ' + P.fmtHora(c.hora) + '</dd></div>' +
    '<div><dt>Sede</dt><dd>' + sede.nombre + ' · ' + sede.direccion + '</dd></div>' +
    (c.descuento ? '<div class="discount"><dt>Descuento primera cita</dt><dd>−' + P.money(c.descuento) + '</dd></div>' : '') +
    '<div><dt>Total a pagar en sede</dt><dd>' + P.money(c.total) + '</dd></div>' +
    '</dl>' +
    '<p class="confirm__code">Código de la cita: <strong>' + P.esc(c.id) + '</strong></p>' +
    '<div class="confirm__ctas">' +
    '<a class="btn" href="' + (user ? 'mi-cuenta.html#citas' : 'ingresar.html?next=mi-cuenta.html') + '">Ver mis citas</a>' +
    '<a class="btn btn--secundario" href="index.html">Volver al inicio</a></div>' +
    '<button class="link-btn" type="button" id="ics">' + P.icon('calendar-plus') + 'Agregar a mi calendario</button>' +
    (user ? '' : '<p class="hint">¿Sin cuenta? Crea una para ver y reprogramar tus citas cuando quieras.</p>');

  // Archivo de calendario estándar (iCalendar, RFC 5545)
  document.getElementById('ics').addEventListener('click', function () {
    var p = c.fecha.split('-'), h = c.hora.split(':');
    var ini = new Date(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]);
    var fin = new Date(ini.getTime() + (s ? s.duracion : 60) * 60000);
    var f = function (d) { return d.getFullYear() + P.pad(d.getMonth() + 1) + P.pad(d.getDate()) + 'T' + P.pad(d.getHours()) + P.pad(d.getMinutes()) + '00'; };
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PetCare//Agenda//ES', 'BEGIN:VEVENT',
      'UID:' + c.id + '@petcare', 'DTSTAMP:' + f(new Date()), 'DTSTART;TZID=America/Bogota:' + f(ini), 'DTEND;TZID=America/Bogota:' + f(fin),
      'SUMMARY:PetCare · ' + c.servicioNombre + ' (' + c.mascotaNombre + ')',
      'LOCATION:Sede ' + sede.nombre + ' - ' + sede.direccion,
      'DESCRIPTION:Código ' + c.id + '. Total a pagar en sede: ' + P.money(c.total),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Mañana tienes cita en PetCare', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'cita-petcare-' + c.fecha + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    P.toast('Descargamos el evento. Ábrelo para agregarlo a tu calendario.', 'calendar-plus');
  });
})();

/* Detalle del servicio (D3): galería, selector de tamaño y precio dinámico */
(function () {
  var P = window.PC;
  var $ = function (id) { return document.getElementById(id); };
  var s = P.getServicio(P.qs('id'));

  if (!s) {
    document.querySelector('main').innerHTML = '<div class="container section"><div class="card empty"><span class="bubble-lg">' + P.icon('search') +
      '</span><h1 style="font-size:1.75rem">No encontramos ese servicio</h1><p class="muted">Puede que el enlace esté incompleto.</p>' +
      '<a class="btn" href="servicios.html" style="width:auto">Ver todos los servicios</a></div></div>';
    return;
  }

  document.title = s.nombre + ' · PetCare';
  $('miga').textContent = s.nombre;
  $('categoria').textContent = P.CATEGORIAS[s.categoria];
  $('nombre').textContent = s.nombre;
  $('rating').innerHTML = P.icon('star', 'star') + '<strong>' + s.rating.toLocaleString('es-CO') + '</strong> (' + s.resenas + ' reseñas)';
  $('duracion').innerHTML = P.icon('clock') + P.fmtDuracion(s.duracion);
  $('descripcion').textContent = s.descripcion;
  $('incluye').innerHTML = s.incluye.map(function (i) { return '<li>' + P.icon('check') + i + '</li>'; }).join('');
  $('sedes').innerHTML = P.icon('map-pin') + ' Disponible en: ' + s.sedes.map(function (k) { return P.SEDES[k].nombre; }).join(', ') +
    ' · Para: ' + s.especies.map(function (e) { return P.ESPECIES[e].toLowerCase() + 's'; }).join(', ').replace('otras', 'otras mascotas');
  $('sedes').querySelector('.icon').style.display = 'inline';

  // Galería: imagen principal + 4 miniaturas
  var vistas = [s.art, s.especies[0] === 'gato' ? 'cat' : 'dog', s.especies.indexOf('gato') >= 0 && s.especies[0] !== 'gato' ? 'cat' : 'paw', 'paw'];
  if (vistas[2] === vistas[3]) vistas[3] = s.especies[0] === 'gato' ? 'catbath' : 'puppy';
  function verFoto(i) {
    $('foto').innerHTML = P.art(vistas[i], 'Ilustración del servicio ' + s.nombre);
    $('miniaturas').querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); });
  }
  $('miniaturas').innerHTML = vistas.map(function (v, i) { return '<button type="button" aria-label="Ver imagen ' + (i + 1) + '">' + P.art(v) + '</button>'; }).join('');
  $('miniaturas').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    verFoto(Array.prototype.indexOf.call(this.children, b));
  });
  verFoto(0);

  // Selector de tamaño → actualiza precio y enlace de agendar
  var tam = P.qs('tamano') || 'mediano';
  $('tamanos').innerHTML = Object.keys(P.TAMANOS).map(function (k) {
    return '<input type="radio" name="tamano" id="t-' + k + '" value="' + k + '"' + (k === tam ? ' checked' : '') + '><label for="t-' + k + '">' + P.TAMANOS[k] + '</label>';
  }).join('');
  function precio() {
    tam = document.querySelector('input[name="tamano"]:checked').value;
    var unico = s.precios.pequeno === s.precios.grande;
    $('precio').textContent = (unico ? '' : '') + P.money(s.precios[tam]);
    $('agendar').href = 'agendar.html?servicio=' + s.id + '&tamano=' + tam;
  }
  $('tamanos').addEventListener('change', precio);
  precio();

  $('whatsapp').addEventListener('click', function () {
    P.toast('Demo académica: en la versión real este botón abre el chat de WhatsApp de la sede.', 'message-circle');
  });

  // Profesionales
  $('profesionales').innerHTML = s.profesionales.map(function (k) {
    var p = P.PROFESIONALES[k];
    var ini = p.nombre.replace(/^(Dr\.|Dra\.)\s*/, '').split(' ').map(function (x) { return x[0]; }).join('').slice(0, 2);
    return '<div class="card pro"><span class="avatar avatar--lg">' + ini + '</span><div><strong>' + p.nombre + '</strong><small>' + p.rol + '</small>' +
      '<small>' + P.icon('star', 'star') + ' ' + p.rating.toLocaleString('es-CO') + ' · ' + p.exp + ' años de experiencia</small></div></div>';
  }).join('');
  document.querySelectorAll('.pro small .icon').forEach(function (i) { i.style.display = 'inline'; i.style.width = '14px'; i.style.verticalAlign = '-2px'; });

  // Preguntas frecuentes (acordeón nativo <details>)
  $('faq').innerHTML = s.faq.map(function (f, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + f.q + P.icon('plus') + '</summary><div><p>' + f.a + '</p></div></details>';
  }).join('');

  // Relacionados: misma categoría primero
  var rel = P.SERVICIOS.filter(function (x) { return x.id !== s.id; })
    .sort(function (a, b) { return (b.categoria === s.categoria) - (a.categoria === s.categoria) || a.destacado - b.destacado; }).slice(0, 3);
  $('relacionados').innerHTML = rel.map(P.serviceCard).join('');
})();

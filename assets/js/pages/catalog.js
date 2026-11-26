/* Catálogo de servicios (D2 / M3): búsqueda, filtros, orden y paginación */
(function () {
  var P = window.PC;
  var POR_PAGINA = 6;
  var $ = function (id) { return document.getElementById(id); };

  // Estado inicial desde la URL (permite compartir un catálogo filtrado)
  var url = new URLSearchParams(location.search);
  var lista = function (k) { var v = url.get(k); return v ? v.split(',') : []; };
  var st = {
    q: url.get('q') || '',
    orden: url.get('orden') || 'recomendados',
    especie: lista('especie'),
    categoria: lista('categoria'),
    sede: lista('sede'),
    precio: +url.get('precio') || 75000,
    pagina: +url.get('pagina') || 1
  };

  function checks(cont, grupo, opciones) {
    $(cont).innerHTML = Object.keys(opciones).map(function (k) {
      var txt = typeof opciones[k] === 'string' ? opciones[k] : opciones[k].nombre;
      return '<label class="check"><input type="checkbox" name="' + grupo + '" value="' + k + '"' + (st[grupo].indexOf(k) >= 0 ? ' checked' : '') + '>' +
        '<span>' + txt + '</span><span class="count" data-count="' + grupo + ':' + k + '"></span></label>';
    }).join('');
  }
  checks('f-especie', 'especie', P.ESPECIES);
  checks('f-categoria', 'categoria', P.CATEGORIAS);
  checks('f-sede', 'sede', P.SEDES);
  $('buscar').value = st.q;
  $('orden').value = st.orden;
  $('precio').value = st.precio;

  // Píldoras rápidas de categoría (móvil)
  $('quick-cats').innerHTML = '<button type="button" data-cat="">Todos</button>' +
    Object.keys(P.CATEGORIAS).map(function (k) { return '<button type="button" data-cat="' + k + '">' + P.CATEGORIAS[k] + '</button>'; }).join('');

  function cumple(s, sin) {
    sin = sin || '';
    var q = st.q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var texto = (s.nombre + ' ' + s.corta + ' ' + P.CATEGORIAS[s.categoria]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (q && texto.indexOf(q) < 0) return false;
    if (sin !== 'especie' && st.especie.length && !st.especie.some(function (e) { return s.especies.indexOf(e) >= 0; })) return false;
    if (sin !== 'categoria' && st.categoria.length && st.categoria.indexOf(s.categoria) < 0) return false;
    if (sin !== 'sede' && st.sede.length && !st.sede.some(function (e) { return s.sedes.indexOf(e) >= 0; })) return false;
    if (s.desde > st.precio) return false;
    return true;
  }

  var ORDENES = {
    recomendados: function (a, b) { return a.destacado - b.destacado; },
    'precio-asc': function (a, b) { return a.desde - b.desde; },
    'precio-desc': function (a, b) { return b.desde - a.desde; },
    rating: function (a, b) { return b.rating - a.rating || b.resenas - a.resenas; },
    nombre: function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); }
  };

  function syncURL() {
    var u = new URLSearchParams();
    if (st.q) u.set('q', st.q);
    if (st.orden !== 'recomendados') u.set('orden', st.orden);
    ['especie', 'categoria', 'sede'].forEach(function (k) { if (st[k].length) u.set(k, st[k].join(',')); });
    if (st.precio < 75000) u.set('precio', st.precio);
    if (st.pagina > 1) u.set('pagina', st.pagina);
    var s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }

  function render() {
    var res = P.SERVICIOS.filter(function (s) { return cumple(s); }).sort(ORDENES[st.orden]);
    var paginas = Math.max(1, Math.ceil(res.length / POR_PAGINA));
    if (st.pagina > paginas) st.pagina = paginas;
    var vista = res.slice((st.pagina - 1) * POR_PAGINA, st.pagina * POR_PAGINA);

    $('conteo').textContent = res.length === 1 ? '1 servicio encontrado' : res.length + ' servicios encontrados';
    $('resultados').innerHTML = vista.length ? vista.map(P.serviceCard).join('') :
      '<div class="card empty" style="grid-column:1/-1"><span class="bubble-lg">' + P.icon('search') + '</span><h3>No encontramos servicios con esos filtros</h3>' +
      '<p class="muted">Prueba quitando algún filtro o buscando con otra palabra.</p><button class="btn btn--secundario btn--sm" type="button" data-limpiar style="width:auto">Limpiar filtros</button></div>';

    // Conteo por opción (cuántos resultados daría marcarla)
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var p = el.getAttribute('data-count').split(':'), grupo = p[0], val = p[1];
      var n = P.SERVICIOS.filter(function (s) {
        if (!cumple(s, grupo)) return false;
        return grupo === 'especie' ? s.especies.indexOf(val) >= 0 : grupo === 'categoria' ? s.categoria === val : s.sedes.indexOf(val) >= 0;
      }).length;
      el.textContent = n;
    });

    // Filtros activos como píldoras que se pueden quitar
    var chips = [];
    ['especie', 'categoria', 'sede'].forEach(function (g) {
      st[g].forEach(function (v) {
        var txt = g === 'especie' ? P.ESPECIES[v] : g === 'categoria' ? P.CATEGORIAS[v] : (P.SEDES[v] || {}).nombre;
        if (txt) chips.push('<button type="button" class="chip" data-quitar="' + g + ':' + v + '" aria-label="Quitar filtro ' + txt + '">' + txt + P.icon('x') + '</button>');
      });
    });
    if (st.precio < 75000) chips.push('<button type="button" class="chip" data-quitar="precio:" aria-label="Quitar filtro de precio">Hasta ' + P.money(st.precio) + P.icon('x') + '</button>');
    if (st.q) chips.push('<button type="button" class="chip" data-quitar="q:" aria-label="Quitar búsqueda">«' + P.esc(st.q) + '»' + P.icon('x') + '</button>');
    $('chips').innerHTML = chips.join('');
    var n = st.especie.length + st.categoria.length + st.sede.length + (st.precio < 75000 ? 1 : 0);
    $('n-filtros').textContent = n ? '(' + n + ')' : '';

    $('quick-cats').querySelectorAll('button').forEach(function (b) {
      var c = b.getAttribute('data-cat');
      b.setAttribute('aria-pressed', String(c ? (st.categoria.length === 1 && st.categoria[0] === c) : !st.categoria.length));
    });

    // Paginación
    var pag = '';
    if (paginas > 1) {
      pag += '<button type="button" data-pag="' + (st.pagina - 1) + '"' + (st.pagina === 1 ? ' disabled' : '') + ' aria-label="Página anterior">' + P.icon('chevron-left') + '</button>';
      for (var i = 1; i <= paginas; i++) pag += '<button type="button" data-pag="' + i + '"' + (i === st.pagina ? ' aria-current="page"' : '') + ' aria-label="Página ' + i + '">' + i + '</button>';
      pag += '<button type="button" data-pag="' + (st.pagina + 1) + '"' + (st.pagina === paginas ? ' disabled' : '') + ' aria-label="Página siguiente">' + P.icon('chevron-right') + '</button>';
    }
    $('paginacion').innerHTML = pag;
    $('precio-out').textContent = P.money(st.precio);
    syncURL();
  }

  function leerChecks() {
    ['especie', 'categoria', 'sede'].forEach(function (g) {
      st[g] = Array.prototype.map.call(document.querySelectorAll('input[name="' + g + '"]:checked'), function (i) { return i.value; });
    });
  }
  function marcarChecks() {
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(function (i) { i.checked = st[i.name].indexOf(i.value) >= 0; });
    $('precio').value = st.precio;
  }
  function limpiar() {
    st.especie = []; st.categoria = []; st.sede = []; st.precio = 75000; st.q = ''; st.pagina = 1;
    $('buscar').value = ''; marcarChecks(); render();
  }

  // Eventos
  $('filtros').addEventListener('change', function (e) { if (e.target.type === 'checkbox') { leerChecks(); st.pagina = 1; render(); } });
  $('precio').addEventListener('input', function () { st.precio = +this.value; st.pagina = 1; render(); });
  var t;
  $('buscar').addEventListener('input', function () { clearTimeout(t); var v = this.value; t = setTimeout(function () { st.q = v; st.pagina = 1; render(); }, 150); });
  $('orden').addEventListener('change', function () { st.orden = this.value; render(); });
  $('limpiar').addEventListener('click', limpiar);

  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quitar]');
    if (q) {
      var p = q.getAttribute('data-quitar').split(':');
      if (p[0] === 'precio') st.precio = 75000;
      else if (p[0] === 'q') { st.q = ''; $('buscar').value = ''; }
      else st[p[0]] = st[p[0]].filter(function (v) { return v !== p[1]; });
      st.pagina = 1; marcarChecks(); render(); return;
    }
    var pg = e.target.closest('[data-pag]');
    if (pg && !pg.disabled) { st.pagina = +pg.getAttribute('data-pag'); render(); $('conteo').scrollIntoView({ block: 'center' }); return; }
    var qc = e.target.closest('[data-cat]');
    if (qc) { var c = qc.getAttribute('data-cat'); st.categoria = c ? [c] : []; st.pagina = 1; marcarChecks(); render(); return; }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  // Panel de filtros en móvil
  var scrim;
  function panel(open) {
    $('filtros').classList.toggle('is-open', open);
    $('abrir-filtros').setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) {
      scrim = document.createElement('div'); scrim.className = 'scrim';
      scrim.addEventListener('click', function () { panel(false); });
      document.body.appendChild(scrim);
      $('cerrar-filtros').focus();
    } else { if (scrim) scrim.remove(); $('abrir-filtros').focus(); }
  }
  $('abrir-filtros').addEventListener('click', function () { panel(true); });
  $('cerrar-filtros').addEventListener('click', function () { panel(false); });
  $('aplicar').addEventListener('click', function () { panel(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('filtros').classList.contains('is-open')) panel(false); });

  render();
})();

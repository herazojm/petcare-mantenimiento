/* =========================================================
   Estado de la aplicación y utilidades.
   Los datos (sesión, mascotas y citas) se guardan SOLO en el
   navegador del usuario con localStorage: no hay servidor y
   nada se envía a internet.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});
  /* ---------- Versionado y migración de datos (HU-05 · preventivo) ----------
     Cada cambio en la forma de los datos sube ESQUEMA y agrega una función
     en MIGRACIONES que lleva los datos de la versión N a la N+1. Así nadie
     pierde sus mascotas, citas o favoritos cuando el sitio se actualiza.
       v1 → datos originales del sitio (clave 'petcare:v1', sin número de versión)
       v2 → agrega 'favoritos' (HU-02) y el campo 'esquema'; nueva clave 'petcare:datos'
  */
  var KEY = 'petcare:datos';
  var CLAVES_ANTIGUAS = ['petcare:v1'];
  var ESQUEMA = 2;
  var memoria = null; // respaldo si localStorage no está disponible

  var MIGRACIONES = {
    1: function (d) {
      d.favoritos = Array.isArray(d.favoritos) ? d.favoritos.filter(function (x) { return typeof x === 'string'; }) : [];
      d.seq = typeof d.seq === 'number' && d.seq > 0 ? d.seq : d.pets.length + d.citas.length + 1;
      d.pets.forEach(function (p) {
        if (!P.TAMANOS || !P.TAMANOS[p.tamano]) p.tamano = 'mediano';
        if (p.vacunas !== 'al-dia') p.vacunas = 'pendiente';
      });
      return d;
    }
  };

  function vacio() { return { esquema: ESQUEMA, user: null, owner: null, pets: [], citas: [], favoritos: [], seq: 1 }; }

  function estructuraValida(d) { return !!d && typeof d === 'object' && Array.isArray(d.pets) && Array.isArray(d.citas); }

  /* Guarda una copia del texto dañado para no perderlo y poder revisarlo */
  function respaldar(raw, motivo) {
    try { window.localStorage.setItem('petcare:respaldo-' + Date.now(), JSON.stringify({ motivo: motivo, datos: raw })); } catch (e) { /* sin espacio */ }
    if (window.console) console.warn('[PetCare] Datos guardados no válidos (' + motivo + '). Se guardó un respaldo y se empezó de cero.');
  }

  /** Lleva los datos de su versión a ESQUEMA. Devuelve true si hubo cambios. */
  function migrar(d) {
    var v = typeof d.esquema === 'number' ? d.esquema : 1;
    if (v > ESQUEMA) return false; // datos de una versión más nueva: no los tocamos
    var cambio = false;
    while (v < ESQUEMA) {
      if (!MIGRACIONES[v]) break;
      d = MIGRACIONES[v](d) || d;
      v++; cambio = true;
    }
    d.esquema = v;
    return cambio;
  }

  function leer() {
    var raw = null, desde = KEY;
    try {
      raw = window.localStorage.getItem(KEY);
      if (!raw) {
        for (var i = 0; i < CLAVES_ANTIGUAS.length && !raw; i++) {
          raw = window.localStorage.getItem(CLAVES_ANTIGUAS[i]);
          desde = CLAVES_ANTIGUAS[i];
        }
      }
    } catch (e) { return memoria || vacio(); /* modo privado o almacenamiento bloqueado */ }
    if (!raw) return memoria || vacio();

    var d;
    try { d = JSON.parse(raw); } catch (e) { respaldar(raw, 'JSON inválido'); limpiar(desde); return memoria || vacio(); }
    if (!estructuraValida(d)) { respaldar(raw, 'estructura incompleta'); limpiar(desde); return memoria || vacio(); }

    if (migrar(d) || desde !== KEY) {
      guardar(d);
      if (desde !== KEY) limpiar(desde); // la clave antigua ya quedó copiada en la nueva
    }
    return d;
  }

  function limpiar(clave) { try { window.localStorage.removeItem(clave); } catch (e) { /* nada */ } }

  function guardar(d) {
    memoria = d;
    try { window.localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* se queda en memoria */ }
  }

  function nuevoId(d, pref) { var id = pref + '-' + Date.now().toString(36) + '-' + (d.seq++); return id; }

  /* ---------- Utilidades de formato ---------- */
  P.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  P.money = function (n) { return '$' + Math.round(n).toLocaleString('es-CO'); };
  P.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  P.toISO = function (d) { return d.getFullYear() + '-' + P.pad(d.getMonth() + 1) + '-' + P.pad(d.getDate()); };
  P.parseISO = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  P.hoy = function () { var d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  P.addDays = function (d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; };
  P.cap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };

  P.fmtFecha = function (iso, larga) {
    var d = P.parseISO(iso);
    var o = larga ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { weekday: 'short', day: 'numeric', month: 'short' };
    return P.cap(d.toLocaleDateString('es-CO', o));
  };
  P.fmtHora = function (hhmm) {
    var p = hhmm.split(':'), h = +p[0];
    return (h % 12 || 12) + ':' + p[1] + (h < 12 ? ' a. m.' : ' p. m.');
  };
  P.fmtDuracion = function (min) {
    if (min >= 60 && min % 60 === 0) return (min / 60) + ' h';
    if (min > 60) return Math.floor(min / 60) + ' h ' + (min % 60) + ' min';
    return min + ' min';
  };
  P.diasHasta = function (iso) { return Math.round((P.parseISO(iso) - P.hoy()) / 86400000); };

  P.qs = function (name) { return new URLSearchParams(window.location.search).get(name); };

  /* Evita redirecciones abiertas: solo páginas propias del sitio */
  P.safeNext = function (next) {
    var ok = ['mi-cuenta.html', 'agendar.html', 'index.html', 'servicios.html'];
    if (!next) return 'mi-cuenta.html';
    var base = next.split('?')[0].split('#')[0];
    return ok.indexOf(base) >= 0 ? next : 'mi-cuenta.html';
  };

  /* ---------- Disponibilidad simulada de horarios ---------- */
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; } return Math.abs(h); }

  P.diaAbierto = function (date) {
    var hoy = P.hoy();
    return date >= hoy && date <= P.addDays(hoy, 60);
  };

  /**
   * Horarios de una fecha y sede. Marca como no disponibles:
   * los ya ocupados (simulación determinista), los que ya pasaron hoy
   * y los que el usuario ya tiene agendados.
   */
  P.horarios = function (iso, sede, ignorarCitaId) {
    var d = P.parseISO(iso);
    var base = d.getDay() === 0 ? P.HORARIOS_DOMINGO : P.HORARIOS;
    var ahora = new Date();
    var esHoy = iso === P.toISO(ahora);
    var mias = P.store.citas().filter(function (c) { return c.fecha === iso && c.sede === sede && c.estado !== 'cancelada' && c.id !== ignorarCitaId; });
    return base.map(function (t) {
      var p = t.split(':');
      var pasado = esHoy && (+p[0] * 60 + +p[1]) <= (ahora.getHours() * 60 + ahora.getMinutes() + 60);
      var lleno = hash(iso + sede + t) % 100 < 22;
      var mia = mias.some(function (c) { return c.hora === t; });
      return { hora: t, disponible: !pasado && !lleno && !mia, motivo: pasado ? 'pasado' : mia ? 'tuya' : lleno ? 'lleno' : '' };
    });
  };

  /* ---------- API del almacén ---------- */
  P.store = {
    user: function () { return leer().user; },
    pets: function () { return leer().pets.slice(); },
    pet: function (id) { return leer().pets.filter(function (p) { return p.id === id; })[0] || null; },
    citas: function () { return leer().citas.slice(); },
    cita: function (id) { return leer().citas.filter(function (c) { return c.id === id; })[0] || null; },

    login: function (user) {
      var d = leer();
      // Si entra otra persona en este navegador, empieza con datos limpios
      if (d.owner && d.owner !== user.email) { var n = vacio(); n.seq = d.seq; d = n; }
      d.user = { nombre: user.nombre, email: user.email, celular: user.celular || '' };
      d.owner = user.email;
      guardar(d);
    },
    logout: function () { var d = leer(); d.user = null; guardar(d); },
    updateUser: function (campos) { var d = leer(); if (!d.user) return; Object.keys(campos).forEach(function (k) { d.user[k] = campos[k]; }); guardar(d); },

    addPet: function (p) {
      var d = leer();
      var pet = {
        id: nuevoId(d, 'm'), nombre: p.nombre, especie: p.especie, tamano: p.tamano || 'mediano',
        raza: p.raza || (p.especie === 'gato' ? 'Criollo' : p.especie === 'perro' ? 'Criollo' : ''),
        edad: p.edad || '', peso: p.peso || '', vacunas: p.vacunas || 'pendiente'
      };
      d.pets.push(pet); guardar(d); return pet;
    },
    updatePet: function (id, campos) {
      var d = leer();
      d.pets.forEach(function (p) { if (p.id === id) Object.keys(campos).forEach(function (k) { p[k] = campos[k]; }); });
      guardar(d);
    },

    addCita: function (c) {
      var d = leer();
      c.id = 'PC-' + (Date.now().toString(36).slice(-4) + (d.seq++)).toUpperCase();
      c.creada = new Date().toISOString();
      d.citas.push(c); guardar(d); return c;
    },
    updateCita: function (id, campos) {
      var d = leer();
      d.citas.forEach(function (c) { if (c.id === id) Object.keys(campos).forEach(function (k) { c[k] = campos[k]; }); });
      guardar(d);
    },

    /* ---------- Favoritos (HU-02) ---------- */
    favoritos: function () { return (leer().favoritos || []).slice(); },
    esFavorito: function (servicioId) { return (leer().favoritos || []).indexOf(servicioId) >= 0; },
    /** Marca o desmarca un servicio. Devuelve true si quedó como favorito. */
    toggleFavorito: function (servicioId) {
      var d = leer();
      var favs = d.favoritos || [];
      var i = favs.indexOf(servicioId);
      if (i >= 0) favs.splice(i, 1); else favs.push(servicioId);
      d.favoritos = favs; guardar(d);
      return i < 0;
    },

    /* La primera cita (sin contar canceladas) tiene 10 % de descuento */
    esPrimeraCita: function (ignorarId) {
      return !leer().citas.some(function (c) { return c.estado !== 'cancelada' && c.id !== ignorarId; });
    },

    proximas: function () {
      var hoyIso = P.toISO(new Date());
      return leer().citas.filter(function (c) { return c.estado !== 'cancelada' && c.estado !== 'atendida' && c.fecha >= hoyIso; })
        .sort(function (a, b) { return (a.fecha + a.hora).localeCompare(b.fecha + b.hora); });
    },
    historial: function () {
      var hoyIso = P.toISO(new Date());
      return leer().citas.filter(function (c) { return c.estado === 'atendida' || c.estado === 'cancelada' || c.fecha < hoyIso; })
        .sort(function (a, b) { return (b.fecha + b.hora).localeCompare(a.fecha + a.hora); });
    },

    /* Cuenta de demostración con datos de ejemplo (para el video) */
    demo: function () {
      var d = vacio();
      d.user = { nombre: 'Laura Martínez', email: 'laura@correo.com', celular: '300 123 4567' };
      d.owner = d.user.email;
      d.pets = [
        { id: 'm-luna', nombre: 'Luna', especie: 'perro', raza: 'Golden retriever', tamano: 'grande', edad: '3 años', peso: '28 kg', vacunas: 'al-dia' },
        { id: 'm-michi', nombre: 'Michi', especie: 'gato', raza: 'Criollo', tamano: 'pequeno', edad: '5 años', peso: '4 kg', vacunas: 'pendiente' }
      ];
      var hoy = P.hoy();
      function cita(dias, servicio, pet, sede, hora, estado) {
        var s = P.getServicio(servicio), p = d.pets.filter(function (x) { return x.id === pet; })[0];
        var f = P.addDays(hoy, dias);
        if (dias > 0 && f.getDay() === 0) f = P.addDays(f, 1); // evitar domingo en el ejemplo
        var precio = s.precios[p.tamano];
        return {
          id: 'PC-DEMO' + (d.seq++), servicio: s.id, servicioNombre: s.nombre, mascota: p.id, mascotaNombre: p.nombre,
          tamano: p.tamano, sede: sede, fecha: P.toISO(f), hora: hora, subtotal: precio, descuento: 0, total: precio,
          contacto: { nombre: d.user.nombre, celular: d.user.celular, email: d.user.email }, notas: '', whatsapp: true,
          estado: estado, creada: new Date().toISOString()
        };
      }
      d.citas = [
        cita(2, 'bano-peluqueria', 'm-luna', 'laureles', '10:30', 'confirmada'),
        cita(9, 'vacunacion', 'm-michi', 'poblado', '09:30', 'pendiente'),
        cita(22, 'consulta-veterinaria', 'm-luna', 'laureles', '16:30', 'confirmada'),
        cita(-28, 'consulta-veterinaria', 'm-luna', 'laureles', '11:30', 'atendida'),
        cita(-45, 'paseos-grupales', 'm-luna', 'poblado', '08:00', 'atendida')
      ];
      d.favoritos = ['bano-peluqueria', 'guarderia-dia'];
      guardar(d);
    },

    reset: function () { guardar(vacio()); }
  };

  P.ESTADOS = {
    confirmada: { txt: 'Confirmada', cls: '' },
    pendiente: { txt: 'Pendiente', cls: 'tag--ambar' },
    atendida: { txt: 'Atendida', cls: 'tag--gris' },
    cancelada: { txt: 'Cancelada', cls: 'tag--rojo' }
  };
})();

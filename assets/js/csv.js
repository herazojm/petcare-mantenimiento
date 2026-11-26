/* =========================================================
   Exportar el historial de citas a CSV (HU-03 · perfectivo)
   - Separador ";" y BOM UTF-8 para que Excel en español
     separe las columnas y muestre bien las tildes.
   - Protege contra "inyección de fórmulas" en hojas de cálculo.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});
  P.ICONS = P.ICONS || {};
  P.ICONS.download = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" />';

  var SEP = ';';
  var COLUMNAS = ['Código', 'Fecha', 'Hora', 'Servicio', 'Mascota', 'Sede', 'Estado', 'Total (COP)'];

  /** Escapa un valor para CSV. */
  function celda(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;            // evita que Excel lo interprete como fórmula
    if (s.indexOf(SEP) >= 0 || s.indexOf('"') >= 0 || /[\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  P.csv = {
    /** Devuelve el texto CSV (con BOM) de una lista de citas. */
    construir: function (citas) {
      var filas = citas.slice().sort(function (a, b) { return (b.fecha + b.hora).localeCompare(a.fecha + a.hora); })
        .map(function (c) {
          var estado = (P.ESTADOS[c.estado] || {}).txt || c.estado;
          var sede = (P.SEDES[c.sede] || {}).nombre || c.sede;
          return [c.id, c.fecha, c.hora, c.servicioNombre, c.mascotaNombre, sede, estado, Math.round(c.total || 0)].map(celda).join(SEP);
        });
      return '﻿' + [COLUMNAS.map(celda).join(SEP)].concat(filas).join('\r\n') + '\r\n';
    },

    /** Descarga un texto como archivo en el navegador. */
    descargar: function (nombre, texto) {
      var blob = new Blob([texto], { type: 'text/csv;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = nombre; a.hidden = true;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    },

    /** Nombre del archivo con la fecha de hoy: petcare-historial-AAAA-MM-DD.csv */
    nombreArchivo: function () { return 'petcare-historial-' + P.toISO(new Date()) + '.csv'; }
  };
})();

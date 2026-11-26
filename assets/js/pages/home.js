/* Inicio (D1 / M1): servicios destacados y sedes */
(function () {
  var P = window.PC;

  document.getElementById('hero-art').insertAdjacentHTML('afterbegin', P.art('hero', 'Ilustración de un perro y un gato felices'));

  var destacados = P.SERVICIOS.slice().sort(function (a, b) { return a.destacado - b.destacado; }).slice(0, 4);
  var cont = document.getElementById('destacados');
  cont.innerHTML = destacados.map(P.serviceCard).join('');
  cont.querySelectorAll('.service-card').forEach(function (c) { c.classList.add('reveal'); });

  var sedes = document.getElementById('sedes');
  sedes.innerHTML = Object.keys(P.SEDES).map(function (k) {
    var s = P.SEDES[k];
    var n = P.SERVICIOS.filter(function (x) { return x.sedes.indexOf(k) >= 0; }).length;
    return '<article class="card sede reveal">' +
      '<h3>Sede ' + s.nombre + '</h3>' +
      '<p class="sede__row">' + P.icon('map-pin') + s.direccion + ', ' + (k === 'envigado' ? 'Envigado' : 'Medellín') + '</p>' +
      '<p class="sede__row">' + P.icon('clock') + s.horario + '</p>' +
      '<p class="sede__row">' + P.icon('paw-print') + n + ' servicios disponibles</p>' +
      '<a class="link-arrow" href="servicios.html?sede=' + k + '">Ver servicios de esta sede' + P.icon('arrow-right') + '</a>' +
      '</article>';
  }).join('');
})();

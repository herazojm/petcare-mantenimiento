/* =========================================================
   Ilustraciones planas de PetCare (SVG generado con código).
   Son las "metáforas visuales" de la Actividad 2: reemplazan fotos,
   pesan muy poco y escalan sin perder calidad.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});

  var C = {
    bg: '#CCEDE9', verde: '#0F766E', oreja: '#C2620F', cabeza: '#F59E0B', hocico: '#FDE7B0',
    tinta: '#1F2933', gato: '#9AA5B1', gatoOscuro: '#7B8794', rosa: '#F4A3A3', claro: '#E4E7EB',
    corazon: '#E8836F', ambar: '#F59E0B', blanco: '#FFFFFF'
  };

  function dog(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="-38" cy="-4" rx="17" ry="34" transform="rotate(18 -38 -4)" fill="' + C.oreja + '"/>' +
      '<ellipse cx="38" cy="-4" rx="17" ry="34" transform="rotate(-18 38 -4)" fill="' + C.oreja + '"/>' +
      '<circle r="44" fill="' + C.cabeza + '"/>' +
      '<ellipse cy="18" rx="24" ry="18" fill="' + C.hocico + '"/>' +
      '<circle cx="-16" cy="-8" r="5.5" fill="' + C.tinta + '"/><circle cx="16" cy="-8" r="5.5" fill="' + C.tinta + '"/>' +
      '<circle cx="-14.5" cy="-10" r="1.8" fill="#fff"/><circle cx="17.5" cy="-10" r="1.8" fill="#fff"/>' +
      '<ellipse cy="8" rx="8.5" ry="6" fill="' + C.tinta + '"/>' +
      '<path d="M-9 20 Q0 29 9 20" fill="none" stroke="' + C.tinta + '" stroke-width="3" stroke-linecap="round"/>' +
      '</g>';
  }

  function cat(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-42 -14 L-36 -62 L-6 -38 Z" fill="' + C.gatoOscuro + '"/><path d="M42 -14 L36 -62 L6 -38 Z" fill="' + C.gatoOscuro + '"/>' +
      '<path d="M-34 -24 L-32 -50 L-15 -37 Z" fill="' + C.rosa + '"/><path d="M34 -24 L32 -50 L15 -37 Z" fill="' + C.rosa + '"/>' +
      '<ellipse rx="46" ry="42" fill="' + C.gato + '"/>' +
      '<ellipse cy="16" rx="20" ry="13" fill="' + C.claro + '"/>' +
      '<ellipse cx="-16" cy="-6" rx="5" ry="6.5" fill="' + C.tinta + '"/><ellipse cx="16" cy="-6" rx="5" ry="6.5" fill="' + C.tinta + '"/>' +
      '<circle cx="-14.5" cy="-8.5" r="1.7" fill="#fff"/><circle cx="17.5" cy="-8.5" r="1.7" fill="#fff"/>' +
      '<path d="M-5 7 L5 7 L0 12 Z" fill="' + C.corazon + '"/>' +
      '<path d="M-7 16 Q-3.5 21 0 16 Q3.5 21 7 16" fill="none" stroke="' + C.tinta + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<g stroke="' + C.tinta + '" stroke-width="1.6" stroke-linecap="round"><path d="M-20 14 L-52 8"/><path d="M-20 19 L-52 22"/><path d="M20 14 L52 8"/><path d="M20 19 L52 22"/></g>' +
      '</g>';
  }

  function paw(x, y, s, color) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + (color || C.verde) + '">' +
      '<path d="M0 4 C-16 4 -26 18 -24 28 C-22 36 -12 36 0 34 C12 36 22 36 24 28 C26 18 16 4 0 4Z"/>' +
      '<ellipse cx="-24" cy="-8" rx="8" ry="10"/><ellipse cx="-9" cy="-20" rx="8" ry="10.5"/>' +
      '<ellipse cx="9" cy="-20" rx="8" ry="10.5"/><ellipse cx="24" cy="-8" rx="8" ry="10"/></g>';
  }

  function heart(x, y, s, color) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 6 C0 -4 -14 -6 -14 4 C-14 12 -5 17 0 22 C5 17 14 12 14 4 C14 -6 0 -4 0 6Z" fill="' + (color || C.corazon) + '"/>';
  }

  function sparkle(x, y, s, color) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10Z" fill="' + (color || C.ambar) + '"/>';
  }

  function bubble(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" fill-opacity=".7" stroke="' + C.verde + '" stroke-width="3"/>';
  }

  function badgePlus(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><circle r="17" fill="#fff" stroke="' + C.verde + '" stroke-width="3.5"/>' +
      '<path d="M0 -8 V8 M-8 0 H8" stroke="' + C.verde + '" stroke-width="4.5" stroke-linecap="round"/></g>';
  }

  function syringe(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(-45)" stroke="' + C.verde + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="#fff">' +
      '<rect x="-8" y="-22" width="16" height="36" rx="3"/><path d="M-12 -22 H12 M0 -22 V-32 M-7 -32 H7 M0 14 V28" fill="none"/>' +
      '<path d="M-8 2 H-2 M-8 -6 H-2 M-8 -14 H-2" fill="none"/></g>';
  }

  function scissors(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="' + C.verde + '" stroke-width="3.5" stroke-linecap="round">' +
      '<circle cx="-9" cy="12" r="7"/><circle cx="9" cy="12" r="7"/><path d="M-4 6 L12 -18 M4 6 L-12 -18"/></g>';
  }

  function cap(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-40 0 L0 -18 L40 0 L0 18 Z" fill="' + C.tinta + '"/>' +
      '<path d="M-24 8 V22 Q0 34 24 22 V8 L0 18 Z" fill="#3E4C59"/><path d="M32 4 V26" stroke="' + C.ambar + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="32" cy="28" r="4" fill="' + C.ambar + '"/></g>';
  }

  function house(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="' + C.verde + '" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M-58 -4 L0 -54 L58 -4"/><path d="M-44 -14 V52 H44 V-14" fill="#fff"/></g>';
  }

  function tooth(x, y) {
    return '<path transform="translate(' + x + ' ' + y + ')" d="M-12 -12 C-20 -12 -20 2 -14 10 C-11 16 -10 24 -6 24 C-2 24 -3 12 0 12 C3 12 2 24 6 24 C10 24 11 16 14 10 C20 2 20 -12 12 -12 C6 -12 4 -9 0 -9 C-4 -9 -6 -12 -12 -12Z" fill="#fff" stroke="' + C.verde + '" stroke-width="3"/>';
  }

  function shield(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 -20 L16 -13 V0 C16 10 8 17 0 20 C-8 17 -16 10 -16 0 V-13 Z" fill="#fff" stroke="' + C.verde + '" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="M-6 0 L-1 5 L7 -5" fill="none" stroke="' + C.verde + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }

  var circleBg = '<circle cx="100" cy="100" r="80" fill="' + C.bg + '"/>';

  var ARTS = {
    vet: function () { return circleBg + dog(98, 104, .95) + badgePlus(146, 142); },
    catvet: function () { return circleBg + cat(98, 108, .95) + shield(148, 144); },
    bath: function () { return circleBg + dog(100, 112, .9) + bubble(52, 46, 11) + bubble(150, 40, 9) + bubble(166, 70, 5.5) + bubble(38, 82, 5.5); },
    catbath: function () { return circleBg + cat(100, 114, .9) + bubble(48, 50, 10) + bubble(154, 46, 8) + bubble(164, 76, 5) + bubble(36, 84, 5); },
    vaccine: function () { return circleBg + cat(94, 112, .9) + syringe(150, 58); },
    spa: function () { return circleBg + cat(100, 112, .9) + sparkle(46, 50, 1.2) + sparkle(156, 52, .9, C.verde) + sparkle(160, 150, .8); },
    dental: function () { return circleBg + dog(96, 110, .9) + tooth(152, 56) + sparkle(46, 52, 1, C.verde); },
    puppy: function () { return circleBg + dog(100, 116, .75) + heart(60, 52, 1.1, C.ambar) + heart(142, 44, 1.3); },
    nails: function () { return circleBg + paw(92, 108, 1.4) + scissors(150, 60); },
    walk: function () { return circleBg + dog(104, 96, .78) + paw(52, 152, .45) + paw(84, 166, .45) + paw(118, 156, .45) + paw(150, 168, .45); },
    daycare: function () { return circleBg + house(100, 112) + dog(100, 128, .5); },
    training: function () { return circleBg + dog(100, 118, .8) + cap(100, 62); },
    dog: function () { return circleBg + dog(100, 108, 1.05); },
    cat: function () { return circleBg + cat(100, 112, 1.05); },
    paw: function () { return circleBg + paw(100, 100, 1.6); },
    hero: function () {
      return '<ellipse cx="200" cy="150" rx="176" ry="100" fill="' + C.bg + '"/>' +
        dog(140, 150, 1.25) + cat(272, 160, 1.15) + heart(206, 38, 1.7) +
        sparkle(56, 92, 1.6) + sparkle(352, 72, 1.3, C.verde) + sparkle(330, 230, 1, C.ambar) + paw(206, 238, .5);
    },
    auth: function () {
      return '<ellipse cx="200" cy="150" rx="176" ry="100" fill="' + C.bg + '"/>' +
        dog(132, 150, 1.2) + cat(276, 160, 1.1) + heart(204, 46, 1.6) + paw(204, 186, .55);
    }
  };

  /**
   * Devuelve el SVG de una ilustración.
   * @param {string} key  Nombre de la ilustración (vet, bath, dog, hero…)
   * @param {string} [label] Texto alternativo; si se omite, la imagen es decorativa.
   */
  P.art = function (key, label) {
    var wide = key === 'hero' || key === 'auth';
    var vb = wide ? '0 0 400 280' : '0 0 200 200';
    var a11y = label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true" focusable="false"';
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" ' + a11y + '>' + (ARTS[key] || ARTS.paw)() + '</svg>';
  };

  P.petArt = function (pet) { return P.art(pet && pet.especie === 'gato' ? 'cat' : pet && pet.especie === 'otra' ? 'paw' : 'dog'); };
})();

/* Ingresar / Crear cuenta (D6) — autenticación simulada en el navegador */
(function () {
  var P = window.PC;
  var $ = function (id) { return document.getElementById(id); };
  var next = P.safeNext(P.qs('next'));

  $('auth-art').innerHTML = P.art('auth', 'Ilustración de una familia de mascotas');

  if (P.store.user()) { location.replace(next); return; }

  // Pestañas accesibles (flechas izquierda/derecha)
  var tabs = [$('tab-ingresar'), $('tab-crear')];
  function activar(i) {
    tabs.forEach(function (t, j) {
      t.setAttribute('aria-selected', String(i === j));
      t.tabIndex = i === j ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = i !== j;
    });
    $('auth-title').textContent = i ? 'Crea tu cuenta' : 'Bienvenido de nuevo';
    $('auth-sub').textContent = i ? 'Es gratis y te toma menos de un minuto.' : 'Ingresa para agendar y ver las citas de tus mascotas.';
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activar(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var k = i ? 0 : 1; activar(k); tabs[k].focus(); }
    });
  });
  if (P.qs('modo') === 'crear') activar(1);

  function nombreDesdeEmail(email) {
    return email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\d+/g, '').trim().split(' ')
      .map(function (w) { return P.cap(w.toLowerCase()); }).join(' ') || 'Cliente PetCare';
  }

  $('form-ingresar').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('in-email'), pw = $('in-pass');
    var e1 = P.validEmail(em.value.trim()) ? '' : 'Escribe un correo válido.';
    var e2 = pw.value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.';
    P.setError(em, e1); P.setError(pw, e2);
    if (e1 || e2) { (e1 ? em : pw).focus(); return; }
    var email = em.value.trim().toLowerCase();
    var prev = P.store.user();
    P.store.login({ nombre: prev && prev.email === email ? prev.nombre : nombreDesdeEmail(email), email: email });
    location.href = next;
  });

  $('form-crear').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('cr-nombre'), em = $('cr-email'), pw = $('cr-pass'), t = $('cr-terminos');
    var e1 = n.value.trim().length >= 3 ? '' : 'Escribe tu nombre completo.';
    var e2 = P.validEmail(em.value.trim()) ? '' : 'Escribe un correo válido.';
    var e3 = pw.value.length >= 6 ? '' : 'Usa al menos 6 caracteres.';
    P.setError(n, e1); P.setError(em, e2); P.setError(pw, e3);
    if (!t.checked) { P.toast('Debes aceptar los términos para crear la cuenta.', 'triangle-alert'); }
    if (e1 || e2 || e3 || !t.checked) { var f = document.querySelector('#form-crear .has-error .input'); (f || t).focus(); return; }
    P.store.login({ nombre: n.value.trim(), email: em.value.trim().toLowerCase() });
    location.href = next;
  });

  function entrarDemo() { P.store.demo(); location.href = next; }
  $('demo').addEventListener('click', function () {
    P.toast('Demo: el inicio con Google se simula con la cuenta de ejemplo.', 'info');
    setTimeout(entrarDemo, 900);
  });
  $('demo2').addEventListener('click', entrarDemo);
  $('olvide').addEventListener('click', function () {
    P.toast('Demo: en la versión real te enviaríamos un enlace para cambiar la contraseña.', 'mail');
  });
})();

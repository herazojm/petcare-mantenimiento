/* =========================================================
   Datos del sitio PetCare (catálogo, sedes, profesionales).
   Inventario de contenidos de la Actividad 2 (Tabla 4).
   PetCare es una marca ficticia creada con fines académicos.
   ========================================================= */
(function () {
  var P = (window.PC = window.PC || {});

  P.SEDES = {
    poblado:  { id: 'poblado',  nombre: 'El Poblado', direccion: 'Cra. 43A #1-50',     horario: 'Lun a Sáb 7:00–20:00 · Dom 8:00–14:00' },
    laureles: { id: 'laureles', nombre: 'Laureles',   direccion: 'Cra. 76 #33-20',     horario: 'Lun a Sáb 7:00–20:00 · Dom 8:00–14:00' },
    envigado: { id: 'envigado', nombre: 'Envigado',   direccion: 'Cl. 38 Sur #43-15',  horario: 'Lun a Sáb 7:00–19:00 · Dom 8:00–14:00' }
  };

  P.CATEGORIAS = {
    veterinaria: 'Veterinaria',
    estetica: 'Estética',
    paseos: 'Paseos',
    guarderia: 'Guardería',
    entrenamiento: 'Entrenamiento'
  };

  P.ESPECIES = { perro: 'Perro', gato: 'Gato', otra: 'Otra' };
  P.TAMANOS = { pequeno: 'Pequeño', mediano: 'Mediano', grande: 'Grande' };

  P.PROFESIONALES = {
    camila:  { nombre: 'Camila Gómez',    rol: 'Groomer certificada',      rating: 4.9, exp: 6 },
    julian:  { nombre: 'Julián Restrepo', rol: 'Estilista canino',         rating: 4.8, exp: 4 },
    daniela: { nombre: 'Daniela Ríos',    rol: 'Auxiliar veterinaria',     rating: 4.9, exp: 5 },
    mateo:   { nombre: 'Dr. Mateo Arango', rol: 'Médico veterinario',      rating: 4.9, exp: 9 },
    sara:    { nombre: 'Dra. Sara Vélez', rol: 'Veterinaria felina',       rating: 5.0, exp: 7 },
    andres:  { nombre: 'Andrés Zapata',   rol: 'Paseador y cuidador',      rating: 4.8, exp: 3 },
    valeria: { nombre: 'Valeria Cano',    rol: 'Adiestradora canina',      rating: 4.9, exp: 8 }
  };

  var FAQ_BASE = [
    { q: '¿Puedo reprogramar o cancelar?', a: 'Sí. Desde «Mi cuenta» puedes reprogramar o cancelar sin costo hasta 24 horas antes de la cita.' },
    { q: '¿Cómo pago el servicio?', a: 'Pagas directamente en la sede, con efectivo, tarjeta o transferencia. Al agendar no se cobra nada.' }
  ];

  /* precios en pesos colombianos por tamaño de la mascota */
  P.SERVICIOS = [
    {
      id: 'consulta-veterinaria', nombre: 'Consulta veterinaria', categoria: 'veterinaria', especies: ['perro', 'gato', 'otra'],
      corta: 'Chequeo general, revisión de vacunas y desparasitación.', art: 'vet', duracion: 45, rating: 4.9, resenas: 512,
      precios: { pequeno: 60000, mediano: 60000, grande: 70000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 1,
      descripcion: 'Revisión completa de pies a cola: peso, temperatura, piel, oídos, dientes y corazón. Al final recibes un resumen con recomendaciones y el carné digital actualizado.',
      incluye: ['Examen físico completo', 'Revisión del plan de vacunas', 'Desparasitación interna', 'Resumen médico en tu cuenta'],
      profesionales: ['mateo', 'sara', 'daniela'],
      faq: [{ q: '¿Qué debo llevar el día de la cita?', a: 'El carné de vacunas (si lo tienes) y a tu mascota con collar y correa o en guacal. Si toma algún medicamento, llévalo también.' }]
    },
    {
      id: 'bano-peluqueria', nombre: 'Baño y peluquería completa', categoria: 'estetica', especies: ['perro'],
      corta: 'Baño, corte de pelo según la raza y corte de uñas.', art: 'bath', duracion: 90, rating: 4.8, resenas: 326,
      precios: { pequeno: 45000, mediano: 55000, grande: 70000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 2,
      descripcion: 'Baño con productos hipoalergénicos, secado, corte de pelo según la raza, corte de uñas y limpieza de oídos. Al terminar te enviamos una foto de tu mascota.',
      incluye: ['Baño y secado profesional', 'Corte de pelo y de uñas', 'Limpieza de oídos', 'Foto del resultado por WhatsApp'],
      profesionales: ['camila', 'julian', 'daniela'],
      faq: [{ q: '¿Atienden mascotas nerviosas o mayores?', a: 'Sí. Cuéntanos en las notas de la cita y asignamos más tiempo, secado a baja temperatura y un ambiente tranquilo.' }]
    },
    {
      id: 'paseos-grupales', nombre: 'Paseos grupales', categoria: 'paseos', especies: ['perro'],
      corta: 'Una hora en grupos pequeños con seguimiento GPS.', art: 'walk', duracion: 60, rating: 4.8, resenas: 241,
      precios: { pequeno: 18000, mediano: 18000, grande: 22000 }, sedes: ['poblado', 'laureles'], destacado: 3,
      descripcion: 'Paseos de una hora en grupos de máximo seis perros, organizados por tamaño y energía. Puedes seguir la ruta en tiempo real y recibes un reporte al terminar.',
      incluye: ['Recogida y entrega en casa', 'Grupo de máximo 6 perros', 'Seguimiento GPS en vivo', 'Agua y premios incluidos'],
      profesionales: ['andres', 'valeria'],
      faq: [{ q: '¿Qué pasa si llueve?', a: 'El paseo se cambia por juego bajo techo en la sede más cercana o se reprograma sin costo, como prefieras.' }]
    },
    {
      id: 'guarderia-dia', nombre: 'Guardería de día', categoria: 'guarderia', especies: ['perro', 'gato'],
      corta: 'Juego, descanso y cuidado mientras trabajas.', art: 'daycare', duracion: 480, rating: 4.9, resenas: 198,
      precios: { pequeno: 40000, mediano: 45000, grande: 50000 }, sedes: ['poblado', 'envigado'], destacado: 4,
      descripcion: 'Tu mascota pasa el día en espacios separados por tamaño, con juego guiado, siestas y comidas a la hora que nos indiques. Te mandamos fotos durante el día.',
      incluye: ['Jornada de hasta 8 horas', 'Zonas separadas por tamaño', 'Comida a la hora indicada', 'Fotos durante el día'],
      profesionales: ['andres', 'daniela'],
      faq: [{ q: '¿Necesita vacunas al día?', a: 'Sí, por seguridad de todos pedimos vacunas y desparasitación al día. Puedes registrarlas en «Mi cuenta».' }]
    },
    {
      id: 'vacunacion', nombre: 'Vacunación', categoria: 'veterinaria', especies: ['perro', 'gato'],
      corta: 'Plan de vacunas con carné digital.', art: 'vaccine', duracion: 20, rating: 4.9, resenas: 287,
      precios: { pequeno: 35000, mediano: 35000, grande: 35000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 5,
      descripcion: 'Aplicación de la vacuna que corresponda según la edad y el plan de tu mascota, con valoración previa y registro inmediato en el carné digital.',
      incluye: ['Valoración previa', 'Aplicación de la vacuna', 'Carné digital actualizado', 'Recordatorio de la próxima dosis'],
      profesionales: ['mateo', 'sara'],
      faq: [{ q: '¿Puede tener reacciones?', a: 'Es poco común. Puede haber decaimiento leve por unas horas. Te explicamos qué observar y te dejamos un contacto para dudas.' }]
    },
    {
      id: 'spa-dental', nombre: 'Spa y limpieza dental', categoria: 'estetica', especies: ['perro', 'gato'],
      corta: 'Hidratación del pelaje y limpieza dental sin anestesia.', art: 'dental', duracion: 60, rating: 4.7, resenas: 134,
      precios: { pequeno: 55000, mediano: 62000, grande: 70000 }, sedes: ['poblado', 'laureles'], destacado: 6,
      descripcion: 'Mascarilla hidratante para el pelaje, masaje relajante y limpieza dental superficial con cepillo y gel enzimático, sin anestesia.',
      incluye: ['Mascarilla hidratante', 'Masaje relajante', 'Limpieza dental superficial', 'Perfume hipoalergénico'],
      profesionales: ['camila', 'julian'], faq: []
    },
    {
      id: 'control-cachorros', nombre: 'Control de cachorros', categoria: 'veterinaria', especies: ['perro', 'gato'],
      corta: 'Seguimiento de crecimiento, nutrición y primeras vacunas.', art: 'puppy', duracion: 40, rating: 5.0, resenas: 96,
      precios: { pequeno: 50000, mediano: 50000, grande: 50000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 7,
      descripcion: 'Pensado para los primeros meses: control de peso y talla, plan de alimentación, calendario de vacunas y consejos de socialización.',
      incluye: ['Control de peso y talla', 'Plan de alimentación', 'Calendario de vacunas', 'Guía de socialización'],
      profesionales: ['mateo', 'sara'], faq: []
    },
    {
      id: 'corte-unas', nombre: 'Corte de uñas express', categoria: 'estetica', especies: ['perro', 'gato', 'otra'],
      corta: 'Servicio rápido de 20 minutos, sin cita larga.', art: 'nails', duracion: 20, rating: 4.8, resenas: 410,
      precios: { pequeno: 15000, mediano: 15000, grande: 18000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 8,
      descripcion: 'Corte y limado de uñas con herramientas de precisión. Ideal para mantener el cuidado entre baños.',
      incluye: ['Corte de uñas', 'Limado', 'Revisión de almohadillas'],
      profesionales: ['camila', 'daniela'], faq: []
    },
    {
      id: 'bano-gatos', nombre: 'Baño para gatos', categoria: 'estetica', especies: ['gato'],
      corta: 'Baño en sala silenciosa, solo para felinos.', art: 'catbath', duracion: 60, rating: 4.7, resenas: 88,
      precios: { pequeno: 50000, mediano: 55000, grande: 60000 }, sedes: ['laureles'], destacado: 9,
      descripcion: 'Baño en una sala exclusiva para gatos, lejos de los ladridos, con champú especial para felinos, secado suave y cepillado para retirar pelo muerto.',
      incluye: ['Sala exclusiva para gatos', 'Champú para felinos', 'Secado suave', 'Cepillado'],
      profesionales: ['sara', 'camila'], faq: []
    },
    {
      id: 'adiestramiento-basico', nombre: 'Adiestramiento básico', categoria: 'entrenamiento', especies: ['perro'],
      corta: 'Sesión de obediencia: sentado, quieto, ven y caminar sin halar.', art: 'training', duracion: 60, rating: 4.9, resenas: 152,
      precios: { pequeno: 65000, mediano: 65000, grande: 75000 }, sedes: ['laureles', 'envigado'], destacado: 10,
      descripcion: 'Sesión individual con refuerzo positivo para enseñar órdenes básicas y caminar con correa. Incluye tareas para practicar en casa.',
      incluye: ['Sesión individual de 60 min', 'Método de refuerzo positivo', 'Tareas para practicar en casa', 'Reporte de avance'],
      profesionales: ['valeria'], faq: []
    },
    {
      id: 'paseo-individual', nombre: 'Paseo individual', categoria: 'paseos', especies: ['perro'],
      corta: '45 minutos de paseo uno a uno, a tu ritmo.', art: 'walk', duracion: 45, rating: 4.8, resenas: 77,
      precios: { pequeno: 28000, mediano: 28000, grande: 32000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 11,
      descripcion: 'Paseo personalizado para perros reactivos, mayores o que prefieren la calma. El paseador sigue la ruta y el ritmo que tú indiques.',
      incluye: ['Paseador exclusivo', 'Ruta a tu medida', 'Seguimiento GPS', 'Reporte al terminar'],
      profesionales: ['andres'], faq: []
    },
    {
      id: 'desparasitacion', nombre: 'Desparasitación', categoria: 'veterinaria', especies: ['perro', 'gato', 'otra'],
      corta: 'Interna y externa, según peso y especie.', art: 'catvet', duracion: 15, rating: 4.8, resenas: 203,
      precios: { pequeno: 25000, mediano: 30000, grande: 38000 }, sedes: ['poblado', 'laureles', 'envigado'], destacado: 12,
      descripcion: 'Desparasitación interna y externa con la dosis exacta según el peso, la especie y la edad, y registro en la ficha médica.',
      incluye: ['Pesaje', 'Desparasitante interno y externo', 'Registro en la ficha médica'],
      profesionales: ['daniela', 'mateo'], faq: []
    }
  ];

  P.SERVICIOS.forEach(function (s) {
    s.desde = Math.min(s.precios.pequeno, s.precios.mediano, s.precios.grande);
    s.faq = s.faq.concat(FAQ_BASE);
  });

  P.getServicio = function (id) {
    for (var i = 0; i < P.SERVICIOS.length; i++) if (P.SERVICIOS[i].id === id) return P.SERVICIOS[i];
    return null;
  };

  /* Horarios base de atención (la disponibilidad real se simula en store.js) */
  P.HORARIOS = ['08:00', '09:30', '10:30', '11:30', '14:00', '15:30', '16:30', '17:30'];
  P.HORARIOS_DOMINGO = ['08:00', '09:30', '10:30', '11:30'];
  P.DESCUENTO_PRIMERA = 0.10;
})();

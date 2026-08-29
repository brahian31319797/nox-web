-- ============================================================
-- SEED: categorías y productos de ejemplo (mismos datos del mockup).
-- Correr después de supabase/schema.sql. Podés borrar estas filas
-- desde el panel admin apenas Brahian tenga sus productos reales.
-- ============================================================

insert into public.categorias (slug, nombre, orden) values
  ('monopatin', 'Monopatines', 1),
  ('moto', 'Motos Eléctricas', 2),
  ('bici', 'Bicicletas Eléctricas', 3);

insert into public.productos
  (slug, nombre, categoria_id, etiqueta, descripcion, precio_ars, precio_usd, specs, publicado, orden)
values
  (
    'zaros-l8-max', 'ZAROS L8 Max',
    (select id from public.categorias where slug = 'monopatin'),
    'Más vendido',
    'El equilibrio perfecto entre potencia y autonomía. Motor de 500W (600W pico), app Tuya, frenos a disco y asiento incluido.',
    1236800, 980,
    '[{"label":"Potencia motor","value":"500W"},{"label":"Potencia máxima","value":"600W"},{"label":"Velocidad máx.","value":"32 km/h"},{"label":"Autonomía","value":"28 km"},{"label":"Batería","value":"15.6 Ah"},{"label":"Frenos","value":"Disco + EABS"},{"label":"Carga máx.","value":"150 kg"}]',
    true, 1
  ),
  (
    'zaros-x7-urban', 'ZAROS X7 Urban',
    (select id from public.categorias where slug = 'monopatin'),
    null,
    'Liviano y plegable, ideal para el último tramo hasta el trabajo. Se guarda en cualquier rincón.',
    890000, 710,
    '[{"label":"Potencia motor","value":"350W"},{"label":"Velocidad máx.","value":"25 km/h"},{"label":"Autonomía","value":"22 km"},{"label":"Batería","value":"10 Ah"},{"label":"Frenos","value":"Disco trasero"},{"label":"Carga máx.","value":"120 kg"}]',
    true, 2
  ),
  (
    'zaros-pro-s9', 'ZAROS Pro S9',
    (select id from public.categorias where slug = 'monopatin'),
    'Premium',
    'Máxima potencia para quienes no quieren límites. Doble suspensión y autonomía de 45 km.',
    1780000, 1410,
    '[{"label":"Potencia motor","value":"800W"},{"label":"Potencia máxima","value":"1000W"},{"label":"Velocidad máx.","value":"40 km/h"},{"label":"Autonomía","value":"45 km"},{"label":"Batería","value":"20 Ah"},{"label":"Frenos","value":"Doble disco"},{"label":"Carga máx.","value":"150 kg"}]',
    false, 3
  ),
  (
    'zaros-volt-r1', 'ZAROS Volt R1',
    (select id from public.categorias where slug = 'moto'),
    'Top',
    'Una moto eléctrica de verdad: 2000W, 65 km/h y 80 km de autonomía. Patente no requerida según normativa local.',
    3450000, 2740,
    '[{"label":"Potencia motor","value":"2000W"},{"label":"Potencia máxima","value":"3000W"},{"label":"Velocidad máx.","value":"65 km/h"},{"label":"Autonomía","value":"80 km"},{"label":"Batería","value":"60V 32Ah"},{"label":"Frenos","value":"Doble disco hidráulico"},{"label":"Carga máx.","value":"180 kg"}]',
    true, 1
  ),
  (
    'zaros-city-emoto', 'ZAROS City E-Moto',
    (select id from public.categorias where slug = 'moto'),
    null,
    'Diseño urbano, asiento para dos y baúl. Pensada para moverte todo el día sin cargar.',
    2980000, 2365,
    '[{"label":"Potencia motor","value":"1500W"},{"label":"Potencia máxima","value":"2000W"},{"label":"Velocidad máx.","value":"55 km/h"},{"label":"Autonomía","value":"70 km"},{"label":"Batería","value":"60V 24Ah"},{"label":"Frenos","value":"Disco delantero y trasero"},{"label":"Carga máx.","value":"160 kg"}]',
    true, 2
  ),
  (
    'zaros-eride-c3', 'ZAROS eRide C3',
    (select id from public.categorias where slug = 'bici'),
    null,
    'Bici de ciudad con pedaleo asistido y 60 km de autonomía. Cambio Shimano y luces integradas.',
    1120000, 890,
    '[{"label":"Potencia motor","value":"250W"},{"label":"Potencia máxima","value":"350W"},{"label":"Velocidad máx.","value":"32 km/h"},{"label":"Autonomía","value":"60 km"},{"label":"Batería","value":"36V 12Ah"},{"label":"Frenos","value":"Disco mecánico"},{"label":"Carga máx.","value":"120 kg"}]',
    true, 1
  ),
  (
    'zaros-trail-emtb', 'ZAROS Trail E-MTB',
    (select id from public.categorias where slug = 'bici'),
    'Aventura',
    'Mountain bike eléctrica con suspensión completa. Para ciudad y montaña, hasta 90 km por carga.',
    1690000, 1340,
    '[{"label":"Potencia motor","value":"500W"},{"label":"Potencia máxima","value":"750W"},{"label":"Velocidad máx.","value":"40 km/h"},{"label":"Autonomía","value":"90 km"},{"label":"Batería","value":"48V 15Ah"},{"label":"Frenos","value":"Disco hidráulico"},{"label":"Carga máx.","value":"130 kg"}]',
    true, 2
  ),
  (
    'zaros-urban-fold', 'ZAROS Urban Fold',
    (select id from public.categorias where slug = 'bici'),
    'Plegable',
    'Bicicleta eléctrica plegable: entra en el baúl del auto o debajo del escritorio. Practicidad total.',
    980000, 780,
    '[{"label":"Potencia motor","value":"350W"},{"label":"Potencia máxima","value":"500W"},{"label":"Velocidad máx.","value":"28 km/h"},{"label":"Autonomía","value":"50 km"},{"label":"Batería","value":"36V 10Ah"},{"label":"Frenos","value":"Disco mecánico"},{"label":"Carga máx.","value":"110 kg"}]',
    false, 3
  );

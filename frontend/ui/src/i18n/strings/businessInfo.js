// Spanish translations for the Business Info page (Page1_BusinessInfo.jsx),
// including the field/section data it renders from businessInfoFields.js.
// Keyed by the exact English source string passed to t().
export const businessInfo = {
  // Page header
  'Tell us about your restaurant': 'Cuéntanos sobre tu restaurante',
  "We'll use this to prepare your insurance risk assessment.":
    'Usaremos esto para preparar tu evaluación de riesgo de seguro.',

  // Voice notes banner
  'Voice notes applied': 'Notas de voz aplicadas',
  'We prefilled this form from your voice intake. Review the fields below and adjust anything before continuing.':
    'Rellenamos este formulario con tu registro de voz. Revisa los campos a continuación y ajusta lo que necesites antes de continuar.',

  // Section titles (from businessInfoFields.js)
  'Tell us about yourself': 'Cuéntanos sobre ti',
  'What is your business doing?': '¿Qué hace tu negocio?',
  'Where is your restaurant located?': '¿Dónde está ubicado tu restaurante?',

  // Field labels (from businessInfoFields.js)
  'Full name *': 'Nombre completo *',
  'Your role': 'Tu cargo',
  'Email': 'Correo electrónico',
  'Phone number': 'Número de teléfono',
  'Restaurant / business name *': 'Nombre del restaurante / negocio *',
  'Type of cuisine / concept': 'Tipo de cocina / concepto',
  'Describe your business *': 'Describe tu negocio *',
  'Serves alcohol': 'Sirve alcohol',
  'Catering': 'Servicio de banquetes',
  'Food truck': 'Camión de comida',
  'Delivery': 'Entrega a domicilio',
  'Full street address *': 'Dirección completa *',
  'Year building was constructed': 'Año de construcción del edificio',
  'Square footage': 'Metros cuadrados',
  'Own or lease?': '¿Propio o alquilado?',

  // Field placeholders (from businessInfoFields.js)
  'Jane Smith': 'Juana Pérez',
  'Owner, Manager, CFO...': 'Propietario, Gerente, Director financiero...',
  'jane@yourrestaurant.com': 'juana@turestaurante.com',
  '(415) 000-0000': '(415) 000-0000',
  'The Golden Fork': 'El Tenedor de Oro',
  'e.g. Italian trattoria, fast casual burger, sushi bar...':
    'p. ej. trattoria italiana, hamburguesas rápidas, barra de sushi...',
  'Describe what your restaurant does, how many seats, whether you serve alcohol, do catering, have a food truck, etc.':
    'Describe lo que hace tu restaurante, cuántos asientos tiene, si sirves alcohol, ofreces banquetes, tienes un camión de comida, etc.',
  '123 Market St, San Francisco, CA 94102': '123 Market St, San Francisco, CA 94102',
  'e.g. 1985': 'p. ej. 1985',
  'e.g. 2400': 'p. ej. 2400',

  // Select options (from businessInfoFields.js)
  'Select...': 'Selecciona...',
  'Own': 'Propio',
  'Lease': 'Alquilado',

  // Neighborhood risk badge titles (RISK_STYLES)
  'High-Risk Neighborhood Detected': 'Vecindario de alto riesgo detectado',
  'Elevated-Risk Area': 'Zona de riesgo elevado',
  'No High-Risk Flags Found': 'No se encontraron indicadores de alto riesgo',

  // Neighborhood risk descriptive text
  'Address resolves to': 'La dirección corresponde a',
  'near': 'cerca de',
  '. This location also matches':
    '. Esta ubicación también coincide con',
  'in': 'en',
  'as a known high-risk area for insurance purposes. Expect higher property and liability premiums. Document all security measures carefully.':
    'como una zona de alto riesgo conocida para fines de seguro. Espera primas más altas de propiedad y responsabilidad civil. Documenta cuidadosamente todas las medidas de seguridad.',
  'Address matches': 'La dirección coincide con',
  '— a known high-risk area for insurance purposes. Expect higher property and liability premiums. Document all security measures carefully.':
    '— una zona de alto riesgo conocida para fines de seguro. Espera primas más altas de propiedad y responsabilidad civil. Documenta cuidadosamente todas las medidas de seguridad.',
  'No high-risk neighborhood flags detected for this address. This does not replace a full ISO crime score lookup by your insurer.':
    'No se detectaron indicadores de vecindario de alto riesgo para esta dirección. Esto no reemplaza una consulta completa de la puntuación de criminalidad ISO realizada por tu aseguradora.',

  // Website lookup
  'Website': 'Sitio web',
  'Looking up website from business name and address...':
    'Buscando el sitio web a partir del nombre del negocio y la dirección...',
  'Website found automatically.': 'Sitio web encontrado automáticamente.',
  'We will try to auto-fill this after you enter the business name and address.':
    'Intentaremos completar esto automáticamente después de que ingreses el nombre del negocio y la dirección.',

  // NAICS classification
  'NAICS classification': 'Clasificación NAICS',
  'This is the business category code insurance companies use to understand what kind of restaurant or food business you run.':
    'Este es el código de categoría de negocio que las compañías de seguros usan para entender qué tipo de restaurante o negocio de comida operas.',
  'Choose the closest match...': 'Elige la opción más parecida...',
  'Suggested': 'Sugerido',
  'Business category': 'Categoría del negocio',
  'What is this?': '¿Qué es esto?',
  'Updating...': 'Actualizando...',
  'Refresh': 'Actualizar',
  'What is a NAICS classification?': '¿Qué es una clasificación NAICS?',
  'NAICS is a standard business category code. It helps insurance companies understand the type of work your business does so they can review risk more accurately.':
    'NAICS es un código estándar de categoría de negocio. Ayuda a las compañías de seguros a entender el tipo de trabajo que realiza tu negocio para que puedan evaluar el riesgo con mayor precisión.',
  'For restaurants, this can help separate a full-service restaurant, bar, caterer, coffee shop, food truck, or similar business. We suggest a code based on the details you enter, and you can refresh it if you update your information.':
    'Para restaurantes, esto ayuda a distinguir entre un restaurante de servicio completo, un bar, un servicio de banquetes, una cafetería, un camión de comida o un negocio similar. Sugerimos un código según los datos que ingreses, y puedes actualizarlo si cambias tu información.',
  'Close NAICS help': 'Cerrar la ayuda de NAICS',
  'Close': 'Cerrar',

  // Error messages
  'Address lookup failed': 'La búsqueda de la dirección falló',
  'Could not complete the address.': 'No se pudo completar la dirección.',
  'Lookup failed': 'La búsqueda falló',
  'Could not find a website yet.': 'Aún no se pudo encontrar un sitio web.',
  'Could not classify NAICS code': 'No se pudo clasificar el código NAICS',

  // Google Reviews section
  'Google Reviews — Slip & Fall Liability Check':
    'Reseñas de Google — Verificación de responsabilidad por resbalones y caídas',
  'We scan your public Google Reviews for mentions of slips, falls, wet floors, or unsafe conditions that could affect your liability exposure.':
    'Analizamos tus reseñas públicas de Google en busca de menciones de resbalones, caídas, pisos mojados o condiciones inseguras que podrían afectar tu exposición a la responsabilidad civil.',
  'Google Maps URL or business name + city':
    'URL de Google Maps o nombre del negocio + ciudad',
  'Scanning...': 'Analizando...',
  'Scan reviews': 'Analizar reseñas',
  'Scraping and analyzing reviews...': 'Extrayendo y analizando reseñas...',
  'Total reviews': 'Reseñas totales',
  'Avg. rating': 'Calificación promedio',
  'Slip/fall mentions': 'Menciones de resbalones/caídas',
  'Flagged review excerpts:': 'Fragmentos de reseñas marcados:',
  'Liability note:': 'Nota de responsabilidad:',
  'Recurring slip/fall mentions in reviews may increase general liability premiums. Consider floor matting, wet floor signage, and documenting your maintenance schedule.':
    'Las menciones recurrentes de resbalones/caídas en las reseñas pueden aumentar las primas de responsabilidad civil general. Considera colocar tapetes en el piso, señalización de piso mojado y documentar tu calendario de mantenimiento.',

  // Continue button
  'Continue to Interior': 'Continuar al interior',
}

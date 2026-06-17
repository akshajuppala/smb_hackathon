// Spanish translations for the Interior Assessment page (Page3_Interior.jsx).
// Keyed by the exact English source string passed to t(). Neutral Latin American
// Spanish aimed at US Latino restaurant owners, using correct insurance and
// fire-safety terminology.
export const interior = {
  // --- Page header ---
  'Interior Assessment': 'Evaluación del interior',
  'Start a guided interior walkthrough. We’ll review the recording for fire safety and building condition signals before showing the relevant scoring sections.':
    'Inicie un recorrido guiado por el interior. Revisaremos la grabación en busca de señales de seguridad contra incendios y del estado del edificio antes de mostrar las secciones de puntuación correspondientes.',

  // --- Capture card ---
  'Capture your interior walkthrough': 'Grabe su recorrido por el interior',
  'Start at the ceiling, then record the kitchen line, extinguishers, electrical panel, exits, and utility spaces.':
    'Empiece por el techo y luego grabe la línea de cocina, los extintores, el panel eléctrico, las salidas y los espacios de servicios.',
  'Restart assesment': 'Reiniciar evaluación',
  'Start assesment': 'Iniciar evaluación',
  'Recorded walkthrough attached:': 'Recorrido grabado adjunto:',

  // --- Loading / error states ---
  'Failed to load framework data.': 'No se pudieron cargar los datos del marco de evaluación.',
  'Loading interior scoring fields...': 'Cargando los campos de puntuación del interior...',
  'Pulling the relevant pillars from the scoring framework.':
    'Obteniendo los pilares relevantes del marco de puntuación.',

  // --- Pillar list ---
  'relevant scored items on this page': 'elementos puntuados relevantes en esta página',

  // --- Navigation ---
  '← Back': '← Atrás',
  'Continue to Exterior →': 'Continuar al exterior →',

  // --- Factor detail modal ---
  'Scoring detail': 'Detalle de la puntuación',
  'Close score details': 'Cerrar el detalle de la puntuación',
  'Why this matters': 'Por qué es importante',
  'Current score': 'Puntuación actual',
  'Possible scores': 'Puntuaciones posibles',

  // --- Framework-driven content (interior pillars/factors that render here) ---
  // Pillars
  'Property & Physical Risk': 'Riesgo físico y de la propiedad',
  'Documentation Readiness': 'Preparación de la documentación',
  'Mitigation & Controls': 'Mitigación y controles',

  // Factor: Sprinkler system
  'Sprinkler system': 'Sistema de rociadores',
  'Sprinklers can stop a small fire from turning into a total-loss event. That can materially improve insurability, pricing, and claim outcomes.':
    'Los rociadores pueden evitar que un incendio pequeño se convierta en una pérdida total. Eso puede mejorar de forma significativa la asegurabilidad, el precio y el resultado de los reclamos.',
  'Full-building sprinkler coverage is installed, operational, and backed by a current inspection certificate.':
    'Hay cobertura de rociadores en todo el edificio, instalada, en funcionamiento y respaldada por un certificado de inspección vigente.',
  'Partial sprinkler coverage is installed and operational, or full coverage exists without current inspection proof.':
    'Hay cobertura parcial de rociadores instalada y en funcionamiento, o existe cobertura completa sin comprobante de inspección vigente.',
  'Sprinklers exist but status, coverage, or operability cannot be fully verified.':
    'Existen rociadores, pero no se puede verificar por completo su estado, cobertura o funcionamiento.',
  'No sprinkler system is present.': 'No hay sistema de rociadores.',

  // Factor: Fire and smoke alarm system
  'Fire and smoke alarm system': 'Sistema de alarma de incendios y humo',
  'Early detection helps people get out sooner and gets responders moving faster. Insurers see monitored alarm systems as a core loss-control measure.':
    'La detección temprana ayuda a que las personas salgan antes y a que los servicios de emergencia respondan más rápido. Las aseguradoras consideran los sistemas de alarma monitoreados como una medida clave de control de pérdidas.',
  'Centrally monitored fire alarm system is installed and current monitoring evidence is provided.':
    'Hay un sistema de alarma de incendios con monitoreo central instalado y se aporta evidencia de monitoreo vigente.',
  'Local audible alarm system is installed but not centrally monitored.':
    'Hay un sistema de alarma sonora local instalado, pero sin monitoreo central.',
  'Alarm equipment is visible but monitoring or operability cannot be verified.':
    'El equipo de alarma es visible, pero no se puede verificar el monitoreo ni su funcionamiento.',
  'No fire or smoke alarm system is present.': 'No hay sistema de alarma de incendios ni de humo.',

  // Factor: Equipment and building maintenance logs
  'Equipment and building maintenance logs': 'Registros de mantenimiento del equipo y del edificio',
  'Maintenance records prove that key systems are being looked after. They help underwriters trust the risk and can reduce disputes after a claim.':
    'Los registros de mantenimiento demuestran que se cuida de los sistemas clave. Ayudan a que los suscriptores confíen en el riesgo y pueden reducir las disputas después de un reclamo.',
  'Maintenance logs or service records are complete for major building systems and insured equipment.':
    'Los registros de mantenimiento o de servicio están completos para los principales sistemas del edificio y el equipo asegurado.',
  'Partial maintenance records exist but at least one major system has no current evidence.':
    'Existen registros de mantenimiento parciales, pero al menos un sistema importante no cuenta con evidencia vigente.',
  'No maintenance records are provided.': 'No se aportan registros de mantenimiento.',

  // Factor: Posted emergency contact list
  'Posted emergency contact list': 'Lista de contactos de emergencia publicada',
  'When something goes wrong, minutes matter. A visible contact list helps staff respond faster and reduces confusion during an incident.':
    'Cuando algo sale mal, cada minuto cuenta. Una lista de contactos visible ayuda al personal a responder más rápido y reduce la confusión durante un incidente.',
  'Emergency contact list is visibly posted and includes current internal and emergency contacts.':
    'La lista de contactos de emergencia está publicada de forma visible e incluye contactos internos y de emergencia vigentes.',
  'No posted emergency contact list is visible.': 'No hay una lista de contactos de emergencia publicada visible.',

  // --- Mock CV / detection labels (not rendered in this component, included for completeness) ---
  'Sprinkler heads visible on ceiling': 'Cabezales de rociadores visibles en el techo',
  'Hood suppression system above cooking equipment':
    'Sistema de supresión en la campana sobre el equipo de cocción',
  'Fire extinguisher tags visible': 'Etiquetas de extintores visibles',
  'Smoke/heat detectors on ceiling': 'Detectores de humo/calor en el techo',
  'Exit signs clearly visible': 'Señales de salida claramente visibles',
  'No visible water stains, mold, or damage': 'Sin manchas de agua, moho ni daños visibles',
}

// Spanish translations for PageFrameworkReference.jsx.
// Keyed by the exact English source string passed to t(). Any missing key
// falls back to the English source, so partial coverage is safe.
//
// Neutral Latin American Spanish aimed at US Latino small-business (restaurant)
// owners, using standard commercial insurance terminology.
export const frameworkReference = {
  // Error / loading states
  'Framework reference failed to load': 'No se pudo cargar la referencia del marco',
  'The frontend server could not load the scoring framework.':
    'El servidor no pudo cargar el marco de puntuación.',
  'Loading framework reference': 'Cargando la referencia del marco',
  'Preparing the scoring rubric from the framework data.':
    'Preparando la rúbrica de puntuación a partir de los datos del marco.',

  // Header
  'Framework Reference': 'Referencia del Marco',
  Version: 'Versión',
  'Core score is out of': 'El puntaje base es sobre',
  'points. Bonus opportunities can add up to':
    'puntos. Las oportunidades de bonificación pueden sumar hasta',
  'points and count toward the final grade band.':
    'puntos y cuentan para la categoría final.',
  'Back to assessment': 'Volver a la evaluación',
  'Download PDF': 'Descargar PDF',
  'Download Image PDF': 'Descargar PDF de imagen',

  // Grade bands section
  'Grade Bands': 'Categorías de Calificación',
  'Core plus awarded bonus points': 'Puntaje base más los puntos de bonificación otorgados',

  // Factor rubric section
  'Factor Rubric': 'Rúbrica de Factores',
  factors: 'factores',
  Factor: 'Factor',
  'Score Options': 'Opciones de Puntuación',
  'core points': 'puntos base',

  // Bonus paths section
  'Bonus Paths': 'Rutas de Bonificación',
  paths: 'rutas',
  Pillar: 'Pilar',
  Bonus: 'Bonificación',
  Points: 'Puntos',
  'What Counts': 'Qué Cuenta',

  // Grade band readiness descriptions
  'Strong submission profile; eligible for preferred markets.':
    'Perfil de solicitud sólido; elegible para mercados preferenciales.',
  'Standard market eligible; minor improvements suggested.':
    'Elegible para el mercado estándar; se sugieren mejoras menores.',
  'Likely E&S placement; clear improvement path identified.':
    'Probable colocación en líneas excedentes (E&S); se identificó una ruta de mejora clara.',
  'Significant gaps; top remediation items should be addressed first.':
    'Brechas importantes; conviene atender primero los puntos de remediación prioritarios.',
  'Foundational gaps; not submission-ready for most standard markets.':
    'Brechas fundamentales; no está listo para presentarse en la mayoría de los mercados estándar.',

  // Pillar names
  'Property & Physical Risk': 'Riesgo de Propiedad y Físico',
  'Operational Risk': 'Riesgo Operativo',
  'Documentation Readiness': 'Preparación de Documentación',
  'Mitigation & Controls': 'Mitigación y Controles',

  // Factor names
  'Building construction type': 'Tipo de construcción del edificio',
  'Roof age and condition': 'Antigüedad y estado del techo',
  'Sprinkler system': 'Sistema de rociadores',
  'Fire and smoke alarm system': 'Sistema de alarma de incendios y humo',
  'Burglar alarm and intrusion security': 'Alarma antirrobo y seguridad contra intrusiones',
  'Distance to nearest fire hydrant': 'Distancia al hidrante más cercano',
  'Distance to nearest fire station': 'Distancia a la estación de bomberos más cercana',
  'Flood and wildfire zone exposure': 'Exposición a zonas de inundación e incendios forestales',
  'Business hazard class': 'Clase de riesgo del negocio',
  'Years in operation': 'Años en operación',
  'Prior claims history': 'Historial de reclamos previos',
  'Hours of operation': 'Horario de operación',
  'Liquor service exposure': 'Exposición por servicio de bebidas alcohólicas',
  'Commercial cooking exposure and suppression':
    'Exposición por cocina comercial y supresión',
  'Cash on premises and deposit controls':
    'Efectivo en el local y controles de depósito',
  'Current lease or deed': 'Contrato de arrendamiento o escritura vigente',
  'Certificate of occupancy': 'Certificado de ocupación',
  'Active business license': 'Licencia comercial activa',
  'Prior loss runs': 'Historiales de pérdidas previas (loss runs)',
  'Financial statements or tax returns':
    'Estados financieros o declaraciones de impuestos',
  'Written safety and emergency procedures':
    'Procedimientos escritos de seguridad y emergencia',
  'Vendor certificates of insurance': 'Certificados de seguro de proveedores',
  'Equipment and building maintenance logs':
    'Registros de mantenimiento de equipos y del edificio',
  'Security cameras': 'Cámaras de seguridad',
  'Employee safety training': 'Capacitación de seguridad para empleados',
  'Cybersecurity basics for payment or customer data':
    'Conceptos básicos de ciberseguridad para datos de pago o de clientes',
  "Workers' compensation class-code accuracy":
    'Exactitud de los códigos de clasificación de compensación laboral',
  'Exterior signage and lighting': 'Letreros e iluminación exteriores',
  'Posted emergency contact list': 'Lista de contactos de emergencia visible',
  'Annual property inspection': 'Inspección anual de la propiedad',

  // Bonus opportunity names
  'Recent third-party property condition survey':
    'Inspección reciente del estado de la propiedad por un tercero',
  'Written opening, closing, and cash-drop procedures':
    'Procedimientos escritos de apertura, cierre y entrega de efectivo',
  'Complete document package': 'Paquete de documentos completo',
  'Business continuity and incident response plan':
    'Plan de continuidad del negocio y respuesta a incidentes',

  // Scoring rules — Building construction type
  'Verified fire-resistive or non-combustible construction.':
    'Construcción resistente al fuego o no combustible verificada.',
  'Verified masonry non-combustible construction.':
    'Construcción de mampostería no combustible verificada.',
  'Verified joisted masonry or mixed masonry and combustible construction.':
    'Construcción verificada de mampostería con viguería o mixta de mampostería y materiales combustibles.',
  'Verified frame or other primarily combustible construction.':
    'Construcción de estructura de madera u otra construcción principalmente combustible verificada.',
  'Construction type is unknown, unverified, or materially conflicts across sources.':
    'El tipo de construcción es desconocido, no verificado o presenta contradicciones importantes entre fuentes.',

  // Scoring rules — Roof age and condition
  'Roof is less than 10 years old and no active deficiencies are noted in a report dated within the last 24 months.':
    'El techo tiene menos de 10 años y no se señalan deficiencias activas en un informe con fecha de los últimos 24 meses.',
  'Roof is 10 to 20 years old, or newer than 10 years old without a recent condition report.':
    'El techo tiene entre 10 y 20 años, o menos de 10 años pero sin un informe reciente de su estado.',
  'Roof is more than 20 years old but a report dated within the last 12 months states no active leak or failure condition.':
    'El techo tiene más de 20 años, pero un informe con fecha de los últimos 12 meses indica que no hay fugas ni fallas activas.',
  'Roof age is unknown, roof is more than 20 years old without a recent clean report, or any active leak or failure is documented.':
    'Se desconoce la antigüedad del techo, el techo tiene más de 20 años sin un informe reciente sin observaciones, o se documenta alguna fuga o falla activa.',

  // Scoring rules — Sprinkler system
  'Full-building sprinkler coverage is installed, operational, and backed by a current inspection certificate.':
    'Hay cobertura de rociadores en todo el edificio, instalada, operativa y respaldada por un certificado de inspección vigente.',
  'Partial sprinkler coverage is installed and operational, or full coverage exists without current inspection proof.':
    'Hay cobertura parcial de rociadores instalada y operativa, o cobertura total sin comprobante de inspección vigente.',
  'Sprinklers exist but status, coverage, or operability cannot be fully verified.':
    'Existen rociadores, pero su estado, cobertura u operatividad no se pueden verificar por completo.',
  'No sprinkler system is present.': 'No hay sistema de rociadores.',

  // Scoring rules — Fire and smoke alarm system
  'Centrally monitored fire alarm system is installed and current monitoring evidence is provided.':
    'Hay un sistema de alarma de incendios con monitoreo central instalado y se aporta evidencia de monitoreo vigente.',
  'Local audible alarm system is installed but not centrally monitored.':
    'Hay un sistema de alarma audible local instalado, pero sin monitoreo central.',
  'Alarm equipment is visible but monitoring or operability cannot be verified.':
    'El equipo de alarma es visible, pero no se puede verificar el monitoreo ni la operatividad.',
  'No fire or smoke alarm system is present.':
    'No hay sistema de alarma de incendios ni de humo.',

  // Scoring rules — Burglar alarm
  'Monitored intrusion alarm is active and evidence of monitoring is current.':
    'Hay una alarma de intrusión monitoreada activa y la evidencia de monitoreo está vigente.',
  'Local alarm or unmonitored intrusion system is present.':
    'Hay una alarma local o un sistema de intrusión sin monitoreo.',
  'No intrusion alarm exists, or evidence is insufficient to confirm any active system.':
    'No existe una alarma de intrusión, o la evidencia es insuficiente para confirmar algún sistema activo.',

  // Scoring rules — Fire hydrant distance
  'Nearest fire hydrant is less than 500 feet away.':
    'El hidrante más cercano está a menos de 500 pies.',
  'Nearest fire hydrant is 500 to 1000 feet away.':
    'El hidrante más cercano está entre 500 y 1000 pies.',
  'Nearest fire hydrant is more than 1000 feet away, or no reliable hydrant location is available.':
    'El hidrante más cercano está a más de 1000 pies, o no se dispone de una ubicación confiable de hidrante.',

  // Scoring rules — Fire station distance
  'Nearest fire station is less than 1 mile away.':
    'La estación de bomberos más cercana está a menos de 1 milla.',
  'Nearest fire station is 1 to 3 miles away.':
    'La estación de bomberos más cercana está entre 1 y 3 millas.',
  'Nearest fire station is more than 3 miles away.':
    'La estación de bomberos más cercana está a más de 3 millas.',
  'No reliable fire station location is available.':
    'No se dispone de una ubicación confiable de estación de bomberos.',

  // Scoring rules — Catastrophe zone
  'Property is outside both a FEMA special flood hazard area and a state-designated high or very-high wildfire hazard zone.':
    'La propiedad está fuera de una zona especial de riesgo de inundación de FEMA y de una zona de riesgo alto o muy alto de incendios forestales designada por el estado.',
  'Property is inside at least one high-risk zone but all required mitigation for that zone is documented and current.':
    'La propiedad está dentro de al menos una zona de alto riesgo, pero toda la mitigación requerida para esa zona está documentada y vigente.',
  'Property is inside a high-risk zone without documented mitigation, or zone status cannot be verified.':
    'La propiedad está dentro de una zona de alto riesgo sin mitigación documentada, o no se puede verificar el estado de la zona.',

  // Scoring rules — Business hazard class
  'Verified low-hazard occupancy such as office, professional services, apparel retail, bookstore, or comparable operations with no hazardous processing.':
    'Ocupación de bajo riesgo verificada, como oficina, servicios profesionales, venta de ropa, librería u operaciones comparables sin procesos peligrosos.',
  'Verified medium-hazard occupancy such as grocery, salon, fitness studio, cafe without deep frying, or comparable operations with limited hazard sources.':
    'Ocupación de riesgo medio verificada, como supermercado, salón de belleza, estudio de acondicionamiento físico, cafetería sin freidoras u operaciones comparables con fuentes de riesgo limitadas.',
  'Verified high-hazard occupancy such as full-service restaurant, bar, auto service, contractor yard, light manufacturing, or comparable operations with elevated loss potential.':
    'Ocupación de alto riesgo verificada, como restaurante de servicio completo, bar, taller mecánico, patio de contratista, manufactura ligera u operaciones comparables con alto potencial de pérdida.',
  'Hazard class cannot be verified or the operation is materially misclassified.':
    'No se puede verificar la clase de riesgo o la operación está clasificada de forma materialmente incorrecta.',

  // Scoring rules — Years in operation
  'Business has operated continuously for more than 5 years.':
    'El negocio ha operado de forma continua durante más de 5 años.',
  'Business has operated continuously for 2 to 5 years.':
    'El negocio ha operado de forma continua entre 2 y 5 años.',
  'Business has operated continuously for less than 2 years.':
    'El negocio ha operado de forma continua durante menos de 2 años.',
  'Operating history cannot be verified.':
    'No se puede verificar el historial de operación.',

  // Scoring rules — Claims history
  'Verified zero claims in the last 5 completed policy years.':
    'Cero reclamos verificados en los últimos 5 años de póliza completos.',
  'Verified exactly 1 claim in the last 5 completed policy years.':
    'Exactamente 1 reclamo verificado en los últimos 5 años de póliza completos.',
  'Verified 2 or more claims in the last 5 completed policy years.':
    '2 o más reclamos verificados en los últimos 5 años de póliza completos.',
  'Loss runs are missing, incomplete, or cannot be verified for the full 5-year period.':
    'Los historiales de pérdidas faltan, están incompletos o no se pueden verificar para el periodo completo de 5 años.',

  // Scoring rules — Hours of operation
  'Business closes by 8:00 PM local time on all operating days.':
    'El negocio cierra a más tardar a las 8:00 PM hora local en todos los días de operación.',
  'Business closes after 8:00 PM but not later than 11:00 PM local time.':
    'El negocio cierra después de las 8:00 PM, pero no más tarde de las 11:00 PM hora local.',
  'Business operates past 11:00 PM local time.':
    'El negocio opera después de las 11:00 PM hora local.',
  'Operating hours cannot be verified.':
    'No se puede verificar el horario de operación.',

  // Scoring rules — Liquor service
  'No alcohol is sold or served on premises.':
    'No se vende ni sirve alcohol en el local.',
  'Only beer and wine are sold or served on premises.':
    'Solo se vende o sirve cerveza y vino en el local.',
  'Full liquor service is offered, or alcohol exposure cannot be verified.':
    'Se ofrece servicio completo de bebidas alcohólicas, o no se puede verificar la exposición al alcohol.',

  // Scoring rules — Cooking exposure
  'No grease-laden vapor, deep frying, wok, charbroiling, or open-flame commercial cooking occurs on site.':
    'No hay vapores cargados de grasa, frituras por inmersión, wok, asado a la parrilla ni cocina comercial con llama abierta en el sitio.',
  'Hazardous commercial cooking occurs and a compliant hood suppression system with current service documentation is in place.':
    'Existe cocina comercial peligrosa y hay un sistema de supresión en la campana que cumple la norma, con documentación de servicio vigente.',
  'Hazardous commercial cooking occurs without current suppression proof, or cooking exposure cannot be verified.':
    'Existe cocina comercial peligrosa sin comprobante de supresión vigente, o no se puede verificar la exposición de cocina.',

  // Scoring rules — Cash controls
  'Typical overnight cash on premises is less than 500 dollars.':
    'El efectivo que normalmente queda en el local durante la noche es menor a 500 dólares.',
  'Typical overnight cash on premises is 500 to 2000 dollars and a locked safe is used.':
    'El efectivo que normalmente queda en el local durante la noche es de 500 a 2000 dólares y se usa una caja fuerte con llave.',
  'Typical overnight cash on premises exceeds 2000 dollars, or cash procedures cannot be verified.':
    'El efectivo que normalmente queda en el local durante la noche supera los 2000 dólares, o no se pueden verificar los procedimientos de manejo de efectivo.',

  // Scoring rules — Lease or deed
  'Current lease or deed is uploaded and the term is active as of the scoring date.':
    'Se cargó un contrato de arrendamiento o escritura vigente y el plazo está activo a la fecha de puntuación.',
  'Lease or deed is uploaded but expired, unsigned, or missing key pages.':
    'Se cargó el contrato de arrendamiento o escritura, pero está vencido, sin firmar o le faltan páginas clave.',
  'No lease or deed is provided and no public ownership record resolves the occupancy question.':
    'No se proporciona contrato de arrendamiento ni escritura, y ningún registro público de propiedad resuelve la cuestión de ocupación.',

  // Scoring rules — Certificate of occupancy
  'Valid certificate of occupancy or equivalent municipal occupancy approval is provided.':
    'Se proporciona un certificado de ocupación válido o una aprobación municipal de ocupación equivalente.',
  'No valid occupancy approval is provided or verifiable.':
    'No se proporciona ni se puede verificar una aprobación de ocupación válida.',

  // Scoring rules — Business license
  'Active business license is current through the scoring date.':
    'La licencia comercial activa está vigente hasta la fecha de puntuación.',
  'License is provided but expired.':
    'Se proporciona la licencia, pero está vencida.',
  'No business license is provided or the license cannot be verified.':
    'No se proporciona licencia comercial o la licencia no se puede verificar.',

  // Scoring rules — Prior loss runs
  'Complete 5-year loss runs are provided with all carriers represented.':
    'Se proporcionan historiales de pérdidas completos de 5 años con todas las aseguradoras representadas.',
  'Partial loss runs are provided but at least one year or one carrier is missing.':
    'Se proporcionan historiales de pérdidas parciales, pero falta al menos un año o una aseguradora.',
  'No loss runs are provided.': 'No se proporcionan historiales de pérdidas.',

  // Scoring rules — Financial statements
  'Two full years of financial statements or tax returns are provided.':
    'Se proporcionan dos años completos de estados financieros o declaraciones de impuestos.',
  'One full year of financial statements or tax returns is provided.':
    'Se proporciona un año completo de estados financieros o declaraciones de impuestos.',
  'No current financial statements or tax returns are provided.':
    'No se proporcionan estados financieros ni declaraciones de impuestos vigentes.',

  // Scoring rules — Written safety procedures
  'Written safety or emergency procedures are uploaded and clearly apply to the current location and operations.':
    'Se cargan procedimientos escritos de seguridad o emergencia que claramente aplican a la ubicación y operaciones actuales.',
  'Informal or outdated procedures are provided but are not clearly current or location-specific.':
    'Se proporcionan procedimientos informales o desactualizados, pero no son claramente vigentes ni específicos de la ubicación.',
  'No written procedures are provided.':
    'No se proporcionan procedimientos escritos.',

  // Scoring rules — Vendor COIs
  'Current COIs are on file for all major vendors and contractors with ongoing site access or service obligations.':
    'Se tienen en archivo certificados de seguro vigentes de todos los proveedores y contratistas importantes con acceso continuo al sitio u obligaciones de servicio.',
  'COIs are on file for some, but not all, major vendors and contractors.':
    'Se tienen en archivo certificados de seguro de algunos, pero no de todos, los proveedores y contratistas importantes.',
  'No COIs are on file or vendor scope cannot be reconciled.':
    'No hay certificados de seguro en archivo o no se puede conciliar el alcance de los proveedores.',

  // Scoring rules — Maintenance logs
  'Maintenance logs or service records are complete for major building systems and insured equipment.':
    'Los registros de mantenimiento o servicio están completos para los principales sistemas del edificio y los equipos asegurados.',
  'Partial maintenance records exist but at least one major system has no current evidence.':
    'Existen registros de mantenimiento parciales, pero al menos un sistema importante no cuenta con evidencia vigente.',
  'No maintenance records are provided.':
    'No se proporcionan registros de mantenimiento.',

  // Scoring rules — Security cameras
  'At least 4 cameras cover entrances, exits, and cash-handling areas and footage is retained in a retrievable system.':
    'Al menos 4 cámaras cubren entradas, salidas y áreas de manejo de efectivo, y las grabaciones se conservan en un sistema del que se pueden recuperar.',
  '1 to 3 cameras are present or camera coverage is incomplete.':
    'Hay de 1 a 3 cámaras o la cobertura de cámaras es incompleta.',
  'No cameras are present or no reliable evidence is provided.':
    'No hay cámaras o no se proporciona evidencia confiable.',

  // Scoring rules — Employee safety training
  'Annual safety training is documented for current staff within the last 12 months.':
    'Hay capacitación anual de seguridad documentada para el personal actual dentro de los últimos 12 meses.',
  'Training is documented but older than 12 months or not all current staff are covered.':
    'La capacitación está documentada, pero tiene más de 12 meses o no cubre a todo el personal actual.',
  'No safety training evidence is provided.':
    'No se proporciona evidencia de capacitación de seguridad.',

  // Scoring rules — Cybersecurity basics
  'PCI obligations are current if applicable and MFA is enabled on core payment or admin systems.':
    'Las obligaciones PCI están vigentes si corresponde y la autenticación multifactor (MFA) está habilitada en los sistemas principales de pago o administración.',
  'Basic cyber controls exist but either PCI evidence or MFA evidence is missing.':
    'Existen controles cibernéticos básicos, pero falta la evidencia de PCI o de MFA.',
  'No cyber control evidence is provided for a business that stores, transmits, or processes payment or customer data.':
    'No se proporciona evidencia de controles cibernéticos para un negocio que almacena, transmite o procesa datos de pago o de clientes.',

  // Scoring rules — Workers' comp class accuracy
  "Workers' comp class codes align with actual operations and payroll segmentation.":
    'Los códigos de clasificación de compensación laboral coinciden con las operaciones reales y la segmentación de la nómina.',
  'Class codes are missing, inaccurate, or cannot be verified against operations.':
    'Los códigos de clasificación faltan, son inexactos o no se pueden verificar frente a las operaciones.',

  // Scoring rules — Signage and lighting
  'Exterior entry points and customer approach paths are clearly lit and primary business signage is legible.':
    'Los puntos de acceso exteriores y las rutas de aproximación de clientes están claramente iluminados y el letrero principal del negocio es legible.',
  'Lighting or signage is present but coverage is incomplete or visibly weak.':
    'Hay iluminación o letreros, pero la cobertura es incompleta o visiblemente deficiente.',
  'Exterior lighting is inadequate, signage is absent, or evidence is not provided.':
    'La iluminación exterior es inadecuada, no hay letreros o no se proporciona evidencia.',

  // Scoring rules — Emergency contact list
  'Emergency contact list is visibly posted and includes current internal and emergency contacts.':
    'La lista de contactos de emergencia está visiblemente publicada e incluye los contactos internos y de emergencia actuales.',
  'No posted emergency contact list is visible.':
    'No hay una lista de contactos de emergencia visible.',

  // Scoring rules — Annual property inspection
  'Property inspection is completed within the last 12 months.':
    'La inspección de la propiedad se completó dentro de los últimos 12 meses.',
  'Property inspection is 12 to 24 months old.':
    'La inspección de la propiedad tiene entre 12 y 24 meses.',
  'No inspection is provided or the latest inspection is older than 24 months.':
    'No se proporciona inspección o la más reciente tiene más de 24 meses.',

  // Bonus "what counts" descriptions
  'Third-party inspection or property condition survey dated within the last 6 months with no open critical deficiencies.':
    'Inspección de un tercero o estudio del estado de la propiedad con fecha de los últimos 6 meses y sin deficiencias críticas abiertas.',
  'Current written procedure covering opening duties, closing duties, deposit cadence, dual-control expectations if used, and after-hours cash storage.':
    'Procedimiento escrito vigente que cubre las tareas de apertura, las tareas de cierre, la frecuencia de depósitos, las expectativas de doble control si se usan y el resguardo de efectivo fuera del horario.',
  'Every documentation factor in this pillar receives full points at the same time.':
    'Todos los factores de documentación de este pilar reciben puntaje completo al mismo tiempo.',
  'Current written plan covering emergency shutdown, key contacts, vendor fallback, data recovery, and reopening steps.':
    'Plan escrito vigente que cubre el cierre de emergencia, los contactos clave, los proveedores de respaldo, la recuperación de datos y los pasos de reapertura.',
}

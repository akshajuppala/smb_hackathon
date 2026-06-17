// Spanish translations for PageScoringFramework, keyed by the exact English
// source string passed to t(). Includes static UI labels plus the data-derived
// strings rendered from the scoring framework API and the restaurant profile.
export const scoringFramework = {
  // Error / loading states
  'Framework viewer failed to load': 'No se pudo cargar el visor del marco de evaluacion',
  'The frontend server could not load the scoring framework.':
    'El servidor no pudo cargar el marco de evaluacion.',
  'Loading scoring framework': 'Cargando marco de evaluacion',
  'Preparing the restaurant submission from the framework data.':
    'Preparando la solicitud del restaurante a partir de los datos del marco.',

  // Topbar
  'Restaurant Submission': 'Solicitud del restaurante',
  'Back to assessment': 'Volver a la evaluacion',
  'Download PDF': 'Descargar PDF',
  'Download Image PDF': 'Descargar PDF de imagen',

  // Summary cards
  Business: 'Negocio',
  'Final Score': 'Puntaje final',
  core: 'base',
  bonus: 'adicional',
  Strengths: 'Fortalezas',
  'Main Gaps': 'Brechas principales',

  // Section titles and counters
  'Pillar Scores': 'Puntajes por pilar',
  pillars: 'pilares',
  'Scored Factors': 'Factores evaluados',
  rows: 'filas',
  'Bonus Paths': 'Vias de puntos adicionales',
  'core points': 'puntos base',
  pts: 'pts',

  // Table headers
  Pillar: 'Pilar',
  Factor: 'Factor',
  Score: 'Puntaje',
  'Matched Rule': 'Regla aplicada',
  Evidence: 'Evidencia',
  'Underwriting Notes': 'Notas de suscripcion',
  Bonus: 'Adicional',
  Outcome: 'Resultado',
  Notes: 'Notas',

  // Profile: summary text
  'Independent 72-seat neighborhood restaurant with beer and wine service, dine-in and takeout, and nine years of operating history.':
    'Restaurante de barrio independiente de 72 asientos con servicio de cerveza y vino, consumo en el local y para llevar, y nueve anos de historial operativo.',
  'The account shows stable operations and no recent claims, but still has ordinary underwriting gaps around sprinkler protection, documentation completeness, and control maturity.':
    'La cuenta muestra operaciones estables y sin reclamos recientes, pero aun presenta brechas habituales de suscripcion en cuanto a la proteccion contra incendios por rociadores, la integridad de la documentacion y la madurez de los controles.',

  // Profile: strengths
  'Stable operating history with no verified claims in five completed policy years.':
    'Historial operativo estable sin reclamos verificados en cinco anos de poliza completos.',
  'Core licenses and occupancy records are current.':
    'Las licencias principales y los registros de ocupacion estan vigentes.',
  'Commercial cooking is protected by a serviced hood suppression system.':
    'La cocina comercial esta protegida por un sistema de supresion de campana con mantenimiento al dia.',

  // Profile: gaps
  'No full-building sprinkler system.':
    'No hay un sistema de rociadores en todo el edificio.',
  'Partial loss runs, COIs, and maintenance records.':
    'Historiales de siniestros, certificados de seguro (COI) y registros de mantenimiento parciales.',
  'Basic but not fully mature alarm, cyber, and continuity controls.':
    'Controles de alarma, ciberseguridad y continuidad basicos pero no del todo maduros.',

  // Grade band readiness
  'Strong submission profile; eligible for preferred markets.':
    'Perfil de solicitud solido; elegible para mercados preferentes.',
  'Standard market eligible; minor improvements suggested.':
    'Elegible para el mercado estandar; se sugieren mejoras menores.',
  'Likely E&S placement; clear improvement path identified.':
    'Probable colocacion en lineas excedentes (E&S); se identifico una ruta de mejora clara.',
  'Significant gaps; top remediation items should be addressed first.':
    'Brechas significativas; primero deben atenderse los puntos de remediacion prioritarios.',
  'Foundational gaps; not submission-ready for most standard markets.':
    'Brechas fundamentales; no esta listo para la mayoria de los mercados estandar.',

  // Pillar names
  'Property & Physical Risk': 'Riesgo de propiedad y fisico',
  'Operational Risk': 'Riesgo operativo',
  'Documentation Readiness': 'Preparacion de la documentacion',
  'Mitigation & Controls': 'Mitigacion y controles',

  // Factor names
  'Building construction type': 'Tipo de construccion del edificio',
  'Roof age and condition': 'Antiguedad y estado del techo',
  'Sprinkler system': 'Sistema de rociadores',
  'Fire and smoke alarm system': 'Sistema de alarma de incendio y humo',
  'Burglar alarm and intrusion security': 'Alarma antirrobo y seguridad contra intrusiones',
  'Distance to nearest fire hydrant': 'Distancia al hidrante mas cercano',
  'Distance to nearest fire station': 'Distancia a la estacion de bomberos mas cercana',
  'Flood and wildfire zone exposure': 'Exposicion a zonas de inundacion e incendios forestales',
  'Business hazard class': 'Clase de riesgo del negocio',
  'Years in operation': 'Anos en operacion',
  'Prior claims history': 'Historial de reclamos previos',
  'Hours of operation': 'Horario de operacion',
  'Liquor service exposure': 'Exposicion por servicio de bebidas alcoholicas',
  'Commercial cooking exposure and suppression':
    'Exposicion y supresion de cocina comercial',
  'Cash on premises and deposit controls':
    'Efectivo en el local y controles de deposito',
  'Current lease or deed': 'Contrato de arrendamiento o escritura vigente',
  'Certificate of occupancy': 'Certificado de ocupacion',
  'Active business license': 'Licencia comercial activa',
  'Prior loss runs': 'Historiales de siniestros previos',
  'Financial statements or tax returns':
    'Estados financieros o declaraciones de impuestos',
  'Written safety and emergency procedures':
    'Procedimientos escritos de seguridad y emergencia',
  'Vendor certificates of insurance': 'Certificados de seguro de proveedores',
  'Equipment and building maintenance logs':
    'Registros de mantenimiento de equipos y del edificio',
  'Security cameras': 'Camaras de seguridad',
  'Employee safety training': 'Capacitacion en seguridad para empleados',
  'Cybersecurity basics for payment or customer data':
    'Fundamentos de ciberseguridad para datos de pago o de clientes',
  "Workers' compensation class-code accuracy":
    'Precision de los codigos de clase de compensacion de trabajadores',
  'Exterior signage and lighting': 'Senalizacion e iluminacion exteriores',
  'Posted emergency contact list': 'Lista de contactos de emergencia publicada',
  'Annual property inspection': 'Inspeccion anual de la propiedad',

  // Bonus names
  'Recent third-party property condition survey':
    'Inspeccion reciente del estado de la propiedad por un tercero',
  'Written opening, closing, and cash-drop procedures':
    'Procedimientos escritos de apertura, cierre y deposito de efectivo',
  'Complete document package': 'Paquete de documentos completo',
  'Business continuity and incident response plan':
    'Plan de continuidad del negocio y respuesta a incidentes',

  // Matched scoring rules (the "when" text for this restaurant's scores)
  'Verified joisted masonry or mixed masonry and combustible construction.':
    'Construccion verificada de mamposteria con viguetas o mixta de mamposteria y materiales combustibles.',
  'Roof is 10 to 20 years old, or newer than 10 years old without a recent condition report.':
    'El techo tiene entre 10 y 20 anos, o menos de 10 anos sin un informe de estado reciente.',
  'No sprinkler system is present.': 'No hay un sistema de rociadores instalado.',
  'Local audible alarm system is installed but not centrally monitored.':
    'Hay un sistema de alarma audible local instalado pero sin monitoreo central.',
  'Local alarm or unmonitored intrusion system is present.':
    'Hay una alarma local o un sistema de intrusion sin monitoreo.',
  'Nearest fire hydrant is less than 500 feet away.':
    'El hidrante mas cercano esta a menos de 500 pies.',
  'Nearest fire station is 1 to 3 miles away.':
    'La estacion de bomberos mas cercana esta a entre 1 y 3 millas.',
  'Property is outside both a FEMA special flood hazard area and a state-designated high or very-high wildfire hazard zone.':
    'La propiedad esta fuera de un area especial de riesgo de inundacion de FEMA y de una zona de riesgo alto o muy alto de incendios forestales designada por el estado.',
  'Verified high-hazard occupancy such as full-service restaurant, bar, auto service, contractor yard, light manufacturing, or comparable operations with elevated loss potential.':
    'Ocupacion de alto riesgo verificada, como restaurante de servicio completo, bar, taller automotriz, patio de contratista, manufactura ligera u operaciones comparables con alto potencial de siniestros.',
  'Business has operated continuously for more than 5 years.':
    'El negocio ha operado de forma continua por mas de 5 anos.',
  'Verified zero claims in the last 5 completed policy years.':
    'Cero reclamos verificados en los ultimos 5 anos de poliza completos.',
  'Business closes after 8:00 PM but not later than 11:00 PM local time.':
    'El negocio cierra despues de las 8:00 PM pero no mas tarde de las 11:00 PM, hora local.',
  'Only beer and wine are sold or served on premises.':
    'Solo se venden o sirven cerveza y vino en el local.',
  'Hazardous commercial cooking occurs and a compliant hood suppression system with current service documentation is in place.':
    'Se realiza cocina comercial peligrosa y existe un sistema de supresion de campana conforme con documentacion de mantenimiento vigente.',
  'Typical overnight cash on premises is 500 to 2000 dollars and a locked safe is used.':
    'El efectivo habitual que queda en el local durante la noche es de 500 a 2000 dolares y se usa una caja fuerte con llave.',
  'Current lease or deed is uploaded and the term is active as of the scoring date.':
    'Se carga un contrato de arrendamiento o escritura vigente y el plazo esta activo a la fecha de evaluacion.',
  'Valid certificate of occupancy or equivalent municipal occupancy approval is provided.':
    'Se presenta un certificado de ocupacion valido o una aprobacion municipal de ocupacion equivalente.',
  'Active business license is current through the scoring date.':
    'La licencia comercial activa esta vigente hasta la fecha de evaluacion.',
  'Partial loss runs are provided but at least one year or one carrier is missing.':
    'Se presentan historiales de siniestros parciales pero falta al menos un ano o una aseguradora.',
  'One full year of financial statements or tax returns is provided.':
    'Se presenta un ano completo de estados financieros o declaraciones de impuestos.',
  'Informal or outdated procedures are provided but are not clearly current or location-specific.':
    'Se presentan procedimientos informales o desactualizados que no son claramente vigentes ni especificos del local.',
  'COIs are on file for some, but not all, major vendors and contractors.':
    'Hay certificados de seguro (COI) en archivo para algunos, pero no todos, los principales proveedores y contratistas.',
  'Partial maintenance records exist but at least one major system has no current evidence.':
    'Existen registros de mantenimiento parciales pero al menos un sistema principal no tiene evidencia vigente.',
  '1 to 3 cameras are present or camera coverage is incomplete.':
    'Hay de 1 a 3 camaras o la cobertura de camaras es incompleta.',
  'Training is documented but older than 12 months or not all current staff are covered.':
    'La capacitacion esta documentada pero tiene mas de 12 meses o no cubre a todo el personal actual.',
  'Basic cyber controls exist but either PCI evidence or MFA evidence is missing.':
    'Existen controles ciberneticos basicos pero falta la evidencia de PCI o de autenticacion multifactor (MFA).',
  'Workers\' comp class codes align with actual operations and payroll segmentation.':
    'Los codigos de clase de compensacion de trabajadores coinciden con las operaciones reales y la segmentacion de la nomina.',
  'Exterior entry points and customer approach paths are clearly lit and primary business signage is legible.':
    'Los accesos exteriores y las rutas de aproximacion de los clientes estan bien iluminados y la senalizacion principal del negocio es legible.',
  'Emergency contact list is visibly posted and includes current internal and emergency contacts.':
    'La lista de contactos de emergencia esta visiblemente publicada e incluye contactos internos y de emergencia vigentes.',
  'Property inspection is 12 to 24 months old.':
    'La inspeccion de la propiedad tiene entre 12 y 24 meses.',

  // Profile: factor evidence
  'Property card and walkthrough photos':
    'Ficha de la propiedad y fotos del recorrido',
  'Landlord invoice and walkthrough notes':
    'Factura del arrendador y notas del recorrido',
  'Interior walkthrough': 'Recorrido por el interior',
  'Alarm panel and smoke detector photos':
    'Fotos del panel de alarma y del detector de humo',
  'Door keypad photo and owner attestation':
    'Foto del teclado de la puerta y declaracion del propietario',
  'Municipal GIS map': 'Mapa GIS municipal',
  'FEMA and state hazard lookups':
    'Consultas de riesgos de FEMA y del estado',
  'NAICS classification and operations summary':
    'Clasificacion NAICS y resumen de operaciones',
  'License history and Secretary of State record':
    'Historial de licencias y registro de la Secretaria de Estado',
  'Broker loss-run summary': 'Resumen de siniestros del corredor',
  'Public hours and POS schedule':
    'Horario publico y programacion del punto de venta',
  'Beer and wine license': 'Licencia de cerveza y vino',
  'Suppression tag and hood cleaning invoice':
    'Etiqueta del sistema de supresion y factura de limpieza de campana',
  'Cash-drop SOP and safe photo':
    'Procedimiento de deposito de efectivo y foto de la caja fuerte',
  'Signed lease PDF': 'PDF del contrato de arrendamiento firmado',
  'Municipal occupancy certificate': 'Certificado municipal de ocupacion',
  'Current city business license': 'Licencia comercial municipal vigente',
  'Current carrier loss runs and broker email':
    'Historiales de siniestros de la aseguradora actual y correo del corredor',
  'Latest P&L and one tax return':
    'Ultimo estado de resultados y una declaracion de impuestos',
  'Staff handbook excerpt': 'Extracto del manual del personal',
  'Vendor insurance folder': 'Carpeta de seguros de proveedores',
  'HVAC, refrigeration, and suppression invoices':
    'Facturas de climatizacion, refrigeracion y supresion',
  'Camera stills and cloud DVR screenshot':
    'Capturas de las camaras y captura de pantalla del DVR en la nube',
  'Training sign-in sheet': 'Hoja de registro de capacitacion',
  'POS PCI attestation and admin login screenshot':
    'Declaracion PCI del punto de venta y captura de pantalla del inicio de sesion de administrador',
  'Workers comp policy and payroll summary':
    'Poliza de compensacion de trabajadores y resumen de nomina',
  'Day and night storefront photos':
    'Fotos de la fachada de dia y de noche',
  'Posted contact list photo': 'Foto de la lista de contactos publicada',
  'Landlord walkthrough checklist':
    'Lista de verificacion del recorrido del arrendador',

  // Profile: factor notes
  'Older joisted-masonry storefront with combustible roof framing.':
    'Local mas antiguo de mamposteria con viguetas y estructura de techo combustible.',
  'Roof is about 12 years old with no recent third-party condition report.':
    'El techo tiene unos 12 anos y no cuenta con un informe de estado reciente de un tercero.',
  'No full-building sprinkler coverage.':
    'No hay cobertura de rociadores en todo el edificio.',
  'Local alarm present, but no proof of central monitoring.':
    'Hay alarma local, pero no hay prueba de monitoreo central.',
  'Basic intrusion alarm without monitoring documentation.':
    'Alarma de intrusion basica sin documentacion de monitoreo.',
  'Hydrant is roughly 280 feet away.':
    'El hidrante esta a aproximadamente 280 pies.',
  'Nearest fire station is about 1.8 miles away.':
    'La estacion de bomberos mas cercana esta a unas 1.8 millas.',
  'Outside high-risk flood and wildfire designations.':
    'Fuera de las designaciones de alto riesgo de inundacion e incendios forestales.',
  'Full-service restaurant with commercial cooking is a higher-hazard occupancy.':
    'Un restaurante de servicio completo con cocina comercial es una ocupacion de mayor riesgo.',
  'Continuous operation for nine years.':
    'Operacion continua durante nueve anos.',
  'No verified claims in the last five completed policy years.':
    'Sin reclamos verificados en los ultimos cinco anos de poliza completos.',
  'Closes around 10:00 PM.': 'Cierra alrededor de las 10:00 PM.',
  'Moderate alcohol exposure, but not full liquor service.':
    'Exposicion moderada al alcohol, pero sin servicio completo de bebidas alcoholicas.',
  'Grease-producing cooking exists and suppression service is current.':
    'Hay cocina que genera grasa y el servicio de supresion esta al dia.',
  'Overnight cash usually falls between 500 and 1,500 dollars with a safe in use.':
    'El efectivo nocturno suele estar entre 500 y 1,500 dolares y se usa una caja fuerte.',
  'Lease is active and fully executed.':
    'El contrato de arrendamiento esta activo y plenamente formalizado.',
  'Occupancy approval is valid for restaurant use.':
    'La aprobacion de ocupacion es valida para uso como restaurante.',
  'License is current through the present term.':
    'La licencia esta vigente durante el periodo actual.',
  'Most records are available, but one older carrier period is still missing.':
    'La mayoria de los registros estan disponibles, pero aun falta un periodo de una aseguradora anterior.',
  'One full year is organized; the second year is not packaged yet.':
    'Un ano completo esta organizado; el segundo ano aun no esta preparado.',
  'Basic procedures exist, but they are informal and not fully location-specific.':
    'Existen procedimientos basicos, pero son informales y no del todo especificos del local.',
  'Some recurring vendors have COIs on file, but coverage is incomplete.':
    'Algunos proveedores recurrentes tienen certificados de seguro (COI) en archivo, pero la cobertura es incompleta.',
  'Partial service history exists without a complete log.':
    'Existe un historial de servicio parcial sin un registro completo.',
  'Limited camera coverage at entry and register, but not comprehensive.':
    'Cobertura de camaras limitada en la entrada y la caja, pero no integral.',
  'Training is documented, but not all current staff are covered recently.':
    'La capacitacion esta documentada, pero no todo el personal actual ha sido cubierto recientemente.',
  'Some cyber controls exist, but MFA evidence is incomplete.':
    'Existen algunos controles ciberneticos, pero la evidencia de autenticacion multifactor (MFA) es incompleta.',
  'Payroll classes appear aligned to actual front- and back-of-house work.':
    'Las clases de nomina parecen alineadas con el trabajo real de atencion al cliente y de cocina.',
  'Customer approach is well lit and signage is clear.':
    'La aproximacion de los clientes esta bien iluminada y la senalizacion es clara.',
  'Emergency contacts are visibly posted and current.':
    'Los contactos de emergencia estan visiblemente publicados y vigentes.',
  'Latest documented inspection is about 18 months old.':
    'La inspeccion documentada mas reciente tiene unos 18 meses.',

  // Profile: bonus notes
  'No recent third-party condition survey is on file.':
    'No hay en archivo una inspeccion reciente del estado por un tercero.',
  'Opening, closing, and cash-drop procedures are documented.':
    'Los procedimientos de apertura, cierre y deposito de efectivo estan documentados.',
  'Several documentation items are still partial rather than complete.':
    'Varios elementos de documentacion siguen siendo parciales en lugar de completos.',
  'No current written continuity or incident response plan is provided.':
    'No se proporciona un plan escrito vigente de continuidad o respuesta a incidentes.',
}

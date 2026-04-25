export const locationChecklist = [
  {
    id: 'crime_score',
    label: "You know your building's ISO Crime Score or neighborhood crime rating",
    description: "Insurers pull this automatically, but knowing it helps you shop and negotiate.",
    priority: 'high',
  },
  {
    id: 'fire_station',
    label: "Distance to the nearest fire station is documented (under 1 mile is ideal)",
    description: "ISO fire protection class directly affects property premiums. Class 1–3 = best rates.",
    priority: 'high',
  },
  {
    id: 'fema_flood',
    label: "Building is not in a FEMA flood zone (or you have separate flood policy if it is)",
    description: "Standard property insurance never covers flooding. Check FEMA flood maps.",
    priority: 'high',
  },
  {
    id: 'vandalism_history',
    label: "Neighborhood vandalism or break-in history reviewed for last 3 years",
    description: "Prior claims at the address (not just your claims) can affect your insurability.",
    priority: 'high',
  },
  {
    id: 'claim_history',
    label: "You have documented the address's prior insurance claim history (request from landlord)",
    description: "",
    priority: 'medium',
  },
  {
    id: 'signage',
    label: "Signage is not blocking windows (impacts natural light and robbery deterrence)",
    description: "",
    priority: 'low',
  },
]

export const buildingChecklist = [
  {
    id: 'construction_year',
    label: "Year of original building construction is documented",
    description: "Buildings under 25 years old often qualify for preferred rates. Older buildings need proof of upgrades.",
    priority: 'high',
  },
  {
    id: 'roof_age',
    label: "Roof age and material are documented (inspection report preferred)",
    description: "Roofs over 20 years old trigger premium surcharges or exclusions. Metal and flat TPO roofs perform best.",
    priority: 'high',
  },
  {
    id: 'roof_inspection',
    label: "Roof has been inspected by a licensed contractor within last 3 years",
    description: "",
    priority: 'high',
  },
  {
    id: 'electrical',
    label: "Electrical system upgraded within last 20 years (panel documentation available)",
    description: "Knob-and-tube or aluminum wiring dramatically increases fire risk and premiums.",
    priority: 'high',
  },
  {
    id: 'plumbing',
    label: "Plumbing system inspected for leaks and pipe condition within last 5 years",
    description: "",
    priority: 'medium',
  },
  {
    id: 'hvac',
    label: "HVAC system serviced within the last 12 months (records on file)",
    description: "",
    priority: 'medium',
  },
  {
    id: 'structural_damage',
    label: "No known structural damage, water intrusion, or mold issues",
    description: "",
    priority: 'high',
  },
  {
    id: 'fire_codes',
    label: "Building is compliant with current local fire and building codes",
    description: "Code violations discovered during a claim can reduce or deny your payout.",
    priority: 'high',
  },
  {
    id: 'square_footage',
    label: "Square footage of the building is accurately documented",
    description: "",
    priority: 'low',
  },
  {
    id: 'ownership',
    label: "You own vs. lease the building — lease agreement clarifies who insures what",
    description: "Understand if the landlord covers the shell structure. You likely cover tenant improvements.",
    priority: 'medium',
  },
]

export const fireSafetyChecklist = [
  {
    id: 'fire_suppression',
    label: "Automatic fire suppression system installed above cooking equipment (Ansul or equivalent)",
    description: "Insurers reduce premiums 10–25% for certified hood suppression. Must be inspected every 6 months.",
    priority: 'high',
  },
  {
    id: 'suppression_cert',
    label: "Fire suppression inspection certificate is up to date (within 6 months)",
    description: "Expired certificates can void your policy in a fire claim.",
    priority: 'high',
  },
  {
    id: 'extinguishers',
    label: "Portable fire extinguishers present in kitchen, dining area, and near exits",
    description: "Class K extinguisher required in commercial kitchens. ABC for front of house.",
    priority: 'high',
  },
  {
    id: 'sprinkler_system',
    label: "Automatic sprinkler system covers the full building (including storage and basement)",
    description: "Full sprinkler coverage is one of the highest-value discounts an insurer can give.",
    priority: 'high',
  },
  {
    id: 'sprinkler_inspection',
    label: "Sprinkler system last inspected within 12 months (certificate on file)",
    description: "",
    priority: 'high',
  },
  {
    id: 'grease_traps',
    label: "Grease traps and exhaust ducts professionally cleaned within last 3 months",
    description: "Grease buildup is the #1 cause of restaurant fires. Cleaning logs are requested by insurers.",
    priority: 'high',
  },
  {
    id: 'duct_logs',
    label: "Duct cleaning logs available (dated and signed by vendor)",
    description: "",
    priority: 'medium',
  },
  {
    id: 'smoke_detectors',
    label: "Smoke detectors and heat detectors installed throughout (tested monthly)",
    description: "",
    priority: 'medium',
  },
  {
    id: 'fire_alarm',
    label: "Fire alarm system is monitored 24/7 by a central monitoring station",
    description: "",
    priority: 'medium',
  },
  {
    id: 'fire_exits',
    label: "All fire exits are clearly marked, unobstructed, and operational",
    description: "",
    priority: 'low',
  },
]

export const exteriorSecurityChecklist = [
  {
    id: 'impact_glass',
    label: "Impact-resistant glass on windows and doors",
    description: "Reduces break-in risk and may qualify for security discounts.",
    priority: 'high',
    detectedByCV: true,
  },
  {
    id: 'security_film',
    label: "Security film applied to window glass",
    description: "Prevents glass from shattering, reducing injury liability.",
    priority: 'high',
    detectedByCV: true,
  },
  {
    id: 'rolling_shutters',
    label: "Rolling metal shutters on storefront",
    description: "Strong deterrent for break-ins and vandalism after hours.",
    priority: 'medium',
    detectedByCV: true,
  },
  {
    id: 'led_lighting',
    label: "High-intensity exterior LED motion lighting installed",
    description: "Well-lit exteriors reduce crime risk and slip-and-fall liability.",
    priority: 'high',
    detectedByCV: true,
  },
  {
    id: 'cctv',
    label: "CCTV cameras visible and covering entrance",
    description: "Documented surveillance reduces liability claims.",
    priority: 'high',
    detectedByCV: true,
  },
  {
    id: 'entrance_clear',
    label: "Entrance is unobstructed, level, and well-maintained",
    description: "Clear entrances reduce slip-and-fall risk.",
    priority: 'high',
    detectedByCV: true,
  },
  {
    id: 'parking_lighting',
    label: "Parking lot / sidewalk lighting is adequate",
    description: "Poor lighting increases liability for customer incidents.",
    priority: 'medium',
    detectedByCV: false,
  },
]

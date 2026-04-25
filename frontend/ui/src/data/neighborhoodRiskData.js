// High-risk neighborhoods by city used for address-based risk flagging
export const HIGH_RISK_NEIGHBORHOODS = [
  // San Francisco
  { name: 'Tenderloin', city: 'San Francisco', state: 'CA', keywords: ['tenderloin'] },
  { name: 'SoMa (South of Market)', city: 'San Francisco', state: 'CA', keywords: ['soma', 'south of market'] },
  { name: 'Civic Center', city: 'San Francisco', state: 'CA', keywords: ['civic center'] },
  { name: 'Bayview', city: 'San Francisco', state: 'CA', keywords: ['bayview', 'hunters point'] },
  { name: 'Visitacion Valley', city: 'San Francisco', state: 'CA', keywords: ['visitacion valley'] },
  // Los Angeles
  { name: 'Skid Row', city: 'Los Angeles', state: 'CA', keywords: ['skid row'] },
  { name: 'Compton', city: 'Los Angeles', state: 'CA', keywords: ['compton'] },
  { name: 'Watts', city: 'Los Angeles', state: 'CA', keywords: ['watts'] },
  { name: 'East LA', city: 'Los Angeles', state: 'CA', keywords: ['east la', 'east los angeles'] },
  // New York
  { name: 'Brownsville', city: 'New York', state: 'NY', keywords: ['brownsville'] },
  { name: 'East New York', city: 'New York', state: 'NY', keywords: ['east new york'] },
  { name: 'South Bronx', city: 'New York', state: 'NY', keywords: ['south bronx', 'mott haven', 'hunts point'] },
  // Chicago
  { name: 'Englewood', city: 'Chicago', state: 'IL', keywords: ['englewood'] },
  { name: 'Austin', city: 'Chicago', state: 'IL', keywords: ['austin, chicago', 'austin il'] },
  { name: 'West Garfield Park', city: 'Chicago', state: 'IL', keywords: ['garfield park'] },
  // Oakland
  { name: 'East Oakland', city: 'Oakland', state: 'CA', keywords: ['east oakland', 'fruitvale', 'seminary'] },
  { name: 'West Oakland', city: 'Oakland', state: 'CA', keywords: ['west oakland'] },
  // Detroit
  { name: 'Brightmoor', city: 'Detroit', state: 'MI', keywords: ['brightmoor'] },
  { name: 'Delray', city: 'Detroit', state: 'MI', keywords: ['delray'] },
]

export const MEDIUM_RISK_NEIGHBORHOODS = [
  { name: 'Mission District', city: 'San Francisco', state: 'CA', keywords: ['mission district', 'mission sf'] },
  { name: 'Fillmore', city: 'San Francisco', state: 'CA', keywords: ['fillmore'] },
  { name: 'Inglewood', city: 'Los Angeles', state: 'CA', keywords: ['inglewood'] },
  { name: 'Harlem', city: 'New York', state: 'NY', keywords: ['harlem'] },
  { name: 'Bedford-Stuyvesant', city: 'New York', state: 'NY', keywords: ['bed-stuy', 'bedford-stuyvesant', 'bedford stuyvesant'] },
]

export function assessNeighborhoodRisk(address) {
  if (!address) return null
  const lower = address.toLowerCase()

  for (const n of HIGH_RISK_NEIGHBORHOODS) {
    if (n.keywords.some(k => lower.includes(k))) {
      return { level: 'high', neighborhood: n.name, city: n.city, state: n.state }
    }
  }
  for (const n of MEDIUM_RISK_NEIGHBORHOODS) {
    if (n.keywords.some(k => lower.includes(k))) {
      return { level: 'medium', neighborhood: n.name, city: n.city, state: n.state }
    }
  }
  return { level: 'low', neighborhood: null, city: null, state: null }
}

// Spanish translations, keyed by the exact English source string.
// Any English string passed to t() that is missing here falls back to English,
// so partial coverage is safe.
import { app } from './strings/app'
import { start } from './strings/start'
import { voiceIntake } from './strings/voiceIntake'
import { components } from './strings/components'
import { summary } from './strings/summary'
import { exterior } from './strings/exterior'
import { interior } from './strings/interior'
import { scoringFramework } from './strings/scoringFramework'
import { businessInfo } from './strings/businessInfo'
import { frameworkReference } from './strings/frameworkReference'

export const ES = {
  // Language toggle
  EN: 'EN',
  ESP: 'ESP',
  // Per-page string maps
  ...app,
  ...start,
  ...voiceIntake,
  ...components,
  ...summary,
  ...exterior,
  ...interior,
  ...scoringFramework,
  ...businessInfo,
  ...frameworkReference,
}

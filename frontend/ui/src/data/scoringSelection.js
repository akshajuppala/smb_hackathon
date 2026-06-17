// Single source of truth for how factor scores are selected and displayed.
//
// The Summary page is the source of truth for scoring. The Interior and Exterior
// capture pages show subsets of these same factors, so they import the exact same
// selection logic here to stay in sync — a factor can never show one score during
// capture and a different score on the Summary.
//
// RULE_INDEX_BY_FACTOR_ID encodes what the guided walkthrough actually detected,
// expressed as the scoring rule each detected factor lands on. Factors not listed
// here fall back to the lowest (worst) matching rule, per the framework default
// rule ("if evidence is missing or unverifiable, assign the lowest score").
export const RULE_INDEX_BY_FACTOR_ID = {
  // Interior walkthrough CV detections
  sprinkler_system: 2, // "Sprinkler detected" — present on ceiling but not certified
  fire_alarm_system: 1, // smoke/heat detectors visible — equipment present, monitoring unverified
  cooking_exposure_controls: 1, // hood suppression / extinguisher detected by the cooking line
  // Exterior walkthrough CV detection
  security_cameras: 1, // "Camera detected" — partial coverage at entrance
}

export function getFrameworkPayload(payload) {
  return payload?.framework || payload
}

export function getSelectedRule(factor) {
  const preferredRuleIndex = RULE_INDEX_BY_FACTOR_ID[factor.id]

  if (preferredRuleIndex !== undefined) {
    return factor.scoring_rules[Math.min(preferredRuleIndex, factor.scoring_rules.length - 1)]
  }

  return factor.scoring_rules.reduce((lowestRule, rule) => {
    if (!lowestRule) {
      return rule
    }

    return rule.points < lowestRule.points ? rule : lowestRule
  }, null)
}

export function getFactorScore(factor) {
  const selectedRule = getSelectedRule(factor)

  return {
    ...factor,
    points: selectedRule?.points ?? 0,
    selectedRule,
  }
}

// When allowedFactorIds is provided (capture pages), the pillar is reduced to that
// subset and the denominator becomes the sum of the subset's max points. When it is
// omitted (Summary), every factor is included and the pillar keeps its framework
// max_points so the Summary reflects the full pillar weighting.
export function getPillarSummary(pillar, allowedFactorIds = null) {
  const sourceFactors = allowedFactorIds
    ? pillar.factors.filter((factor) => allowedFactorIds.has(factor.id))
    : pillar.factors
  const factors = sourceFactors.map(getFactorScore)
  const points = factors.reduce((total, factor) => total + factor.points, 0)

  const summary = {
    ...pillar,
    factors,
    points,
  }

  if (allowedFactorIds) {
    summary.max_points = factors.reduce((total, factor) => total + factor.max_points, 0)
  }

  return summary
}

export function getScoreTone(points, maxPoints) {
  const ratio = maxPoints > 0 ? points / maxPoints : 0

  if (ratio >= 0.75) {
    return {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
    }
  }

  if (ratio >= 0.4) {
    return {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      text: 'text-amber-700',
    }
  }

  return {
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
  }
}

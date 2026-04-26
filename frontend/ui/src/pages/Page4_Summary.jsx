import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const DEFAULT_OPEN_PILLAR_ID = 'property_physical_risk'
const MOCK_RULE_INDEX_BY_FACTOR_ID = {
  sprinkler_system: 2,
  security_cameras: 1,
}

function getFrameworkPayload(payload) {
  return payload?.framework || payload
}

function getSelectedRule(factor) {
  const preferredRuleIndex = MOCK_RULE_INDEX_BY_FACTOR_ID[factor.id]

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

function getFactorScore(factor) {
  const selectedRule = getSelectedRule(factor)

  return {
    ...factor,
    points: selectedRule?.points ?? 0,
    selectedRule,
  }
}

function getPillarSummary(pillar) {
  const factors = pillar.factors.map(getFactorScore)
  const points = factors.reduce((total, factor) => total + factor.points, 0)

  return {
    ...pillar,
    factors,
    points,
  }
}

function getScoreTone(points, maxPoints) {
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

function ScoreBadge({ points, maxPoints }) {
  const tone = getScoreTone(points, maxPoints)

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tone.badge}`}>
      {points}/{maxPoints}
    </span>
  )
}

function FactorDetailModal({ factor, onClose }) {
  const [overlayHost, setOverlayHost] = useState(null)

  useEffect(() => {
    setOverlayHost(document.querySelector('.phone-screen'))
  }, [])

  if (!factor || !overlayHost) {
    return null
  }

  return createPortal(
    <div className="absolute inset-x-0 bottom-0 top-14 z-50 flex items-end justify-center bg-slate-950/45 px-3 pb-3 pt-6">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Scoring detail</p>
              <h3 className="mt-1 text-base font-bold text-slate-900">{factor.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2 py-1 text-lg font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close score details"
            >
              ×
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <ScoreBadge points={factor.points} maxPoints={factor.max_points} />
          </div>
        </div>

        <div className="max-h-[min(70vh,30rem)] space-y-4 overflow-y-auto px-4 py-4">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Why this matters</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{factor.why_this_matters}</p>
          </section>

          <section>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Current score</p>
                <span className="text-sm font-semibold text-slate-900">
                  {factor.points}/{factor.max_points}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-700">{factor.selectedRule.when}</p>
            </div>
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Possible scores</p>
            <div className="mt-2 space-y-1.5">
              {factor.scoring_rules.map((rule, index) => {
                const isCurrentRule = rule.when === factor.selectedRule.when && rule.points === factor.selectedRule.points
                const tone = getScoreTone(rule.points, factor.max_points)

                return (
                  <div
                    key={`${factor.id}-${index}`}
                    className={`rounded-xl border px-3 py-2 ${isCurrentRule ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-xs leading-5 ${isCurrentRule ? 'text-white' : 'text-slate-700'}`}>{rule.when}</p>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${isCurrentRule ? 'border-white/20 bg-white/10 text-white' : tone.badge}`}>
                        {rule.points}/{factor.max_points}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>,
    overlayHost
  )
}

export default function Page4Summary({ onBack, onSubmit }) {
  const [framework, setFramework] = useState(null)
  const [error, setError] = useState('')
  const [openPillarId, setOpenPillarId] = useState(DEFAULT_OPEN_PILLAR_ID)
  const [selectedFactor, setSelectedFactor] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function loadFramework() {
      try {
        const response = await fetch('/api/scoring-framework')

        if (!response.ok) {
          throw new Error(`Failed to load framework data: ${response.status}`)
        }

        const payload = await response.json()

        if (!isCancelled) {
          setFramework(getFrameworkPayload(payload))
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load framework data.')
        }
      }
    }

    loadFramework()

    return () => {
      isCancelled = true
    }
  }, [])

  async function handleSubmit() {
    if (isSubmitting) return

    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1500))
    onSubmit()
  }

  const pillarSummaries = framework?.pillars?.map(getPillarSummary) || []

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Readiness summary</h2>
        <p className="text-gray-500 text-sm">
          Review the four scoring pillars, expand any section, and tap an item to see why it matters and how scoring works.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!framework && !error ? (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="text-sm font-semibold text-slate-900">Loading scoring summary...</p>
          <p className="mt-2 text-sm text-slate-500">Pulling the framework and preparing the pillar breakdown.</p>
        </div>
      ) : null}

      {pillarSummaries.map((pillar) => {
        const isOpen = openPillarId === pillar.id
        const tone = getScoreTone(pillar.points, pillar.max_points)

        return (
          <section
            key={pillar.id}
            className="mb-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)]"
          >
            <button
              type="button"
              onClick={() => setOpenPillarId(isOpen ? null : pillar.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  <p className="text-base font-semibold text-slate-900 sm:text-lg">{pillar.name}</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {pillar.factors.length} scored items in this pillar
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ScoreBadge points={pillar.points} maxPoints={pillar.max_points} />
                <span className="text-xl text-slate-400">{isOpen ? '−' : '+'}</span>
              </div>
            </button>

            {isOpen ? (
              <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2 sm:px-4">
                <div className="space-y-2">
                  {pillar.factors.map((factor) => (
                    <button
                      key={factor.id}
                      type="button"
                      onClick={() => setSelectedFactor(factor)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 text-left transition-colors hover:border-slate-200 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{factor.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ScoreBadge points={factor.points} maxPoints={factor.max_points} />
                        <span className="text-sm text-slate-400">›</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        )
      })}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto sm:text-base"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-700 sm:w-auto sm:px-8 sm:text-base"
        >
          <span className="inline-flex items-center gap-2">
            {isSubmitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
                Emailing your assessment...
              </>
            ) : (
              'email me my assessment'
            )}
          </span>
        </button>
      </div>

      <FactorDetailModal factor={selectedFactor} onClose={() => setSelectedFactor(null)} />
    </div>
  )
}

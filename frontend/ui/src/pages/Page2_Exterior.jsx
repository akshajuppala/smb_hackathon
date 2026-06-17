import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const MOCK_CV_RESULTS = [
  { id: 'impact_glass', label: 'Impact-resistant glass', detected: true },
  { id: 'security_film', label: 'Security film on windows', detected: false },
  { id: 'rolling_shutters', label: 'Rolling metal shutters', detected: null },
  { id: 'led_lighting', label: 'High-intensity LED motion lighting', detected: true },
  { id: 'cctv', label: 'CCTV cameras covering entrance', detected: true },
  { id: 'entrance_clear', label: 'Entrance unobstructed and level', detected: true },
]

const EXTERIOR_FACTOR_IDS_BY_PILLAR = {
  property_physical_risk: [
    'construction_type',
    'roof_age_and_condition',
    'burglar_alarm_security',
    'fire_hydrant_distance',
    'fire_station_distance',
    'catastrophe_zone',
  ],
  mitigation_controls: [
    'security_cameras',
    'signage_and_lighting',
    'annual_property_inspection',
  ],
}

function getFrameworkPayload(payload) {
  return payload?.framework || payload
}

function getSelectedRule(factor) {
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
  const allowedFactorIds = new Set(EXTERIOR_FACTOR_IDS_BY_PILLAR[pillar.id] || [])
  const factors = pillar.factors
    .filter((factor) => allowedFactorIds.has(factor.id))
    .map(getFactorScore)
  const points = factors.reduce((total, factor) => total + factor.points, 0)
  const maxPoints = factors.reduce((total, factor) => total + factor.max_points, 0)

  return {
    ...pillar,
    factors,
    points,
    max_points: maxPoints,
  }
}

function getScoreTone(points, maxPoints) {
  const ratio = maxPoints > 0 ? points / maxPoints : 0

  if (ratio >= 0.75) {
    return {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    }
  }

  if (ratio >= 0.4) {
    return {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    }
  }

  return {
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
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
  const { t } = useLanguage()
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{t('Scoring detail')}</p>
              <h3 className="mt-1 text-base font-bold text-slate-900">{t(factor.name)}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2 py-1 text-lg font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label={t('Close score details')}
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t('Why this matters')}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{t(factor.why_this_matters)}</p>
          </section>

          <section>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t('Current score')}</p>
                <span className="text-sm font-semibold text-slate-900">
                  {factor.points}/{factor.max_points}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-700">{t(factor.selectedRule.when)}</p>
            </div>
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t('Possible scores')}</p>
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
                      <p className={`text-xs leading-5 ${isCurrentRule ? 'text-white' : 'text-slate-700'}`}>{t(rule.when)}</p>
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

export default function Page2Exterior({
  data,
  onChange,
  onNext,
  onBack,
  onRecordNow,
  pendingRecordedFile,
  onPendingRecordedFileHandled,
}) {
  const { t } = useLanguage()
  const [analyzing, setAnalyzing] = useState(false)
  const [cvResults, setCvResults] = useState(null)
  const [framework, setFramework] = useState(null)
  const [frameworkError, setFrameworkError] = useState('')
  const [openPillarId, setOpenPillarId] = useState(null)
  const [selectedFactor, setSelectedFactor] = useState(null)
  const hasExteriorAssessment = Boolean(data.exteriorVideo)

  function handleVideoFile(file) {
    onChange({ ...data, exteriorVideo: file })
    setAnalyzing(true)
    setCvResults(null)
    setTimeout(() => {
      setAnalyzing(false)
      setCvResults(MOCK_CV_RESULTS)
      const autoChecked = {}
      MOCK_CV_RESULTS.forEach((result) => {
        if (result.detected === true) autoChecked[result.id] = true
      })
      onChange({
        ...data,
        exteriorVideo: file,
        exteriorChecked: { ...(data.exteriorChecked || {}), ...autoChecked },
      })
    }, 3000)
  }

  useEffect(() => {
    if (!pendingRecordedFile) return

    handleVideoFile(pendingRecordedFile)
    onPendingRecordedFileHandled?.()
  }, [pendingRecordedFile, onPendingRecordedFileHandled])

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
          setFrameworkError(loadError instanceof Error ? loadError.message : 'Failed to load framework data.')
        }
      }
    }

    loadFramework()

    return () => {
      isCancelled = true
    }
  }, [])

  const pillarSummaries = framework?.pillars
    ?.filter((pillar) => Object.hasOwn(EXTERIOR_FACTOR_IDS_BY_PILLAR, pillar.id))
    .map(getPillarSummary)
    .filter((pillar) => pillar.factors.length > 0) || []

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('Exterior Assessment')}</h2>
        <p className="text-gray-500 text-sm">
          {t("Start a guided exterior walkthrough. We'll analyze the recording and then show the relevant scoring sections for the outside of the property.")}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800">{t('Capture your exterior walkthrough')}</p>
          <p className="mt-2 text-xs text-gray-500">
            {t('Walk around the entrance, windows, shutters, lighting, parking area, and signage.')}
          </p>
          <button
            type="button"
            onClick={onRecordNow}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            {data.exteriorVideo ? t('Restart assesment') : t('Start assesment')}
          </button>
          {data.exteriorVideo ? (
            <p className="mt-3 text-xs text-green-700">
              {t('Recorded walkthrough uploaded:')} {data.exteriorVideo.name}
            </p>
          ) : null}
        </div>

      </div>

      <div className="mb-8">
        {frameworkError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {t(frameworkError)}
          </div>
        ) : null}

        {!framework && !frameworkError ? (
          <div className="mb-4 rounded-3xl border border-slate-200 bg-white px-5 py-8 text-center">
            <p className="text-sm font-semibold text-slate-900">{t('Loading exterior scoring fields...')}</p>
            <p className="mt-2 text-sm text-slate-500">{t('Pulling the relevant pillars from the scoring framework.')}</p>
          </div>
        ) : null}

        {hasExteriorAssessment
          ? pillarSummaries.map((pillar) => {
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
                        <p className="text-base font-semibold text-slate-900 sm:text-lg">{t(pillar.name)}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {pillar.factors.length} {t('relevant scored items on this page')}
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
                              <p className="truncate text-sm font-medium text-slate-800">{t(factor.name)}</p>
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
            })
          : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={onBack}
          className="w-full rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto sm:text-base"
        >
          ← {t('Back')}
        </button>
        <button
          onClick={onNext}
          className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto sm:px-8 sm:text-base"
        >
          {t('Continue to Summary')} →
        </button>
      </div>

      <FactorDetailModal factor={selectedFactor} onClose={() => setSelectedFactor(null)} />
    </div>
  )
}

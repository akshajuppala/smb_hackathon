import { Fragment, useEffect, useState } from 'react'
import { scoringEvidenceGuidance } from '../data/scoringEvidenceGuidance'
import './scoringFramework.css'

const ALL_PILLARS = 'all'

function getInitialFilters() {
  const params = new URLSearchParams(window.location.search)
  return {
    searchTerm: params.get('search')?.trim().toLowerCase() || '',
    pillarId: params.get('pillar') || ALL_PILLARS,
    isPdfMode: params.get('pdf') === '1',
  }
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0)
}

function matchesFilters(row, searchTerm, pillarId) {
  const matchesPillar = pillarId === ALL_PILLARS || row.pillarId === pillarId
  const searchableText = JSON.stringify(row).toLowerCase()
  const matchesSearch = !searchTerm || searchableText.includes(searchTerm)

  return matchesPillar && matchesSearch
}

function buildPdfHref(searchTerm, pillarId) {
  const url = new URL('/api/scoring-framework/pdf', window.location.origin)

  if (searchTerm) {
    url.searchParams.set('search', searchTerm)
  }

  if (pillarId !== ALL_PILLARS) {
    url.searchParams.set('pillar', pillarId)
  }

  return url.toString()
}

function syncUrl(searchTerm, pillarId, isPdfMode) {
  const url = new URL(window.location.href)

  if (searchTerm) {
    url.searchParams.set('search', searchTerm)
  } else {
    url.searchParams.delete('search')
  }

  if (pillarId !== ALL_PILLARS) {
    url.searchParams.set('pillar', pillarId)
  } else {
    url.searchParams.delete('pillar')
  }

  if (isPdfMode) {
    url.searchParams.set('pdf', '1')
  } else {
    url.searchParams.delete('pdf')
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function getFactorRows(framework) {
  return framework.pillars.flatMap((pillar) =>
    pillar.factors.map((factor) => ({
      pillarId: pillar.id,
      pillarName: pillar.name,
      pillarMax: pillar.max_points,
      ...factor,
    }))
  )
}

function getBonusRows(framework) {
  return framework.pillars.flatMap((pillar) =>
    pillar.bonus_opportunities.map((bonus) => ({
      pillarId: pillar.id,
      pillarName: pillar.name,
      ...bonus,
    }))
  )
}

function EvidenceBadges({ sources }) {
  return (
    <div className="scoring-framework-evidence-list">
      {sources.map((source) => {
        const guidance =
          scoringEvidenceGuidance[source] ||
          'Gather from the named source and upload a dated, readable copy.'

        return (
          <span
            key={source}
            className="scoring-framework-evidence-badge"
            tabIndex={0}
            title={guidance}
            data-tooltip={guidance}
          >
            {source}
          </span>
        )
      })}
    </div>
  )
}

function WhyMattersBadge({ reason }) {
  if (!reason) {
    return null
  }

  return (
    <span
      className="scoring-framework-context-badge"
      tabIndex={0}
      title={reason}
      data-tooltip={reason}
      aria-label={`Why this matters: ${reason}`}
    >
      Why this matters
    </span>
  )
}

export default function PageScoringFramework({ onBack }) {
  const initialFilters = getInitialFilters()
  const [framework, setFramework] = useState(null)
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm)
  const [pillarId, setPillarId] = useState(initialFilters.pillarId)
  const [isPdfMode] = useState(initialFilters.isPdfMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    document.body.dataset.ready = 'false'
    document.body.dataset.page = 'scoring-framework'

    async function loadFramework() {
      try {
        const response = await fetch('/api/scoring-framework')

        if (!response.ok) {
          throw new Error(`Failed to load framework data: ${response.status}`)
        }

        const payload = await response.json()

        if (!isCancelled) {
          setFramework(payload.framework || payload)
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
      delete document.body.dataset.ready
      delete document.body.dataset.page
    }
  }, [])

  useEffect(() => {
    if (!framework && !error) {
      return
    }

    if (framework) {
      syncUrl(searchTerm, pillarId, isPdfMode)
    }

    document.body.dataset.ready = 'true'
  }, [framework, error, searchTerm, pillarId, isPdfMode])

  if (error) {
    return (
      <main className="scoring-framework-error">
        <section className="scoring-framework-message">
          <h1>Framework viewer failed to load</h1>
          <p>The frontend server could not load the scoring framework.</p>
          <pre>{error}</pre>
        </section>
      </main>
    )
  }

  if (!framework) {
    return (
      <main className="scoring-framework-loading">
        <section className="scoring-framework-message">
          <h1>Loading scoring framework</h1>
          <p>Fetching the insurance readiness YAML from the frontend server.</p>
        </section>
      </main>
    )
  }

  const coreTotal = sum(framework.pillars.map((pillar) => pillar.max_points))
  const factorTotal = sum(framework.pillars.map((pillar) => pillar.factors.length))
  const bonusTotal = sum(framework.pillars.map((pillar) => pillar.bonus_opportunities.length))
  const factors = getFactorRows(framework).filter((row) => matchesFilters(row, searchTerm, pillarId))
  const bonuses = getBonusRows(framework).filter((row) => matchesFilters(row, searchTerm, pillarId))
  const pdfHref = buildPdfHref(searchTerm, pillarId)

  return (
    <main className={`scoring-framework-page ${isPdfMode ? 'scoring-framework-page-pdf' : ''}`}>
      <div className="scoring-framework-shell">
        <header className="scoring-framework-topbar">
          <div>
            <p className="scoring-framework-kicker">YAML Source of Truth</p>
            <h1 className="scoring-framework-title">Insurance Readiness Framework</h1>
            <p className="scoring-framework-subtitle">
              Review the scoring logic, evidence requirements, grade bands, and bonus paths
              from the integrated frontend route.
            </p>
          </div>

          <div className="scoring-framework-actions">
            {onBack && !isPdfMode ? (
              <button
                type="button"
                className="scoring-framework-button scoring-framework-button-secondary"
                onClick={onBack}
              >
                Back to assessment
              </button>
            ) : null}
            {!isPdfMode ? (
              <a className="scoring-framework-button" href={pdfHref} download>
                Download PDF
              </a>
            ) : null}
            <div className="scoring-framework-summary" aria-label="Framework summary">
              <span className="scoring-framework-chip">
                <strong>{coreTotal}</strong> core
              </span>
              <span className="scoring-framework-chip">
                <strong>{framework.scoring_method.bonus_max_points}</strong> bonus
              </span>
              <span className="scoring-framework-chip">
                <strong>{factorTotal}</strong> factors
              </span>
              <span className="scoring-framework-chip">
                <strong>{bonusTotal}</strong> bonus paths
              </span>
            </div>
          </div>
        </header>

        <section className="scoring-framework-toolbar" aria-label="Framework filters">
          <label className="scoring-framework-field">
            <span className="scoring-framework-field-label">Search</span>
            <input
              className="scoring-framework-input"
              type="search"
              placeholder="roof, loss runs, MFA..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value.trim().toLowerCase())}
            />
          </label>

          <label className="scoring-framework-field">
            <span className="scoring-framework-field-label">Pillar</span>
            <select
              className="scoring-framework-select"
              value={pillarId}
              onChange={(event) => setPillarId(event.target.value)}
            >
              <option value={ALL_PILLARS}>All pillars</option>
              {framework.pillars.map((pillar) => (
                <option key={pillar.id} value={pillar.id}>
                  {pillar.name}
                </option>
              ))}
            </select>
          </label>

          <div className="scoring-framework-summary" aria-hidden="true" />
        </section>

        <section className="scoring-framework-grade-strip" aria-label="Grade bands">
          {framework.grade_bands.map((band) => (
            <article key={band.grade} className="scoring-framework-grade-card">
              <span className="scoring-framework-grade-label">{band.grade}</span>
              <span className="scoring-framework-grade-range">
                {band.min_core_score}-{band.max_core_score}
              </span>
              <p>{band.readiness}</p>
            </article>
          ))}
        </section>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Scored Factors</h2>
            <span>{factors.length} rows</span>
          </div>

          <div className="scoring-framework-table-wrap">
            <table className="scoring-framework-table">
              <thead>
                <tr>
                  <th>Pillar</th>
                  <th>Factor</th>
                  <th>Max</th>
                  <th>Score Rules</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {factors.length ? (
                  factors.map((row, index) => {
                    const previousRow = factors[index - 1]
                    const showDivider = !previousRow || previousRow.pillarId !== row.pillarId

                    return (
                      <Fragment key={row.id}>
                        {showDivider ? (
                          <tr className="scoring-framework-divider">
                            <td colSpan="5">
                              <div className="scoring-framework-divider-content">
                                <strong>{row.pillarName}</strong>
                                <span>{row.pillarMax} core points</span>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          <td>
                            <div className="scoring-framework-pillar-cell">
                              <strong>{row.pillarName}</strong>
                              <span className="scoring-framework-pillar-meta">
                                {row.pillarMax} pts
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="scoring-framework-name-cell">
                              <strong>{row.name}</strong>
                              <WhyMattersBadge reason={row.why_this_matters} />
                            </div>
                          </td>
                          <td className="scoring-framework-numeric">{row.max_points}</td>
                          <td>
                            <ol className="scoring-framework-rule-list">
                              {row.scoring_rules.map((rule, ruleIndex) => (
                                <li key={`${row.id}-${ruleIndex}`} className="scoring-framework-rule">
                                  <span className="scoring-framework-points">{rule.points}</span>
                                  <span>{rule.when}</span>
                                </li>
                              ))}
                            </ol>
                          </td>
                          <td>
                            <EvidenceBadges sources={row.data_sources} />
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })
                ) : (
                  <tr>
                    <td className="scoring-framework-empty" colSpan="5">
                      No factors match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Bonus Paths</h2>
            <span>{bonuses.length} rows</span>
          </div>

          <div className="scoring-framework-table-wrap">
            <table className="scoring-framework-table">
              <thead>
                <tr>
                  <th>Pillar</th>
                  <th>Bonus</th>
                  <th>Points</th>
                  <th>What Counts</th>
                </tr>
              </thead>
              <tbody>
                {bonuses.length ? (
                  bonuses.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.pillarName}</strong>
                      </td>
                      <td>
                        <div className="scoring-framework-name-cell">
                          <strong>{row.name}</strong>
                          <WhyMattersBadge reason={row.why_this_matters} />
                        </div>
                      </td>
                      <td className="scoring-framework-numeric">+{row.points}</td>
                      <td>{row.what_counts}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="scoring-framework-empty" colSpan="4">
                      No bonus paths match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

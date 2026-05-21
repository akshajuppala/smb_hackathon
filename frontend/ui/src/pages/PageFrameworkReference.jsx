import { Fragment, useEffect, useState } from 'react'
import './scoringFramework.css'

function getInitialViewState() {
  const params = new URLSearchParams(window.location.search)
  return {
    isPdfMode: params.get('pdf') === '1',
  }
}

function getFactorCount(framework) {
  return framework.pillars.reduce((total, pillar) => total + pillar.factors.length, 0)
}

function getBonusCount(framework) {
  return framework.pillars.reduce((total, pillar) => total + pillar.bonus_opportunities.length, 0)
}

function buildPdfHref() {
  return new URL('/api/framework/pdf', window.location.origin).toString()
}

function buildRasterPdfHref() {
  return new URL('/api/framework/pdf-raster', window.location.origin).toString()
}

export default function PageFrameworkReference({ onBack }) {
  const initialViewState = getInitialViewState()
  const [framework, setFramework] = useState(null)
  const [error, setError] = useState('')
  const [isPdfMode] = useState(initialViewState.isPdfMode)

  useEffect(() => {
    let isCancelled = false

    document.body.dataset.ready = 'false'
    document.body.dataset.page = 'framework-reference'

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

    document.body.dataset.ready = 'true'
  }, [framework, error])

  if (error) {
    return (
      <main className="scoring-framework-error">
        <section className="scoring-framework-message">
          <h1>Framework reference failed to load</h1>
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
          <h1>Loading framework reference</h1>
          <p>Preparing the scoring rubric from the framework data.</p>
        </section>
      </main>
    )
  }

  const scoringMethod = framework.scoring_method
  const factorCount = getFactorCount(framework)
  const bonusCount = getBonusCount(framework)

  return (
    <main className={`scoring-framework-page ${isPdfMode ? 'scoring-framework-page-pdf' : ''}`}>
      <div className="scoring-framework-shell scoring-framework-reference-shell">
        <header className="scoring-framework-topbar">
          <div>
            <p className="scoring-framework-kicker">Framework Reference</p>
            <h1 className="scoring-framework-title">{framework.name}</h1>
            <p className="scoring-framework-subtitle">
              Version {framework.version} - {framework.status}
            </p>
            <p className="scoring-framework-subtitle">
              Core score is out of {scoringMethod.core_max_points} points. Bonus opportunities can add up to{' '}
              {scoringMethod.bonus_max_points} points and count toward the final grade band.
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
              <>
                <a className="scoring-framework-button scoring-framework-button-secondary" href={buildPdfHref()} download>
                  Download PDF
                </a>
                <a className="scoring-framework-button" href={buildRasterPdfHref()} download>
                  Download Image PDF
                </a>
              </>
            ) : null}
          </div>
        </header>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Grade Bands</h2>
            <span>Core plus awarded bonus points</span>
          </div>

          {isPdfMode ? (
            <table className="scoring-framework-grade-table">
              <tbody>
                <tr>
                  {framework.grade_bands.map((band) => (
                    <td key={band.grade}>
                      <strong>
                        {band.grade} {band.min_core_score}-{band.max_core_score}
                      </strong>
                      <span>{band.readiness}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="scoring-framework-grade-strip">
              {framework.grade_bands.map((band) => (
                <article key={band.grade} className="scoring-framework-grade-card">
                  <span className="scoring-framework-grade-label">{band.grade}</span>
                  <span className="scoring-framework-grade-range">
                    {band.min_core_score}-{band.max_core_score}
                  </span>
                  <p>{band.readiness}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Factor Rubric</h2>
            <span>{factorCount} factors</span>
          </div>

          <div className="scoring-framework-table-wrap">
            <table className="scoring-framework-table scoring-framework-reference-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Score Options</th>
                </tr>
              </thead>
              <tbody>
                {framework.pillars.map((pillar) => (
                  <Fragment key={pillar.id}>
                    <tr className="scoring-framework-divider">
                      <td colSpan="2">
                        <div className="scoring-framework-divider-content">
                          <strong>{pillar.name}</strong>
                          <span>{pillar.max_points} core points</span>
                        </div>
                      </td>
                    </tr>
                    {pillar.factors.map((factor) => (
                      <tr key={factor.id}>
                        <td>
                          <strong>{factor.name}</strong>
                        </td>
                        <td>
                          <ol className="scoring-framework-rule-list">
                            {factor.scoring_rules.map((rule) => (
                              <li key={`${factor.id}-${rule.points}`} className="scoring-framework-rule">
                                <span className="scoring-framework-points">{rule.points}</span>
                                <span>{rule.when}</span>
                              </li>
                            ))}
                          </ol>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Bonus Paths</h2>
            <span>{bonusCount} paths</span>
          </div>

          <div className="scoring-framework-table-wrap">
            <table className="scoring-framework-table scoring-framework-reference-bonus-table">
              <thead>
                <tr>
                  <th>Pillar</th>
                  <th>Bonus</th>
                  <th>Points</th>
                  <th>What Counts</th>
                </tr>
              </thead>
              <tbody>
                {framework.pillars.flatMap((pillar) =>
                  pillar.bonus_opportunities.map((bonus) => (
                    <tr key={bonus.id}>
                      <td>
                        <strong>{pillar.name}</strong>
                      </td>
                      <td>
                        <strong>{bonus.name}</strong>
                      </td>
                      <td className="scoring-framework-numeric">
                        <span className="scoring-framework-score-pill scoring-framework-score-pill-strong">
                          +{bonus.points}
                        </span>
                      </td>
                      <td>{bonus.what_counts}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

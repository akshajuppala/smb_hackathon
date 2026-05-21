import { Fragment, useEffect, useState } from 'react'
import { scoringFrameworkRestaurantProfile } from '../data/scoringFrameworkRestaurantProfile'
import './scoringFramework.css'

function getInitialViewState() {
  const params = new URLSearchParams(window.location.search)
  return {
    isPdfMode: params.get('pdf') === '1',
  }
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0)
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

function findGradeBand(gradeBands, score) {
  return (
    gradeBands.find((band) => score >= band.min_core_score && score <= band.max_core_score) ||
    gradeBands[gradeBands.length - 1]
  )
}

function getScoreClass(score, max) {
  if (score === max) return 'scoring-framework-score-pill-strong'
  if (score === 0) return 'scoring-framework-score-pill-weak'
  return 'scoring-framework-score-pill-mid'
}

function buildPdfHref() {
  return new URL('/api/scoring-framework/pdf', window.location.origin).toString()
}

function buildRasterPdfHref() {
  return new URL('/api/scoring-framework/pdf-raster', window.location.origin).toString()
}

export default function PageScoringFramework({ onBack }) {
  const initialViewState = getInitialViewState()
  const [framework, setFramework] = useState(null)
  const [error, setError] = useState('')
  const [isPdfMode] = useState(initialViewState.isPdfMode)

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

    document.body.dataset.ready = 'true'
  }, [framework, error])

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
          <p>Preparing the restaurant submission from the framework data.</p>
        </section>
      </main>
    )
  }

  const factors = getFactorRows(framework).map((row) => {
    const profile = scoringFrameworkRestaurantProfile.factors[row.id]
    const matchedRule = row.scoring_rules.find((rule) => rule.points === profile.score)

    return {
      ...row,
      score: profile.score,
      evidence: profile.evidence,
      note: profile.note,
      matchedRule: matchedRule?.when || '',
      pointsMissed: row.max_points - profile.score,
    }
  })

  const bonuses = getBonusRows(framework).map((row) => {
    const profile = scoringFrameworkRestaurantProfile.bonuses[row.id]

    return {
      ...row,
      awarded: profile.awarded,
      note: profile.note,
      awardedPoints: profile.awarded ? row.points : 0,
    }
  })

  const coreScore = sum(factors.map((row) => row.score))
  const bonusScore = sum(bonuses.map((row) => row.awardedPoints))
  const totalScore = coreScore + bonusScore
  const gradeBand = findGradeBand(framework.grade_bands, totalScore)
  const pillarScores = framework.pillars.map((pillar) => {
    const pillarFactors = factors.filter((row) => row.pillarId === pillar.id)
    return {
      ...pillar,
      score: sum(pillarFactors.map((row) => row.score)),
    }
  })

  return (
    <main className={`scoring-framework-page ${isPdfMode ? 'scoring-framework-page-pdf' : ''}`}>
      <div className="scoring-framework-shell">
        <header className="scoring-framework-topbar">
          <div>
            <p className="scoring-framework-kicker">Restaurant Submission</p>
            <h1 className="scoring-framework-title">{scoringFrameworkRestaurantProfile.businessName}</h1>
            <p className="scoring-framework-subtitle">
              {scoringFrameworkRestaurantProfile.profile}
            </p>
            <p className="scoring-framework-subtitle">{scoringFrameworkRestaurantProfile.underwritingSummary}</p>
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

        <section className="scoring-framework-example-summary">
          <article className="scoring-framework-example-card scoring-framework-example-card-accent">
            <p className="scoring-framework-example-label">Business</p>
            <h2>{scoringFrameworkRestaurantProfile.businessName}</h2>
            <p>{scoringFrameworkRestaurantProfile.profile}</p>
          </article>

          <article className="scoring-framework-example-card">
            <p className="scoring-framework-example-label">Final Score</p>
            <div className="scoring-framework-example-grade-row">
              <span className="scoring-framework-example-grade">{gradeBand.grade}</span>
              <div>
                <strong className="scoring-framework-example-metric">{totalScore}/110</strong>
                <p>{gradeBand.readiness}</p>
              </div>
            </div>
            <div className="scoring-framework-summary">
              <span className="scoring-framework-chip">
                <strong>{coreScore}</strong> core
              </span>
              <span className="scoring-framework-chip">
                <strong>{bonusScore}</strong> bonus
              </span>
            </div>
          </article>

          <article className="scoring-framework-example-card">
            <p className="scoring-framework-example-label">Strengths</p>
            <ul className="scoring-framework-example-list">
              {scoringFrameworkRestaurantProfile.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="scoring-framework-example-card">
            <p className="scoring-framework-example-label">Main Gaps</p>
            <ul className="scoring-framework-example-list">
              {scoringFrameworkRestaurantProfile.gaps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="scoring-framework-section">
          <div className="scoring-framework-section-title">
            <h2>Pillar Scores</h2>
            <span>{pillarScores.length} pillars</span>
          </div>

          <div className="scoring-framework-example-pillars">
            {pillarScores.map((pillar) => (
              <article key={pillar.id} className="scoring-framework-example-pillar">
                <span>{pillar.name}</span>
                <strong>
                  {pillar.score}/{pillar.max_points}
                </strong>
              </article>
            ))}
          </div>
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
                  <th>Score</th>
                  <th>Matched Rule</th>
                  <th>Evidence</th>
                  <th>Underwriting Notes</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((row, index) => {
                  const previousRow = factors[index - 1]
                  const showDivider = !previousRow || previousRow.pillarId !== row.pillarId

                  return (
                    <Fragment key={row.id}>
                      {showDivider ? (
                        <tr className="scoring-framework-divider">
                          <td colSpan="6">
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
                          </div>
                        </td>
                        <td className="scoring-framework-numeric">
                          <span className={`scoring-framework-score-pill ${getScoreClass(row.score, row.max_points)}`}>
                            {row.score}/{row.max_points}
                          </span>
                        </td>
                        <td>{row.matchedRule}</td>
                        <td>{row.evidence}</td>
                        <td>{row.note}</td>
                      </tr>
                    </Fragment>
                  )
                })}
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
                  <th>Outcome</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {bonuses.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.pillarName}</strong>
                    </td>
                    <td>
                      <strong>{row.name}</strong>
                    </td>
                    <td className="scoring-framework-numeric">
                      <span
                        className={`scoring-framework-score-pill ${
                          row.awarded
                            ? 'scoring-framework-score-pill-strong'
                            : 'scoring-framework-score-pill-weak'
                        }`}
                      >
                        {row.awarded ? `+${row.points}` : '+0'}
                      </span>
                    </td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

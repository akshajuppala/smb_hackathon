import { useState } from 'react'

const ASSESSMENTS = [
  {
    key: 'business',
    title: 'Business info',
    description: 'Capture the business details an underwriter needs before the site walkthrough.',
    whyThis:
      'Your insurer uses this to understand what your business does, how it operates, and what kind of coverage makes sense. It helps them price the policy correctly and avoid coming back later with basic follow-up questions.',
  },
  {
    key: 'interior',
    title: 'Interior',
    description: 'Record fire safety, kitchen systems, and the overall condition of the space.',
    whyThis:
      'Your insurer needs a clear picture of the inside so they can check fire protection, equipment, and the overall condition of the space. This is one of the main ways they estimate property and fire risk.',
  },
  {
    key: 'exterior',
    title: 'Exterior',
    description: 'Document the storefront, access points, lighting, and neighborhood conditions.',
    whyThis:
      'Your insurer wants to see how the outside of the business looks to spot things like access, visibility, lighting, and general upkeep. This helps them judge safety, liability risk, and how easy the property is to protect.',
  },
]

export default function PageStartAssessments({ completion, onStartAssessment }) {
  const [activeAssessment, setActiveAssessment] = useState(null)

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-amber-50 via-white to-teal-50 px-5 pt-6 pb-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 shadow-sm">
            <span className="text-sm">📋</span>
            Assessments
          </div>
          <p className="mt-5 max-w-md text-sm text-gray-600">
            Finish the business info, interior, and exterior assessments so the insurer has a full underwriting package. We will guide you step by step.
          </p>
        </div>

        <div className="space-y-3 px-5 pt-3 pb-5 sm:px-6 sm:pt-4 sm:pb-6">
          {ASSESSMENTS.map((assessment) => {
            const isCompleted = Boolean(completion[assessment.key])

            return (
              <div
                key={assessment.key}
                className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">{assessment.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{assessment.description}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveAssessment(assessment)}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    What is this?
                  </button>

                  {isCompleted ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStartAssessment(assessment.key)}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                    >
                      Start assessment
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {activeAssessment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-help-title"
            className="w-full max-w-sm rounded-[28px] border border-gray-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Why this matters</p>
                <h3 id="assessment-help-title" className="mt-2 text-xl font-semibold text-gray-900">
                  {activeAssessment.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAssessment(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">{activeAssessment.whyThis}</p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveAssessment(null)}
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

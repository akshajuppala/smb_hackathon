const ASSESSMENTS = [
  {
    key: 'business',
    title: 'Business info',
    description: 'Capture the business details an underwriter needs before the site walkthrough.',
  },
  {
    key: 'exterior',
    title: 'Exterior',
    description: 'Document the storefront, access points, lighting, and neighborhood conditions.',
  },
  {
    key: 'interior',
    title: 'Interior',
    description: 'Record fire safety, kitchen systems, and the overall condition of the space.',
  },
]

export default function PageStartAssessments({ completion, onStartAssessment }) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-amber-50 via-white to-teal-50 px-5 py-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 shadow-sm">
            <span className="text-sm">📋</span>
            Assessments
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Complete your assessments</h2>
          <p className="mt-2 max-w-md text-sm text-gray-600">
            Finish the business info, exterior, and interior assessments so the insurer has a full underwriting package.
          </p>
        </div>

        <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
          {ASSESSMENTS.map((assessment) => {
            const isCompleted = Boolean(completion[assessment.key])

            return (
              <div
                key={assessment.key}
                className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">{assessment.title}</p>
                  <p className="mt-1 max-w-md text-sm text-gray-600">{assessment.description}</p>
                </div>

                {isCompleted ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    Completed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onStartAssessment(assessment.key)}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                  >
                    Start assessment
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

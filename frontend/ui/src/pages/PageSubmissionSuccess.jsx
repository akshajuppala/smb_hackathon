export default function PageSubmissionSuccess({ data }) {
  const fireSafetyChecked = Object.values(data.fireSafetyChecked || {}).filter(Boolean).length
  const buildingChecked = Object.values(data.buildingChecked || {}).filter(Boolean).length
  const exteriorChecked = Object.values(data.exteriorChecked || {}).filter(Boolean).length
  const locationChecked = Object.values(data.locationChecked || {}).filter(Boolean).length
  const totalChecked = fireSafetyChecked + buildingChecked + exteriorChecked + locationChecked
  const totalItems = 10 + 10 + 7 + 6
  const score = Math.round((totalChecked / totalItems) * 100)

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment submitted!</h2>
      <p className="text-gray-500 mb-8 text-sm max-w-md mx-auto">
        Your insurance assessment for <strong>{data.businessName}</strong> has been submitted. An underwriter will review your information within 2 business days.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm mx-auto mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Readiness score</p>
        <div className="flex items-end justify-center gap-1 mb-2">
          <span className="text-5xl font-bold text-gray-900">{score}</span>
          <span className="text-2xl font-semibold text-gray-400 mb-1">/100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-orange-400' : 'bg-red-400'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {totalChecked} of {totalItems} checklist items confirmed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
        {[
          { label: 'Fire safety', checked: fireSafetyChecked, total: 10 },
          { label: 'Building & structure', checked: buildingChecked, total: 10 },
          { label: 'Exterior security', checked: exteriorChecked, total: 7 },
          { label: 'Location & neighborhood', checked: locationChecked, total: 6 },
        ].map(({ label, checked, total }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-semibold text-gray-800">{checked}<span className="text-gray-400 font-normal">/{total}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}

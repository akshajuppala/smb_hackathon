import ChecklistSection from '../components/ChecklistSection'
import {
  fireSafetyChecklist,
  buildingChecklist,
  exteriorSecurityChecklist,
  locationChecklist,
} from '../data/checklistData'

export default function Page4Summary({ data, onChange, onBack, onSubmit }) {
  function toggle(field, id) {
    onChange({
      ...data,
      [field]: { ...(data[field] || {}), [id]: !data[field]?.[id] },
    })
  }

  const fireChecked = data.fireSafetyChecked || {}
  const buildingChecked = data.buildingChecked || {}
  const exteriorChecked = data.exteriorChecked || {}
  const locationChecked = data.locationChecked || {}

  const totalChecked =
    Object.values(fireChecked).filter(Boolean).length +
    Object.values(buildingChecked).filter(Boolean).length +
    Object.values(exteriorChecked).filter(Boolean).length +
    Object.values(locationChecked).filter(Boolean).length
  const totalItems =
    fireSafetyChecklist.length +
    buildingChecklist.length +
    exteriorSecurityChecklist.length +
    locationChecklist.length

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Review your full checklist</h2>
        <p className="text-gray-500 text-sm">
          Confirm every item below before submitting. You can still edit anything earlier in the flow.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items confirmed</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">
            {totalChecked}
            <span className="text-gray-400 text-lg font-normal">/{totalItems}</span>
          </p>
        </div>
        <div className="flex-1 sm:max-w-xs sm:ml-6">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${(totalChecked / totalItems) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <ChecklistSection
        icon="🔥"
        title="Fire safety"
        impact="critical"
        items={fireSafetyChecklist}
        checked={fireChecked}
        onToggle={(id) => toggle('fireSafetyChecked', id)}
      />

      <ChecklistSection
        icon="🏠"
        title="Building & structure"
        impact="high"
        items={buildingChecklist}
        checked={buildingChecked}
        onToggle={(id) => toggle('buildingChecked', id)}
      />

      <ChecklistSection
        icon="🔒"
        title="Exterior security"
        impact="high"
        items={exteriorSecurityChecklist}
        checked={exteriorChecked}
        onToggle={(id) => toggle('exteriorChecked', id)}
      />

      <ChecklistSection
        icon="📍"
        title="Location & neighborhood"
        impact="evaluated"
        items={locationChecklist}
        checked={locationChecked}
        onToggle={(id) => toggle('locationChecked', id)}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 text-white text-sm sm:text-base rounded-xl font-semibold hover:bg-gray-700 transition-colors"
        >
          Submit Assessment ✓
        </button>
      </div>
    </div>
  )
}

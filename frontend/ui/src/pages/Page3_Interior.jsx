import { useEffect, useState } from 'react'
import ChecklistSection from '../components/ChecklistSection'
import PDFUpload from '../components/PDFUpload'
import { buildingChecklist, fireSafetyChecklist } from '../data/checklistData'

const MOCK_CV_INTERIOR = [
  { id: 'sprinkler_system', label: 'Sprinkler heads visible on ceiling', detected: true },
  { id: 'fire_suppression', label: 'Hood suppression system above cooking equipment', detected: true },
  { id: 'extinguishers', label: 'Fire extinguisher tags visible', detected: null },
  { id: 'smoke_detectors', label: 'Smoke/heat detectors on ceiling', detected: true },
  { id: 'fire_exits', label: 'Exit signs clearly visible', detected: true },
  { id: 'structural_damage', label: 'No visible water stains, mold, or damage', detected: true },
]

export default function Page3Interior({
  data,
  onChange,
  onBack,
  onNext,
  onRecordNow,
  pendingRecordedFile,
  onPendingRecordedFileHandled,
}) {
  const [analyzing, setAnalyzing] = useState(false)
  const [cvResults, setCvResults] = useState(null)
  const hasInteriorAssessment = Boolean(data.interiorVideo)

  function handleVideoFile(file) {
    onChange({ ...data, interiorVideo: file })
    setAnalyzing(true)
    setCvResults(null)
    setTimeout(() => {
      setAnalyzing(false)
      setCvResults(MOCK_CV_INTERIOR)
      const autoChecked = {}
      MOCK_CV_INTERIOR.forEach((result) => {
        if (result.detected === true) autoChecked[result.id] = true
      })
      onChange({
        ...data,
        interiorVideo: file,
        fireSafetyChecked: { ...(data.fireSafetyChecked || {}), ...autoChecked },
        buildingChecked: { ...(data.buildingChecked || {}), ...autoChecked },
      })
    }, 3500)
  }

  useEffect(() => {
    if (!pendingRecordedFile) return

    handleVideoFile(pendingRecordedFile)
    onPendingRecordedFileHandled?.()
  }, [pendingRecordedFile, onPendingRecordedFileHandled])

  function toggleFire(id) {
    onChange({ ...data, fireSafetyChecked: { ...(data.fireSafetyChecked || {}), [id]: !data.fireSafetyChecked?.[id] } })
  }

  function toggleBuilding(id) {
    onChange({ ...data, buildingChecked: { ...(data.buildingChecked || {}), [id]: !data.buildingChecked?.[id] } })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Interior Assessment</h2>
        <p className="text-gray-500 text-sm">
          Start a guided interior walkthrough. We’ll review the recording for fire safety and building condition signals before you complete the rest of the form.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800">Capture your interior walkthrough</p>
          <p className="mt-2 text-xs text-gray-500">
            Start at the ceiling, then record the kitchen line, extinguishers, electrical panel, exits, and utility spaces.
          </p>
          <button
            type="button"
            onClick={onRecordNow}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            {data.interiorVideo ? 'Restart assesment' : 'Start assesment'}
          </button>
          {data.interiorVideo && !analyzing && (
            <p className="mt-3 text-xs text-green-700">
              Recorded walkthrough attached: {data.interiorVideo.name}
            </p>
          )}
        </div>

        {analyzing && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <svg className="h-4 w-4 animate-spin flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing video with computer vision model...
          </div>
        )}

        {cvResults && !analyzing && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-green-500">✓</span>
              <span className="text-sm font-semibold text-gray-800">CV Analysis Complete</span>
            </div>
            <div className="divide-y divide-gray-100">
              {cvResults.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="min-w-0 text-sm text-gray-700">{item.label}</span>
                  <span className={`flex-shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
                    item.detected === true
                      ? 'bg-green-100 text-green-700'
                      : item.detected === false
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.detected === true ? 'Detected' : item.detected === false ? 'Not found' : 'Unclear'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasInteriorAssessment && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💧</span>
              <h3 className="font-semibold text-gray-800">Sprinkler system details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date of last sprinkler inspection</label>
                <input
                  type="date"
                  value={data.sprinklerLastInspection || ''}
                  onChange={(event) => onChange({ ...data, sprinklerLastInspection: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Inspection company name</label>
                <input
                  type="text"
                  placeholder="e.g. Bay Area Fire Protection"
                  value={data.sprinklerCompany || ''}
                  onChange={(event) => onChange({ ...data, sprinklerCompany: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
            <PDFUpload
              label="Upload sprinkler inspection certificate (PDF)"
              multiple
              onFiles={(files) => onChange({ ...data, sprinklerPDFs: files })}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🍳</span>
              <h3 className="font-semibold text-gray-800">Kitchen & fire suppression</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hood suppression last inspected</label>
                <input
                  type="date"
                  value={data.hoodLastInspection || ''}
                  onChange={(event) => onChange({ ...data, hoodLastInspection: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Grease duct last professionally cleaned</label>
                <input
                  type="date"
                  value={data.ductLastCleaned || ''}
                  onChange={(event) => onChange({ ...data, ductLastCleaned: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
            <PDFUpload
              label="Upload hood suppression certificate and duct cleaning logs (PDF)"
              multiple
              onFiles={(files) => onChange({ ...data, kitchenPDFs: files })}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              <h3 className="font-semibold text-gray-800">Electrical, plumbing & HVAC</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Electrical last upgraded</label>
                <input
                  type="number"
                  placeholder="Year (e.g. 2010)"
                  value={data.electricalUpgradeYear || ''}
                  onChange={(event) => onChange({ ...data, electricalUpgradeYear: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plumbing last inspected</label>
                <input
                  type="date"
                  value={data.plumbingLastInspection || ''}
                  onChange={(event) => onChange({ ...data, plumbingLastInspection: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">HVAC last serviced</label>
                <input
                  type="date"
                  value={data.hvacLastService || ''}
                  onChange={(event) => onChange({ ...data, hvacLastService: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Panel / wiring type</label>
              <select
                value={data.wiringType || ''}
                onChange={(event) => onChange({ ...data, wiringType: event.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select wiring type...</option>
                <option value="modern_copper">Modern copper (standard)</option>
                <option value="aluminum">Aluminum wiring (higher risk)</option>
                <option value="knob_tube">Knob-and-tube (high risk)</option>
                <option value="unknown">Unknown</option>
              </select>
              {data.wiringType === 'aluminum' && (
                <p className="mt-1 text-xs text-orange-600">⚠️ Aluminum wiring significantly increases fire risk and insurance premiums. Consider upgrading.</p>
              )}
              {data.wiringType === 'knob_tube' && (
                <p className="mt-1 text-xs text-red-600">🚨 Knob-and-tube wiring is a major underwriting concern. Most insurers require immediate remediation.</p>
              )}
            </div>
            <PDFUpload
              label="Upload electrical, plumbing, or HVAC inspection reports (PDF)"
              multiple
              onFiles={(files) => onChange({ ...data, systemPDFs: files })}
            />
          </div>

          <ChecklistSection
            icon="🔥"
            title="Fire safety"
            impact="critical"
            items={fireSafetyChecklist}
            checked={data.fireSafetyChecked || {}}
            onToggle={toggleFire}
          >
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional fire safety notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Fire extinguishers serviced by XYZ Co., last tagged Jan 2025. Ansul system inspected semi-annually."
                value={data.fireSafetyNotes || ''}
                onChange={(event) => onChange({ ...data, fireSafetyNotes: event.target.value })}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <PDFUpload
                label="Upload any fire safety certificates (PDF)"
                multiple
                onFiles={(files) => onChange({ ...data, fireSafetyPDFs: files })}
              />
            </div>
          </ChecklistSection>

          <ChecklistSection
            icon="🏠"
            title="Building & structure"
            impact="high"
            items={buildingChecklist}
            checked={data.buildingChecked || {}}
            onToggle={toggleBuilding}
          >
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional building notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Roof replaced in 2018 with TPO membrane. No mold or water intrusion. Lease expires 2027."
                value={data.buildingNotes || ''}
                onChange={(event) => onChange({ ...data, buildingNotes: event.target.value })}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <PDFUpload
                label="Upload building inspection or compliance documents (PDF)"
                multiple
                onFiles={(files) => onChange({ ...data, buildingPDFs: files })}
              />
            </div>
          </ChecklistSection>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={onBack}
              className="w-full rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto sm:text-base"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto sm:px-8 sm:text-base"
            >
              Continue to Summary →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

import { useState } from 'react'
import VideoUpload from '../components/VideoUpload'
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

export default function Page3Interior({ data, onChange, onBack, onSubmit }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [cvResults, setCvResults] = useState(null)

  function handleVideoFile(file) {
    onChange({ ...data, interiorVideo: file })
    setAnalyzing(true)
    setCvResults(null)
    setTimeout(() => {
      setAnalyzing(false)
      setCvResults(MOCK_CV_INTERIOR)
      const autoChecked = {}
      MOCK_CV_INTERIOR.forEach((r) => {
        if (r.detected === true) autoChecked[r.id] = true
      })
      onChange({
        ...data,
        interiorVideo: file,
        fireSafetyChecked: { ...(data.fireSafetyChecked || {}), ...autoChecked },
        buildingChecked: { ...(data.buildingChecked || {}), ...autoChecked },
      })
    }, 3500)
  }

  function toggleFire(id) {
    onChange({ ...data, fireSafetyChecked: { ...(data.fireSafetyChecked || {}), [id]: !data.fireSafetyChecked?.[id] } })
  }

  function toggleBuilding(id) {
    onChange({ ...data, buildingChecked: { ...(data.buildingChecked || {}), [id]: !data.buildingChecked?.[id] } })
  }

  const canSubmit = !!data.interiorVideo

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Interior Assessment</h2>
        <p className="text-gray-500 text-sm">
          Upload an interior video walkthrough. Start with the ceiling/roof, then kitchen, dining area, exits, and utility areas. We'll detect sprinklers, extinguishers, and more.
        </p>
      </div>

      {/* Video Upload */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <VideoUpload
          label="Interior video walkthrough"
          hint="Film the ceiling (sprinklers), kitchen hood system, fire extinguishers with visible tags, electrical panel, and all exits. Aim for 3–7 minutes."
          onFile={handleVideoFile}
          analyzing={analyzing}
          analysisResult={cvResults}
        />
      </div>

      {/* Sprinkler Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
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
              onChange={(e) => onChange({ ...data, sprinklerLastInspection: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Inspection company name</label>
            <input
              type="text"
              placeholder="e.g. Bay Area Fire Protection"
              value={data.sprinklerCompany || ''}
              onChange={(e) => onChange({ ...data, sprinklerCompany: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
        <PDFUpload
          label="Upload sprinkler inspection certificate (PDF)"
          multiple
          onFiles={(files) => onChange({ ...data, sprinklerPDFs: files })}
        />
      </div>

      {/* Kitchen & Fire Suppression */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
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
              onChange={(e) => onChange({ ...data, hoodLastInspection: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Grease duct last professionally cleaned</label>
            <input
              type="date"
              value={data.ductLastCleaned || ''}
              onChange={(e) => onChange({ ...data, ductLastCleaned: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
        <PDFUpload
          label="Upload hood suppression certificate and duct cleaning logs (PDF)"
          multiple
          onFiles={(files) => onChange({ ...data, kitchenPDFs: files })}
        />
      </div>

      {/* Electrical, Plumbing, HVAC */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
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
              onChange={(e) => onChange({ ...data, electricalUpgradeYear: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plumbing last inspected</label>
            <input
              type="date"
              value={data.plumbingLastInspection || ''}
              onChange={(e) => onChange({ ...data, plumbingLastInspection: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">HVAC last serviced</label>
            <input
              type="date"
              value={data.hvacLastService || ''}
              onChange={(e) => onChange({ ...data, hvacLastService: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Panel / wiring type</label>
          <select
            value={data.wiringType || ''}
            onChange={(e) => onChange({ ...data, wiringType: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select wiring type...</option>
            <option value="modern_copper">Modern copper (standard)</option>
            <option value="aluminum">Aluminum wiring (higher risk)</option>
            <option value="knob_tube">Knob-and-tube (high risk)</option>
            <option value="unknown">Unknown</option>
          </select>
          {data.wiringType === 'aluminum' && (
            <p className="text-xs text-orange-600 mt-1">⚠️ Aluminum wiring significantly increases fire risk and insurance premiums. Consider upgrading.</p>
          )}
          {data.wiringType === 'knob_tube' && (
            <p className="text-xs text-red-600 mt-1">🚨 Knob-and-tube wiring is a major underwriting concern. Most insurers require immediate remediation.</p>
          )}
        </div>
        <PDFUpload
          label="Upload electrical, plumbing, or HVAC inspection reports (PDF)"
          multiple
          onFiles={(files) => onChange({ ...data, systemPDFs: files })}
        />
      </div>

      {/* Fire Safety Checklist */}
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
            onChange={(e) => onChange({ ...data, fireSafetyNotes: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
          <PDFUpload
            label="Upload any fire safety certificates (PDF)"
            multiple
            onFiles={(files) => onChange({ ...data, fireSafetyPDFs: files })}
          />
        </div>
      </ChecklistSection>

      {/* Building & Structure Checklist */}
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
            onChange={(e) => onChange({ ...data, buildingNotes: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
          <PDFUpload
            label="Upload building inspection or compliance documents (PDF)"
            multiple
            onFiles={(files) => onChange({ ...data, buildingPDFs: files })}
          />
        </div>
      </ChecklistSection>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Assessment ✓
        </button>
      </div>
    </div>
  )
}

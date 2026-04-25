import { useEffect, useState } from 'react'
import VideoUpload from '../components/VideoUpload'
import ChecklistSection from '../components/ChecklistSection'
import { exteriorSecurityChecklist, locationChecklist } from '../data/checklistData'

const MOCK_CV_RESULTS = [
  { id: 'impact_glass', label: 'Impact-resistant glass', detected: true },
  { id: 'security_film', label: 'Security film on windows', detected: false },
  { id: 'rolling_shutters', label: 'Rolling metal shutters', detected: null },
  { id: 'led_lighting', label: 'High-intensity LED motion lighting', detected: true },
  { id: 'cctv', label: 'CCTV cameras covering entrance', detected: true },
  { id: 'entrance_clear', label: 'Entrance unobstructed and level', detected: true },
]

export default function Page2Exterior({
  data,
  onChange,
  onNext,
  onBack,
  onRecordNow,
  pendingRecordedFile,
  onPendingRecordedFileHandled,
}) {
  const [analyzing, setAnalyzing] = useState(false)
  const [cvResults, setCvResults] = useState(null)

  function handleVideoFile(file) {
    onChange({ ...data, exteriorVideo: file })
    setAnalyzing(true)
    setCvResults(null)
    setTimeout(() => {
      setAnalyzing(false)
      setCvResults(MOCK_CV_RESULTS)
      // Pre-fill detected checklist items
      const autoChecked = {}
      MOCK_CV_RESULTS.forEach((r) => {
        if (r.detected === true) autoChecked[r.id] = true
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

  function toggleCheck(id) {
    onChange({
      ...data,
      exteriorChecked: {
        ...(data.exteriorChecked || {}),
        [id]: !data.exteriorChecked?.[id],
      },
    })
  }

  function toggleLocationCheck(id) {
    onChange({
      ...data,
      locationChecked: {
        ...(data.locationChecked || {}),
        [id]: !data.locationChecked?.[id],
      },
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Exterior Assessment</h2>
        <p className="text-gray-500 text-sm">
          Upload a walkthrough video of your restaurant exterior. Our computer vision model will automatically detect security features and flag gaps.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <VideoUpload
          label="Exterior video walkthrough"
          hint="Walk around your building: entrance, windows, shutters, lighting, parking area, and signage. Aim for 2–5 minutes."
          onFile={handleVideoFile}
          onRecordNow={onRecordNow}
          analyzing={analyzing}
          analysisResult={cvResults}
        />

        {cvResults && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
            <span>✨</span>
            Items detected automatically have been pre-checked below. Review and correct as needed.
          </div>
        )}
      </div>

      {/* Exterior Security Checklist */}
      <ChecklistSection
        icon="🔒"
        title="Exterior security"
        impact="high"
        items={exteriorSecurityChecklist}
        checked={data.exteriorChecked || {}}
        onToggle={toggleCheck}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Additional security details not visible in the video
          </label>
          <textarea
            rows={3}
            placeholder="e.g. We have a monitored alarm system (ADT), bollards at the entrance, reinforced door frames, keypad entry after hours..."
            value={data.exteriorNotes || ''}
            onChange={(e) => onChange({ ...data, exteriorNotes: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>
      </ChecklistSection>

      {/* Location & Neighborhood Checklist */}
      <ChecklistSection
        icon="📍"
        title="Location & neighborhood"
        impact="evaluated"
        items={locationChecklist}
        checked={data.locationChecked || {}}
        onToggle={toggleLocationCheck}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Additional location notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. We are 0.3 miles from Station 12. We verified FEMA flood map Zone X. ISO Crime Score: 4."
            value={data.locationNotes || ''}
            onChange={(e) => onChange({ ...data, locationNotes: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>
      </ChecklistSection>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 text-white text-sm sm:text-base rounded-xl font-semibold hover:bg-gray-700 transition-colors"
        >
          Continue to Interior →
        </button>
      </div>
    </div>
  )
}

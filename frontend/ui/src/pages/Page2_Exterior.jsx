import { useEffect, useState } from 'react'
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
          Start a guided exterior walkthrough. We’ll analyze the recording and pre-check the security features we can verify automatically.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800">Capture your exterior walkthrough</p>
          <p className="mt-2 text-xs text-gray-500">
            Walk around the entrance, windows, shutters, lighting, parking area, and signage.
          </p>
          <button
            type="button"
            onClick={onRecordNow}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            {data.exteriorVideo ? 'Restart assesment' : 'Start assesment'}
          </button>
          {data.exteriorVideo && !analyzing && (
            <p className="mt-3 text-xs text-green-700">
              Recorded walkthrough attached: {data.exteriorVideo.name}
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

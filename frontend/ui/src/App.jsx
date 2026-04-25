import { useEffect, useState } from 'react'
import ProgressStepper from './components/ProgressStepper'
import GuidedCaptureScreen from './components/GuidedCaptureScreen'
import Page1BusinessInfo from './pages/Page1_BusinessInfo'
import Page2Exterior from './pages/Page2_Exterior'
import Page3Interior from './pages/Page3_Interior'
import Page4Summary from './pages/Page4_Summary'

const HOME_ROUTE = '/'
const EXTERIOR_RECORD_ROUTE = '/exterior/record'

function getCurrentPath() {
  return window.location.pathname || HOME_ROUTE
}

function SubmissionSuccess({ data }) {
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

function computeCompletion(formData) {
  return {
    1: !!(formData.ownerName && formData.businessName && formData.address && formData.businessDescription),
    2: !!formData.exteriorVideo,
    3: !!formData.interiorVideo,
    4: false,
  }
}

export default function App() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({})
  const [pathname, setPathname] = useState(getCurrentPath)
  const [pendingExteriorRecording, setPendingExteriorRecording] = useState(null)

  useEffect(() => {
    function handlePopState() {
      setPathname(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(path) {
    if (path === pathname) return
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  function handleSubmit() {
    console.log('Assessment data:', formData)
    setSubmitted(true)
  }

  function handleFinishExteriorRecording() {
    const mockRecording = new File(
      ['demo exterior walkthrough'],
      'exterior-walkthrough-demo.mp4',
      { type: 'video/mp4' }
    )

    setPendingExteriorRecording(mockRecording)
    setStep(2)
    navigate(HOME_ROUTE)
  }

  const completion = computeCompletion(formData)
  const isExteriorRecordRoute = pathname === EXTERIOR_RECORD_ROUTE
  const pageContent = isExteriorRecordRoute ? (
    <GuidedCaptureScreen
      onBack={() => navigate(HOME_ROUTE)}
      onFinish={handleFinishExteriorRecording}
    />
  ) : submitted ? (
    <SubmissionSuccess data={formData} />
  ) : step === 1 ? (
    <Page1BusinessInfo
      data={formData}
      onChange={setFormData}
      onNext={() => setStep(2)}
    />
  ) : step === 2 ? (
    <Page2Exterior
      data={formData}
      onChange={setFormData}
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
      onRecordNow={() => {
        setStep(2)
        navigate(EXTERIOR_RECORD_ROUTE)
      }}
      pendingRecordedFile={pendingExteriorRecording}
      onPendingRecordedFileHandled={() => setPendingExteriorRecording(null)}
    />
  ) : step === 3 ? (
    <Page3Interior
      data={formData}
      onChange={setFormData}
      onNext={() => setStep(4)}
      onBack={() => setStep(2)}
    />
  ) : (
    <Page4Summary
      data={formData}
      onChange={setFormData}
      onBack={() => setStep(3)}
      onSubmit={handleSubmit}
    />
  )

  return (
    <div className="phone-demo-shell">
      <div className="phone-demo-glow phone-demo-glow-left" />
      <div className="phone-demo-glow phone-demo-glow-right" />

      <div className="phone-stage">
        <div className="phone-frame">
          <div className="phone-button phone-button-volume-up" />
          <div className="phone-button phone-button-volume-down" />
          <div className="phone-button phone-button-power" />

          <div className="phone-screen">
            <div className="phone-statusbar">
              <span className="phone-status-time">9:41</span>
              <div className="phone-island" aria-hidden="true" />
              <div className="phone-status-icons" aria-hidden="true">
                <span className="phone-signal" />
                <span className="phone-wifi" />
                <span className="phone-battery" />
              </div>
            </div>

            <div className={`phone-content ${isExteriorRecordRoute ? 'phone-content-fullscreen' : ''}`}>
              {isExteriorRecordRoute ? (
                pageContent
              ) : (
                <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/90 border border-gray-200 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 shadow-sm">
                      <span className="text-sm">🏢</span>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-600">SMB Restaurant Insurance Assessment</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Insurance Readiness Check</h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto px-2">
                      Complete this assessment to give your insurer everything they need for an accurate quote.
                    </p>
                  </div>

                  {!submitted && (
                    <ProgressStepper
                      currentStep={step}
                      completion={completion}
                      onStepClick={setStep}
                    />
                  )}

                  <div className="bg-transparent">
                    {pageContent}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

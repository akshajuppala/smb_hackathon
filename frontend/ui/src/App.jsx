import { useEffect, useRef, useState } from 'react'
import ProgressStepper from './components/ProgressStepper'
import GuidedCaptureScreen from './components/GuidedCaptureScreen'
import PageStartAssessments from './pages/PageStart_Assessments'
import Page0VoiceBusinessIntake from './pages/Page0_VoiceBusinessIntake'
import Page1BusinessInfo from './pages/Page1_BusinessInfo'
import Page2Exterior from './pages/Page2_Exterior'
import Page3Interior from './pages/Page3_Interior'
import Page4Summary from './pages/Page4_Summary'
import PageSubmissionSuccess from './pages/PageSubmissionSuccess'
import { buildVoiceBusinessPrefill } from './utils/voiceBusinessPrefill'

const HOME_ROUTE = '/'
const EXTERIOR_RECORD_ROUTE = '/exterior/record'
const SCREENS = {
  start: 'start',
  voiceIntake: 'voice-intake',
  businessInfo: 'business-info',
  exterior: 'exterior',
  interior: 'interior',
  summary: 'summary',
  success: 'success',
}

const STEP_TO_SCREEN = {
  1: SCREENS.businessInfo,
  2: SCREENS.exterior,
  3: SCREENS.interior,
  4: SCREENS.summary,
}

const SCREEN_TO_STEP = {
  [SCREENS.businessInfo]: 1,
  [SCREENS.exterior]: 2,
  [SCREENS.interior]: 3,
  [SCREENS.summary]: 4,
}

const ASSESSMENT_TO_SCREEN = {
  business: SCREENS.voiceIntake,
  exterior: SCREENS.exterior,
  interior: SCREENS.interior,
}

function getCurrentPath() {
  return window.location.pathname || HOME_ROUTE
}

function computeCompletion(formData) {
  return {
    1: !!(formData.ownerName && formData.businessName && formData.address && formData.businessDescription),
    2: !!formData.exteriorVideo,
    3: !!formData.interiorVideo,
    4: false,
    business: !!(formData.ownerName && formData.businessName && formData.address && formData.businessDescription),
    exterior: !!formData.exteriorVideo,
    interior: !!formData.interiorVideo,
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.start)
  const [formData, setFormData] = useState({})
  const [pathname, setPathname] = useState(getCurrentPath)
  const [pendingExteriorRecording, setPendingExteriorRecording] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    function handlePopState() {
      setPathname(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentScreen, pathname])

  function navigate(path) {
    if (path === pathname) return
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  function goToScreen(screen) {
    setCurrentScreen(screen)
  }

  function handleSubmit() {
    console.log('Assessment data:', formData)
    goToScreen(SCREENS.success)
  }

  function handleStartAssessment(assessmentKey) {
    goToScreen(ASSESSMENT_TO_SCREEN[assessmentKey] || SCREENS.start)
  }

  function handleVoiceIntakeContinue(transcript) {
    const prefilledData = buildVoiceBusinessPrefill(transcript)

    setFormData((currentData) => ({
      ...currentData,
      ...prefilledData,
    }))
    goToScreen(SCREENS.businessInfo)
  }

  function handleFinishExteriorRecording() {
    const mockRecording = new File(
      ['demo exterior walkthrough'],
      'exterior-walkthrough-demo.mp4',
      { type: 'video/mp4' }
    )

    setPendingExteriorRecording(mockRecording)
    goToScreen(SCREENS.exterior)
    navigate(HOME_ROUTE)
  }

  const completion = computeCompletion(formData)
  const currentStep = SCREEN_TO_STEP[currentScreen] || null
  const isExteriorRecordRoute = pathname === EXTERIOR_RECORD_ROUTE

  const screenContent = {
    [SCREENS.start]: (
      <PageStartAssessments
        completion={completion}
        onStartAssessment={handleStartAssessment}
      />
    ),
    [SCREENS.voiceIntake]: (
      <Page0VoiceBusinessIntake
        initialTranscript={formData.voiceIntakeTranscript || ''}
        onContinue={handleVoiceIntakeContinue}
      />
    ),
    [SCREENS.businessInfo]: (
      <Page1BusinessInfo
        data={formData}
        onChange={setFormData}
        onNext={() => goToScreen(SCREENS.exterior)}
      />
    ),
    [SCREENS.exterior]: (
      <Page2Exterior
        data={formData}
        onChange={setFormData}
        onNext={() => goToScreen(SCREENS.interior)}
        onBack={() => goToScreen(SCREENS.businessInfo)}
        onRecordNow={() => {
          goToScreen(SCREENS.exterior)
          navigate(EXTERIOR_RECORD_ROUTE)
        }}
        pendingRecordedFile={pendingExteriorRecording}
        onPendingRecordedFileHandled={() => setPendingExteriorRecording(null)}
      />
    ),
    [SCREENS.interior]: (
      <Page3Interior
        data={formData}
        onChange={setFormData}
        onNext={() => goToScreen(SCREENS.summary)}
        onBack={() => goToScreen(SCREENS.exterior)}
      />
    ),
    [SCREENS.summary]: (
      <Page4Summary
        data={formData}
        onChange={setFormData}
        onBack={() => goToScreen(SCREENS.interior)}
        onSubmit={handleSubmit}
      />
    ),
    [SCREENS.success]: <PageSubmissionSuccess data={formData} />,
  }

  const pageContent = isExteriorRecordRoute ? (
    <GuidedCaptureScreen
      onBack={() => navigate(HOME_ROUTE)}
      onFinish={handleFinishExteriorRecording}
    />
  ) : (
    screenContent[currentScreen]
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

            <div
              ref={contentRef}
              className={`phone-content ${isExteriorRecordRoute ? 'phone-content-fullscreen' : ''}`}
            >
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

                  {currentStep ? (
                    <ProgressStepper
                      currentStep={currentStep}
                      completion={completion}
                      onStepClick={(stepNumber) => {
                        const nextScreen = STEP_TO_SCREEN[stepNumber]
                        if (nextScreen) goToScreen(nextScreen)
                      }}
                    />
                  ) : null}

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

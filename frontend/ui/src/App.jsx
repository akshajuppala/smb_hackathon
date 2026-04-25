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
import { resolveVoiceBusinessPrefill } from './utils/voiceBusinessPrefillService'

const HOME_ROUTE = '/'
const EXTERIOR_RECORD_ROUTE = '/exterior/record'
const INTERIOR_RECORD_ROUTE = '/interior/record'
const EXTERIOR_RECORDING_ASSET = '/media/restaurant-exterior-recording.mp4'
const INTERIOR_RECORDING_ASSET = '/media/restaurant-interior-recording.mp4'
const EXTERIOR_RECORDING_FILE_NAME = 'restaurant-exterior-recording.mp4'
const INTERIOR_RECORDING_FILE_NAME = 'restaurant-interior-recording.mp4'

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
  const [pendingInteriorRecording, setPendingInteriorRecording] = useState(null)
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

  async function handleVoiceIntakeContinue(transcript) {
    const prefilledData = await resolveVoiceBusinessPrefill(transcript)

    setFormData((currentData) => ({
      ...currentData,
      ...prefilledData,
    }))
    goToScreen(SCREENS.businessInfo)
  }

  function handleFinishExteriorRecording() {
    const mockRecording = new File(
      ['demo exterior walkthrough'],
      EXTERIOR_RECORDING_FILE_NAME,
      { type: 'video/mp4' }
    )

    setPendingExteriorRecording(mockRecording)
    goToScreen(SCREENS.exterior)
    navigate(HOME_ROUTE)
  }

  function handleFinishInteriorRecording() {
    const mockRecording = new File(
      ['demo interior walkthrough'],
      INTERIOR_RECORDING_FILE_NAME,
      { type: 'video/mp4' }
    )

    setPendingInteriorRecording(mockRecording)
    goToScreen(SCREENS.interior)
    navigate(HOME_ROUTE)
  }

  const completion = computeCompletion(formData)
  const currentStep = SCREEN_TO_STEP[currentScreen] || null
  const headerStep = currentScreen === SCREENS.voiceIntake ? 1 : currentStep
  const isExteriorRecordRoute = pathname === EXTERIOR_RECORD_ROUTE
  const isInteriorRecordRoute = pathname === INTERIOR_RECORD_ROUTE
  const isRecordRoute = isExteriorRecordRoute || isInteriorRecordRoute

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
        onRecordNow={() => {
          goToScreen(SCREENS.interior)
          navigate(INTERIOR_RECORD_ROUTE)
        }}
        pendingRecordedFile={pendingInteriorRecording}
        onPendingRecordedFileHandled={() => setPendingInteriorRecording(null)}
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
      message="Start by showing the storefront, main entrance, windows, lighting, and parking area."
      onBack={() => navigate(HOME_ROUTE)}
      onFinish={handleFinishExteriorRecording}
      videoSrc={EXTERIOR_RECORDING_ASSET}
    />
  ) : isInteriorRecordRoute ? (
    <GuidedCaptureScreen
      message="Start with the ceiling and sprinklers, then capture the kitchen line, dining area, exits, and utility spaces."
      onBack={() => navigate(HOME_ROUTE)}
      onFinish={handleFinishInteriorRecording}
      videoSrc={INTERIOR_RECORDING_ASSET}
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
              className={`phone-content ${isRecordRoute ? 'phone-content-fullscreen' : ''}`}
            >
              {isRecordRoute ? (
                pageContent
              ) : (
                <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 flex items-center gap-2 text-left sm:mb-4">
                      <span className="text-sm">🏢</span>
                      <span className="brand-wordmark text-xl sm:text-2xl text-slate-700">Simply Covered</span>
                    </div>
                    {currentScreen === SCREENS.voiceIntake || currentScreen === SCREENS.businessInfo ? null : (
                      <h1 className="mt-8 max-w-xl text-center text-gray-900 sm:mt-10 mx-auto">
                        <span className="block text-[2rem] font-extrabold leading-none sm:text-[2.4rem]">Good Evening!</span>
                        <span className="mt-2 block text-lg font-semibold leading-snug text-slate-700 sm:text-[1.35rem]">
                          Ready to start your Insurance Readiness Check?
                        </span>
                      </h1>
                    )}
                  </div>

                  {headerStep ? (
                    <ProgressStepper
                      currentStep={headerStep}
                      completion={completion}
                      onStepClick={currentScreen === SCREENS.voiceIntake ? undefined : (stepNumber) => {
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

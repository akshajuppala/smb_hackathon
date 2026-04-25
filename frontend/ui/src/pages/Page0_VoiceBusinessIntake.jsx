import { useEffect, useRef, useState } from 'react'

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export default function Page0VoiceBusinessIntake({ initialTranscript = '', onContinue }) {
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef(initialTranscript)
  const [transcript, setTranscript] = useState(initialTranscript)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setIsSupported(Boolean(getSpeechRecognition()))
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
    }
  }, [])

  function handleStartListening() {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) {
      setErrorMessage('Voice capture is not supported in this browser. You can still type notes below.')
      return
    }

    recognitionRef.current?.stop?.()

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setErrorMessage('')
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let nextFinalTranscript = finalTranscriptRef.current
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0]?.transcript?.trim()
        if (!chunk) continue

        if (event.results[i].isFinal) {
          nextFinalTranscript = `${nextFinalTranscript} ${chunk}`.trim()
        } else {
          interimTranscript = `${interimTranscript} ${chunk}`.trim()
        }
      }

      finalTranscriptRef.current = nextFinalTranscript
      setTranscript(`${nextFinalTranscript} ${interimTranscript}`.trim())
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      setErrorMessage(event.error === 'not-allowed' ? 'Microphone access was blocked.' : 'Voice capture stopped unexpectedly.')
    }

    recognition.onend = () => {
      setIsListening(false)
      setTranscript((currentTranscript) => finalTranscriptRef.current || currentTranscript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  function handleStopListening() {
    recognitionRef.current?.stop?.()
  }

  function handleTranscriptChange(value) {
    finalTranscriptRef.current = value
    setTranscript(value)
  }

  function handleContinue() {
    recognitionRef.current?.stop?.()
    onContinue(transcript.trim())
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-teal-50 px-5 py-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 shadow-sm">
            <span className="text-sm">🎙️</span>
            Voice Intake
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Tell us more about your business</h2>
          <ul className="mt-3 max-w-md list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-orange-500">
            <li>What is the name of your business, and what do you do?</li>
            <li>What is the address?</li>
            <li>Who are your customers?</li>
          </ul>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex justify-center py-3">
            <button
              type="button"
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative flex h-36 w-36 items-center justify-center rounded-full border transition-all ${
                isListening
                  ? 'border-red-300 bg-red-500 shadow-[0_0_0_14px_rgba(239,68,68,0.12)]'
                  : 'border-gray-200 bg-gray-950 shadow-[0_20px_40px_rgba(17,24,39,0.18)] hover:scale-[1.02]'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start talking'}
            >
              <span className={`text-5xl ${isListening ? 'animate-pulse' : ''}`}>🎤</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {isListening ? 'Tap to stop' : 'Tap to talk'}
              </span>
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Captured notes</label>
              {errorMessage ? <span className="text-xs font-medium text-red-600">{errorMessage}</span> : null}
            </div>
            <textarea
              rows={8}
              value={transcript}
              onChange={(event) => handleTranscriptChange(event.target.value)}
              placeholder="Your transcript will appear here. You can edit it before continuing."
              className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!transcript.trim()}
          className="w-full rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Done and prefill business info
        </button>
      </div>
    </div>
  )
}

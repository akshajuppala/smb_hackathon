import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const DEEPGRAM_MODEL = 'nova-3'
const MEDIA_RECORDER_TIMESLICE_MS = 250
const SUPPORTED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm']
const DEEPGRAM_API_KEY = import.meta.env.DEEPGRAM_API_KEY ?? import.meta.env.VITE_DEEPGRAM_API_KEY ?? ''

function isVoiceCaptureSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(window.MediaRecorder && navigator.mediaDevices?.getUserMedia)
}

function appendTranscript(currentTranscript, nextTranscript) {
  return `${currentTranscript} ${nextTranscript}`.trim()
}

function combineTranscript(finalTranscript, interimTranscript) {
  return `${finalTranscript} ${interimTranscript}`.trim()
}

function getRecorderOptions() {
  if (typeof window === 'undefined') return undefined

  const supportedMimeType = SUPPORTED_MIME_TYPES.find((mimeType) => window.MediaRecorder?.isTypeSupported?.(mimeType))
  return supportedMimeType ? { mimeType: supportedMimeType } : undefined
}

export default function Page0VoiceBusinessIntake({ initialTranscript = '', onContinue }) {
  const finalTranscriptRef = useRef(initialTranscript)
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const socketRef = useRef(null)
  const sessionIdRef = useRef(0)
  const [transcript, setTranscript] = useState(initialTranscript)
  const [isListening, setIsListening] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    setIsSupported(isVoiceCaptureSupported())
  }, [])

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1
      teardownResources()
    }
  }, [])

  function teardownResources() {
    const recorder = mediaRecorderRef.current
    mediaRecorderRef.current = null

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }

    const socket = socketRef.current
    socketRef.current = null

    if (socket && socket.readyState < WebSocket.CLOSING) {
      socket.close(1000, 'voice intake stopped')
    }

    const stream = mediaStreamRef.current
    mediaStreamRef.current = null
    stream?.getTracks().forEach((track) => track.stop())
  }

  function stopListening() {
    sessionIdRef.current += 1
    teardownResources()
    setIsListening(false)
    setStatusMessage('')
    setTranscript((currentTranscript) => finalTranscriptRef.current || currentTranscript)
  }

  async function handleStartListening() {
    if (!isVoiceCaptureSupported()) {
      setErrorMessage(t('Voice capture is not supported in this browser.'))
      return
    }

    if (!DEEPGRAM_API_KEY) {
      setErrorMessage(t('Missing DEEPGRAM_API_KEY in the frontend environment.'))
      return
    }

    stopListening()

    const sessionId = sessionIdRef.current + 1
    sessionIdRef.current = sessionId

    setErrorMessage('')
    setStatusMessage(t('Requesting microphone access...'))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      if (sessionIdRef.current !== sessionId) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      mediaStreamRef.current = stream
      setStatusMessage(t('Connecting to Deepgram...'))

      const socketUrl = new URL('wss://api.deepgram.com/v1/listen')
      socketUrl.searchParams.set('model', DEEPGRAM_MODEL)
      socketUrl.searchParams.set('language', 'en-US')
      socketUrl.searchParams.set('interim_results', 'true')
      socketUrl.searchParams.set('punctuate', 'true')
      socketUrl.searchParams.set('smart_format', 'true')
      socketUrl.searchParams.set('endpointing', '300')
      const socket = new WebSocket(socketUrl, ['token', DEEPGRAM_API_KEY])
      socket.binaryType = 'arraybuffer'
      socketRef.current = socket

      socket.onopen = () => {
        if (sessionIdRef.current !== sessionId) {
          socket.close(1000, 'stale session')
          return
        }

        const recorder = new MediaRecorder(stream, getRecorderOptions())
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = async (event) => {
          if (!event.data || event.data.size === 0 || socket.readyState !== WebSocket.OPEN) {
            return
          }

          const audioBuffer = await event.data.arrayBuffer()

          if (socket.readyState === WebSocket.OPEN) {
            socket.send(audioBuffer)
          }
        }

        recorder.onerror = () => {
          setErrorMessage(t('Microphone audio capture failed.'))
          stopListening()
        }

        recorder.start(MEDIA_RECORDER_TIMESLICE_MS)
        setIsListening(true)
        setStatusMessage(t('Listening. Tap to stop.'))
      }

      socket.onmessage = (event) => {
        let payload

        try {
          payload = JSON.parse(event.data)
        } catch {
          return
        }

        if (payload.type !== 'Results') {
          return
        }

        const nextTranscript = payload.channel?.alternatives?.[0]?.transcript?.trim()

        if (!nextTranscript) {
          if (payload.is_final) {
            setTranscript(finalTranscriptRef.current)
          }
          return
        }

        if (payload.is_final) {
          finalTranscriptRef.current = appendTranscript(finalTranscriptRef.current, nextTranscript)
          setTranscript(finalTranscriptRef.current)
          return
        }

        setTranscript(combineTranscript(finalTranscriptRef.current, nextTranscript))
      }

      socket.onerror = () => {
        if (sessionIdRef.current !== sessionId) return

        setErrorMessage(t('Deepgram connection failed. Check your API key and network access.'))
        stopListening()
      }

      socket.onclose = (event) => {
        if (sessionIdRef.current !== sessionId) return

        teardownResources()
        setIsListening(false)
        setTranscript((currentTranscript) => finalTranscriptRef.current || currentTranscript)

        if (!event.wasClean) {
          setErrorMessage(t('Deepgram stopped unexpectedly.'))
        }

        setStatusMessage('')
      }
    } catch (error) {
      teardownResources()
      setIsListening(false)
      setStatusMessage('')
      setErrorMessage(
        error?.name === 'NotAllowedError' ? t('Microphone access was blocked.') : error?.message || t('Voice capture stopped unexpectedly.'),
      )
    }
  }

  function handleStopListening() {
    stopListening()
  }

  async function handleContinue() {
    if (isListening) {
      stopListening()
    }

    setIsSubmitting(true)

    try {
      await onContinue(transcript.trim())
    } catch (error) {
      setErrorMessage(error?.message || t('We could not prefill the business information.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('Tell us about your restaurant')}</h2>
        <p className="text-gray-500 text-sm">{t("We'll use this to prepare your insurance risk assessment.")}</p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-teal-50 px-5 py-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 shadow-sm">
            <span className="text-sm">🎙️</span>
            {t('Voice Intake')}
          </div>
          <ul className="mt-4 max-w-md list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-orange-500">
            <li>{t('What is the name of your business and what is the address?')}</li>
            <li>{t('Who are your customers? What food do you serve?')}</li>
            <li>{t('Do you serve alcohol?')}</li>
          </ul>
        </div>

          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex justify-center py-3 pb-8">
            <button
              type="button"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={isSubmitting}
              className={`relative flex h-36 w-36 items-center justify-center rounded-full border transition-all ${
                isListening
                  ? 'border-red-300 bg-red-500 shadow-[0_0_0_14px_rgba(239,68,68,0.12)]'
                  : 'border-gray-200 bg-gray-950 shadow-[0_20px_40px_rgba(17,24,39,0.18)] hover:scale-[1.02]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label={isListening ? t('Stop listening') : t('Start talking')}
            >
              <span className={`text-5xl ${isListening ? 'animate-pulse' : ''}`}>🎤</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {isListening ? t('Tap to stop') : t('Tap to talk')}
              </span>
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{t('Captured notes')}</label>
              {errorMessage ? (
                <span className="text-xs font-medium text-red-600">{errorMessage}</span>
              ) : statusMessage ? (
                <span className="text-xs font-medium text-gray-500">{statusMessage}</span>
              ) : null}
            </div>
            <div
              aria-live="polite"
              className="min-h-[7.5rem] w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800"
            >
              {transcript ? (
                <p className="whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-gray-400">{t('Your transcript will appear here as you talk.')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {isSubmitting ? t('Prefilling business info...') : t('Next step')}
        </button>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

export default function GuidedCaptureScreen({
  message = 'Start by showing the storefront and main entrance.',
  onBack,
  onFinish,
  videoSrc,
}) {
  const videoRef = useRef(null)
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)

  useEffect(() => {
    setHasStartedPlayback(false)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [videoSrc])

  async function handleStartPlayback() {
    if (!videoRef.current) return

    setHasStartedPlayback(true)

    try {
      await videoRef.current.play()
    } catch {
      setHasStartedPlayback(false)
    }
  }

  return (
    <div className="h-full bg-black text-white relative overflow-hidden">
      {videoSrc ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            muted
            playsInline
            preload="auto"
          />
          {!hasStartedPlayback && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <button
                type="button"
                onClick={handleStartPlayback}
                aria-label="Start video playback"
                className="pointer-events-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:scale-[1.02]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-9 w-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h7A2.5 2.5 0 0 1 16 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 15.5z" />
                  <path d="m16 10 3.8-2.2a.8.8 0 0 1 1.2.7v7a.8.8 0 0 1-1.2.7L16 14" />
                  <path d="m9.5 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#48556a_0%,#141923_44%,#05070c_100%)]" />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_32%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="px-4 pt-5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              Back
            </button>
          )}
          <div className="pt-[6.5rem]">
            <div className="bg-white rounded-[1.5rem] border border-[#eadfce] p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a6f48] mb-2">
                Prompt
              </p>
              <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                {message}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="px-4 pb-4">
          <div className="rounded-[1.4rem] border border-white/15 bg-black/35 p-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={onFinish}
              className="w-full rounded-xl bg-[#f6c35b] px-4 py-3 text-sm font-semibold text-gray-900"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

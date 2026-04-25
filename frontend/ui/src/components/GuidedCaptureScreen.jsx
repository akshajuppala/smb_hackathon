import { useState } from 'react'

const DEFAULT_PROMPTS = [
  {
    id: 'identity',
    label: 'Start outside',
    question: 'Show the storefront from a few steps back and say the business name and address out loud.',
    detail: 'This helps the insurer tie the footage to the exact location and verify street-facing exposure.',
    talkTrack: 'This is the front of our restaurant at 123 Main Street. We are filming the exterior for our insurance assessment.',
  },
  {
    id: 'entry',
    label: 'Entrance',
    question: 'Walk slowly toward the main entrance and show the front door, windows, and locks.',
    detail: 'Underwriters want to see how customers enter, what type of glass is used, and whether the entry points are secured.',
    talkTrack: 'This is our main customer entrance. The front windows and door locks are visible here.',
  },
  {
    id: 'hazards',
    label: 'Walk path',
    question: 'Pan across the sidewalk, ramp, parking area, and any areas where guests could slip or trip.',
    detail: 'Liability questions usually focus on wet surfaces, cracked pavement, loose mats, lighting gaps, and accessibility.',
    talkTrack: 'This is the path customers take from the street and parking area into the business.',
  },
  {
    id: 'security',
    label: 'Security',
    question: 'Capture cameras, motion lighting, alarm signage, shutters, or any other visible security features.',
    detail: 'These details affect theft, vandalism, and after-hours property risk.',
    talkTrack: 'These are the security features protecting the building after hours.',
  },
  {
    id: 'secondary',
    label: 'Back access',
    question: 'If possible, show side or rear entrances, dumpster areas, and delivery access points.',
    detail: 'Insurers often ask about less visible access points because claims can start away from the main storefront.',
    talkTrack: 'This is the side or rear access area used for deliveries, staff entry, or trash pickup.',
  },
]

export default function GuidedCaptureScreen({
  title = 'Exterior Recording Guide',
  subtitle = 'Walk through the exterior slowly and answer the prompts as you film.',
  prompts = DEFAULT_PROMPTS,
  onBack,
  onFinish,
}) {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const activePrompt = prompts[currentPrompt]
  const atLastPrompt = currentPrompt === prompts.length - 1

  function goToPrompt(index) {
    setCurrentPrompt(index)
  }

  function handleAdvance() {
    if (atLastPrompt) {
      onFinish?.()
      return
    }

    setCurrentPrompt((index) => index + 1)
  }

  return (
    <div className="min-h-full bg-[#161616] text-white flex flex-col">
      <div className="bg-[#f7f1e5] text-gray-900 rounded-b-[2rem] px-4 pt-5 pb-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <span className="rounded-full bg-[#eadfcf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b5e3c]">
            Live guide
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f48] mb-2">
            Question {currentPrompt + 1} of {prompts.length}
          </p>
          <h2 className="text-2xl font-bold leading-tight">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-[#eadfce] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6f48] mb-2">
            Ask the user
          </p>
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {activePrompt.question}
          </h3>
          <p className="text-sm text-gray-600 mt-3">{activePrompt.detail}</p>

          <div className="mt-4 rounded-2xl bg-[#f7f1e5] px-3.5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a6f48] mb-1.5">
              Suggested talk track
            </p>
            <p className="text-sm text-gray-700">{activePrompt.talkTrack}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {prompts.map((prompt, index) => {
            const isActive = index === currentPrompt

            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => goToPrompt(index)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-[#d8c8b3] bg-white text-gray-600'
                }`}
              >
                {index + 1}. {prompt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />

        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              Camera feed placeholder
            </div>
            <p className="text-white/40 text-sm mt-3">
              A mock exterior video feed will render here later.
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-black/55 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              type="button"
              onClick={() => setCurrentPrompt((index) => Math.max(0, index - 1))}
              disabled={currentPrompt === 0}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleAdvance}
              className="rounded-xl bg-[#f6c35b] px-4 py-3 text-sm font-semibold text-gray-900 min-w-[160px]"
            >
              {atLastPrompt ? 'Finish demo recording' : 'Next question'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {prompts.map((prompt, index) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => goToPrompt(index)}
                aria-label={`Go to question ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentPrompt ? 'w-8 bg-[#f6c35b]' : 'w-2.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GuidedCaptureScreen({
  title = 'Exterior Recording',
  subtitle = 'Live guidance will appear here while recording.',
  message = 'Start by showing the storefront and main entrance.',
  onBack,
  onFinish,
}) {
  return (
    <div className="h-full bg-black text-white relative overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/exterior-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="px-4 pt-5">
          <div className="rounded-b-[2rem] bg-[#f7f1e5]/92 text-gray-900 px-4 pt-5 pb-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur-[2px]">
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
              <h2 className="text-2xl font-bold leading-tight">{title}</h2>
              <p className="text-sm text-gray-600 mt-1.5">{subtitle}</p>
            </div>

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

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            Camera preview
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-[1.4rem] border border-white/15 bg-black/35 p-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={onFinish}
              className="w-full rounded-xl bg-[#f6c35b] px-4 py-3 text-sm font-semibold text-gray-900"
            >
              Finish demo recording
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

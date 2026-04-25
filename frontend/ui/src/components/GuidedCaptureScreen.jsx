export default function GuidedCaptureScreen({
  message = 'Start by showing the storefront and main entrance.',
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_32%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="px-4 pt-5">
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

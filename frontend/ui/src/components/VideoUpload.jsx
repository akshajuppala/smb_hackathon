import { useState, useRef } from 'react'

export default function VideoUpload({ label, hint, onFile, analysisResult, analyzing, onRecordNow }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const uploadRef = useRef()
  const captureRef = useRef()

  function handleFile(f) {
    if (!f) return
    setFile(f)
    onFile?.(f)
  }

  return (
    <div className="mb-6">
      {label && <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>}
      {hint && <p className="text-xs text-gray-500 mb-3">{hint}</p>}

      <div
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
          dragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      >
        <input
          ref={uploadRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <input
          ref={captureRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="space-y-2">
            <div className="text-3xl">🎬</div>
            <p className="text-sm font-medium text-gray-800 break-all">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <button
              type="button"
              onClick={() => uploadRef.current?.click()}
              className="text-xs text-blue-600 underline"
            >
              Replace video
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl text-gray-300">🎥</div>
            <p className="text-sm font-medium text-gray-600">Record or upload a video walkthrough</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onRecordNow) {
                    onRecordNow()
                    return
                  }

                  captureRef.current?.click()
                }}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                📹 Record now
              </button>
              <button
                type="button"
                onClick={() => uploadRef.current?.click()}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Upload from device
              </button>
            </div>
            <p className="text-xs text-gray-400">MP4, MOV, AVI up to 500MB</p>
          </div>
        )}
      </div>

      {analyzing && (
        <div className="mt-4 flex items-center gap-3 text-sm text-blue-700 bg-blue-50 rounded-lg px-4 py-3">
          <svg className="animate-spin h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Analyzing video with computer vision model...
        </div>
      )}

      {analysisResult && !analyzing && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm font-semibold text-gray-800">CV Analysis Complete</span>
          </div>
          <div className="divide-y divide-gray-100">
            {analysisResult.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="text-sm text-gray-700 min-w-0">{item.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
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
    </div>
  )
}

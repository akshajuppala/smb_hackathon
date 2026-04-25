import { useState, useRef } from 'react'

export default function PDFUpload({ label, multiple = false, onFiles }) {
  const [files, setFiles] = useState([])
  const inputRef = useRef()

  function handleFiles(newFiles) {
    const arr = Array.from(newFiles)
    const updated = multiple ? [...files, ...arr] : arr
    setFiles(updated)
    onFiles?.(updated)
  }

  function remove(i) {
    const updated = files.filter((_, idx) => idx !== i)
    setFiles(updated)
    onFiles?.(updated)
  }

  return (
    <div className="mt-3">
      {label && <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>}
      <div
        className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-400 bg-white transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <span className="text-lg">📄</span>
        <span className="text-sm text-gray-500">Upload PDF document(s)</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded px-3 py-1.5">
              <span className="text-gray-700 truncate max-w-xs">{f.name}</span>
              <button
                className="text-gray-400 hover:text-red-500 ml-2 font-bold"
                onClick={(e) => { e.stopPropagation(); remove(i) }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

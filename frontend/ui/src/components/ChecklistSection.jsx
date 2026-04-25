import RiskBadge from './RiskBadge'

const IMPACT_STYLES = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', label: 'Critical' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', label: 'High impact' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', label: 'Medium impact' },
  evaluated: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', label: 'Evaluated by insurer' },
}

export default function ChecklistSection({
  icon,
  title,
  impact = 'high',
  items,
  checked,
  onToggle,
  children,
}) {
  const style = IMPACT_STYLES[impact] ?? IMPACT_STYLES.high
  const checkedCount = items.filter(i => checked[i.id]).length

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden mb-5 sm:mb-6`}>
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-white/60">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xl sm:text-2xl flex-shrink-0">{icon}</span>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{title}</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className={`hidden sm:inline px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
            {style.label}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            {checkedCount}/{items.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100 bg-white/40">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 cursor-pointer hover:bg-white/60 transition-colors"
          >
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 accent-gray-800 cursor-pointer flex-shrink-0"
              checked={!!checked[item.id]}
              onChange={() => onToggle(item.id)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              <RiskBadge level={item.priority} />
            </div>
          </label>
        ))}

        {children && (
          <div className="px-4 sm:px-5 py-4 bg-white/60">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

const STYLES = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-orange-100 text-orange-600',
  low: 'bg-green-100 text-green-700',
  critical: 'bg-red-200 text-red-700 font-semibold',
}

const LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  critical: 'Critical',
}

export default function RiskBadge({ level }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STYLES[level] ?? STYLES.low}`}>
      {LABELS[level] ?? level}
    </span>
  )
}

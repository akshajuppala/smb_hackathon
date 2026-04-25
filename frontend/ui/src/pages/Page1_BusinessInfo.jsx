import { useState, useEffect } from 'react'
import { assessNeighborhoodRisk } from '../data/neighborhoodRiskData'

const RISK_STYLES = {
  high: { bg: 'bg-red-50 border-red-300', icon: '⚠️', title: 'High-Risk Neighborhood Detected', text: 'text-red-700' },
  medium: { bg: 'bg-orange-50 border-orange-300', icon: '⚡', title: 'Elevated-Risk Area', text: 'text-orange-700' },
  low: { bg: 'bg-green-50 border-green-300', icon: '✅', title: 'No High-Risk Flags Found', text: 'text-green-700' },
}

export default function Page1BusinessInfo({ data, onChange, onNext }) {
  const [riskResult, setRiskResult] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsResult, setReviewsResult] = useState(null)

  useEffect(() => {
    if (data.address?.length > 10) {
      const result = assessNeighborhoodRisk(data.address)
      setRiskResult(result)
    } else {
      setRiskResult(null)
    }
  }, [data.address])

  function handleChange(field, value) {
    onChange({ ...data, [field]: value })
  }

  function simulateReviewScrape() {
    if (!data.businessName) return
    setReviewsLoading(true)
    setReviewsResult(null)
    setTimeout(() => {
      setReviewsLoading(false)
      setReviewsResult({
        total: 142,
        rating: 4.1,
        slipFallMentions: 2,
        excerpts: [
          { text: '"Careful on the wet floor near the entrance — no mat during rain."', sentiment: 'negative', date: '3 months ago' },
          { text: '"Someone slipped near the bar area, staff was helpful though."', sentiment: 'negative', date: '8 months ago' },
        ],
        liability: 'medium',
      })
    }, 2200)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your restaurant</h2>
        <p className="text-gray-500 text-sm">We'll use this to prepare your insurance risk assessment.</p>
      </div>

      {data.voicePrefillApplied && (
        <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-sm font-semibold text-teal-900">Voice notes applied</p>
              <p className="mt-1 text-sm text-teal-800">
                We prefilled this form from your voice intake. Review the fields below and adjust anything before continuing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Field 1: About yourself */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">👤</span>
          <h3 className="font-semibold text-gray-800">Tell us about yourself</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full name *</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={data.ownerName || ''}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your role</label>
            <input
              type="text"
              placeholder="Owner, Manager, CFO..."
              value={data.ownerRole || ''}
              onChange={(e) => handleChange('ownerRole', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="jane@yourrestaurant.com"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone number</label>
            <input
              type="tel"
              placeholder="(415) 000-0000"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Field 2: What is your business doing */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🍽️</span>
          <h3 className="font-semibold text-gray-800">What is your business doing?</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Restaurant / business name *</label>
            <input
              type="text"
              placeholder="The Golden Fork"
              value={data.businessName || ''}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type of cuisine / concept</label>
            <input
              type="text"
              placeholder="e.g. Italian trattoria, fast casual burger, sushi bar..."
              value={data.cuisineType || ''}
              onChange={(e) => handleChange('cuisineType', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Describe your business *</label>
            <textarea
              rows={4}
              placeholder="Describe what your restaurant does, how many seats, whether you serve alcohol, do catering, have a food truck, etc."
              value={data.businessDescription || ''}
              onChange={(e) => handleChange('businessDescription', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'serveAlcohol', label: 'Serves alcohol' },
              { key: 'hasCatering', label: 'Catering' },
              { key: 'hasFoodTruck', label: 'Food truck' },
              { key: 'hasDelivery', label: 'Delivery' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-gray-800"
                  checked={!!data[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Field 3: Location */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📍</span>
          <h3 className="font-semibold text-gray-800">Where is your restaurant located?</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full street address *</label>
            <input
              type="text"
              placeholder="123 Market St, San Francisco, CA 94102"
              value={data.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {riskResult && (
            <div className={`border rounded-xl px-4 py-4 ${RISK_STYLES[riskResult.level].bg}`}>
              <div className={`flex items-start gap-2 ${RISK_STYLES[riskResult.level].text}`}>
                <span className="text-lg">{RISK_STYLES[riskResult.level].icon}</span>
                <div>
                  <p className="font-semibold text-sm">{RISK_STYLES[riskResult.level].title}</p>
                  {riskResult.neighborhood ? (
                    <p className="text-xs mt-1">
                      Address matches <strong>{riskResult.neighborhood}</strong> in {riskResult.city}, {riskResult.state} — a known high-risk area for insurance purposes. Expect higher property and liability premiums. Document all security measures carefully.
                    </p>
                  ) : (
                    <p className="text-xs mt-1">No high-risk neighborhood flags detected for this address. This does not replace a full ISO crime score lookup by your insurer.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year building was constructed</label>
              <input
                type="number"
                placeholder="e.g. 1985"
                value={data.buildingYear || ''}
                onChange={(e) => handleChange('buildingYear', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Square footage</label>
              <input
                type="number"
                placeholder="e.g. 2400"
                value={data.squareFootage || ''}
                onChange={(e) => handleChange('squareFootage', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Own or lease?</label>
              <select
                value={data.ownOrLease || ''}
                onChange={(e) => handleChange('ownOrLease', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              >
                <option value="">Select...</option>
                <option value="own">Own</option>
                <option value="lease">Lease</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Google Reviews Scraper */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">⭐</span>
          <h3 className="font-semibold text-gray-800">Google Reviews — Slip & Fall Liability Check</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">We scan your public Google Reviews for mentions of slips, falls, wet floors, or unsafe conditions that could affect your liability exposure.</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Google Maps URL or business name + city"
            value={data.googlePlaceUrl || ''}
            onChange={(e) => handleChange('googlePlaceUrl', e.target.value)}
            className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            onClick={simulateReviewScrape}
            disabled={!data.businessName || reviewsLoading}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {reviewsLoading ? 'Scanning...' : 'Scan reviews'}
          </button>
        </div>

        {reviewsLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Scraping and analyzing reviews...
          </div>
        )}

        {reviewsResult && !reviewsLoading && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Total reviews</p>
                <p className="font-bold text-gray-900 text-lg">{reviewsResult.total}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Avg. rating</p>
                <p className="font-bold text-gray-900 text-lg">⭐ {reviewsResult.rating}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${
                reviewsResult.slipFallMentions > 3 ? 'bg-red-50' : reviewsResult.slipFallMentions > 0 ? 'bg-orange-50' : 'bg-green-50'
              }`}>
                <p className="text-xs text-gray-500">Slip/fall mentions</p>
                <p className={`font-bold text-lg ${
                  reviewsResult.slipFallMentions > 3 ? 'text-red-600' : reviewsResult.slipFallMentions > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {reviewsResult.slipFallMentions}
                </p>
              </div>
            </div>

            {reviewsResult.excerpts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">Flagged review excerpts:</p>
                {reviewsResult.excerpts.map((ex, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
                    <p className="text-sm text-gray-800 italic">{ex.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{ex.date}</p>
                  </div>
                ))}
                <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                  ⚠️ <strong>Liability note:</strong> Recurring slip/fall mentions in reviews may increase general liability premiums. Consider floor matting, wet floor signage, and documenting your maintenance schedule.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 text-white text-sm sm:text-base rounded-xl font-semibold hover:bg-gray-700 transition-colors"
        >
          Continue to Exterior →
        </button>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { assessNeighborhoodRisk } from '../data/neighborhoodRiskData'
import { BUSINESS_INFO_FIELD_MAP, BUSINESS_INFO_SECTIONS } from '../data/businessInfoFields'
import { NAICS_722_LEAF_CODES, NAICS_722_LEAF_CODE_MAP } from '../data/naics722LeafCodes'

const RISK_STYLES = {
  high: { bg: 'bg-red-50 border-red-300', icon: '⚠️', title: 'High-Risk Neighborhood Detected', text: 'text-red-700' },
  medium: { bg: 'bg-orange-50 border-orange-300', icon: '⚡', title: 'Elevated-Risk Area', text: 'text-orange-700' },
  low: { bg: 'bg-green-50 border-green-300', icon: '✅', title: 'No High-Risk Flags Found', text: 'text-green-700' },
}

const NAICS_TRIGGER_FIELDS = new Set([
  'businessName',
  'businessDescription',
  'websiteUrl',
  'address',
  'cuisineType',
  'serveAlcohol',
  'hasCatering',
  'hasFoodTruck',
  'hasDelivery',
])

export default function Page1BusinessInfo({ data, onChange, onNext }) {
  const [riskResult, setRiskResult] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsResult, setReviewsResult] = useState(null)
  const [websiteLoading, setWebsiteLoading] = useState(false)
  const [websiteError, setWebsiteError] = useState('')
  const [naicsLoading, setNaicsLoading] = useState(false)
  const [naicsError, setNaicsError] = useState('')
  const [showNaicsHelp, setShowNaicsHelp] = useState(false)
  const naicsRequestIdRef = useRef(0)

  useEffect(() => {
    if (data.address?.length > 10) {
      const result = assessNeighborhoodRisk(data.address)
      setRiskResult(result)
    } else {
      setRiskResult(null)
    }
  }, [data.address])

  useEffect(() => {
    const businessName = data.businessName?.trim()
    const address = data.address?.trim()

    if (!businessName || businessName.length < 2 || !address || address.length < 10) {
      setWebsiteLoading(false)
      setWebsiteError('')
      return
    }

    const lookupQuery = `${businessName}::${address}`
    if (data.websiteLookupQuery === lookupQuery) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setWebsiteLoading(true)
      setWebsiteError('')

      try {
        const params = new URLSearchParams({
          businessName,
          address,
        })
        const response = await fetch(`/api/place-website?${params.toString()}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.details || result.error || 'Lookup failed')
        }

        onChange((currentData) => ({
          ...currentData,
          websiteUrl: result.websiteUrl || currentData.websiteUrl || '',
          googlePlaceUrl: result.googlePlaceUrl || currentData.googlePlaceUrl || '',
          websiteLookupQuery: lookupQuery,
        }))
      } catch (error) {
        setWebsiteError(error.message || 'Could not find a website yet.')
      } finally {
        setWebsiteLoading(false)
      }
    }, 800)

    return () => window.clearTimeout(timeoutId)
  }, [data.address, data.businessName])

  function buildNaicsPayload() {
    return {
      businessName: data.businessName?.trim() || '',
      businessDescription: data.businessDescription?.trim() || '',
      websiteUrl: data.websiteUrl?.trim() || '',
      address: data.address?.trim() || '',
      cuisineType: data.cuisineType?.trim() || '',
      serveAlcohol: !!data.serveAlcohol,
      hasCatering: !!data.hasCatering,
      hasFoodTruck: !!data.hasFoodTruck,
      hasDelivery: !!data.hasDelivery,
    }
  }

  async function requestNaicsSuggestion(payload, lookupKey) {
    if (!payload.businessName || !payload.businessDescription) {
      setNaicsLoading(false)
      setNaicsError('')
      return
    }

    const requestId = ++naicsRequestIdRef.current
    setNaicsLoading(true)
    setNaicsError('')

    try {
      const response = await fetch('/api/naics-classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Could not classify NAICS code')
      }

      if (requestId !== naicsRequestIdRef.current) {
        return
      }

      onChange((currentData) => ({
        ...currentData,
        suggestedNaics: result,
        suggestedNaicsLookupKey: lookupKey,
        selectedNaicsCode:
          !currentData.selectedNaicsCode || currentData.selectedNaicsCode === currentData.suggestedNaics?.code
            ? result.code
            : currentData.selectedNaicsCode,
      }))
    } catch (error) {
      if (requestId !== naicsRequestIdRef.current) {
        return
      }

      setNaicsError(error.message || 'Could not classify NAICS code')
    } finally {
      if (requestId === naicsRequestIdRef.current) {
        setNaicsLoading(false)
      }
    }
  }

  useEffect(() => {
    const payload = buildNaicsPayload()
    const lookupKey = JSON.stringify(payload)

    if (!payload.businessName || !payload.businessDescription) {
      setNaicsLoading(false)
      setNaicsError('')
      return
    }

    if (data.suggestedNaicsLookupKey === lookupKey && data.suggestedNaics) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      requestNaicsSuggestion(payload, lookupKey)
    }, 700)

    return () => window.clearTimeout(timeoutId)
  }, [
    data.address,
    data.businessDescription,
    data.businessName,
    data.cuisineType,
    data.hasCatering,
    data.hasDelivery,
    data.hasFoodTruck,
    data.serveAlcohol,
    data.websiteUrl,
  ])

  function handleChange(field, value) {
    const nextData = { ...data, [field]: value }

    if (NAICS_TRIGGER_FIELDS.has(field)) {
      delete nextData.suggestedNaics
      delete nextData.suggestedNaicsLookupKey
      setNaicsError('')
    }

    onChange(nextData)
  }

  function handleRefreshNaics() {
    const payload = buildNaicsPayload()
    requestNaicsSuggestion(payload, JSON.stringify(payload))
  }

  function handleNaicsSelectChange(value) {
    onChange({
      ...data,
      selectedNaicsCode: value,
    })
  }

  const selectedNaicsEntry = data.selectedNaicsCode ? NAICS_722_LEAF_CODE_MAP[data.selectedNaicsCode] : null
  const showingSuggestedNaics =
    !!data.suggestedNaics && !naicsError && data.selectedNaicsCode === data.suggestedNaics.code

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

  function renderInput(field) {
    const commonProps = {
      value: data[field.key] || '',
      placeholder: field.placeholder,
      className:
        'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300',
    }

    if (field.input === 'textarea') {
      return (
        <textarea
          rows={field.rows || 4}
          {...commonProps}
          onChange={(event) => handleChange(field.key, event.target.value)}
          className={`${commonProps.className} resize-none`}
        />
      )
    }

    if (field.input === 'select') {
      return (
        <select
          value={data[field.key] || ''}
          onChange={(event) => handleChange(field.key, event.target.value)}
          className={`${commonProps.className} bg-white`}
        >
          {field.options.map((option) => (
            <option key={option.value || 'empty'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.input}
        {...commonProps}
        onChange={(event) => handleChange(field.key, event.target.value)}
      />
    )
  }

  function renderStandardField(fieldKey) {
    const field = BUSINESS_INFO_FIELD_MAP[fieldKey]

    return (
      <div key={field.key}>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
        {renderInput(field)}
      </div>
    )
  }

  function renderBusinessEnhancements() {
    return (
      <>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Website</label>
          <input
            type="url"
            placeholder="https://www.yourrestaurant.com"
            value={data.websiteUrl || ''}
            onChange={(event) => handleChange('websiteUrl', event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="mt-1 min-h-5 text-xs">
            {websiteLoading ? (
              <span className="text-blue-600">Looking up website from business name and address...</span>
            ) : websiteError ? (
              <span className="text-orange-600">{websiteError}</span>
            ) : data.websiteUrl ? (
              <span className="text-green-600">Website found automatically.</span>
            ) : (
              <span className="text-gray-500">We will try to auto-fill this after you enter the business name and address.</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-950">NAICS classification</p>
              <p className="mt-1 text-xs text-blue-900/80">
                This is the business category code insurance companies use to understand what kind of restaurant or food business you run.
              </p>
            </div>
          </div>

          {naicsError && <p className="mt-3 text-xs text-red-700">{naicsError}</p>}

          <div className="mt-4">
            <div className="relative rounded-xl border border-blue-200 bg-white px-3 py-2.5">
              <select
                value={data.selectedNaicsCode || ''}
                onChange={(event) => handleNaicsSelectChange(event.target.value)}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                aria-label="Business category"
              >
                <option value="">Choose the closest match...</option>
                {NAICS_722_LEAF_CODES.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.code} - {entry.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {showingSuggestedNaics ? 'Suggested' : 'Business category'}
                  </p>
                  {selectedNaicsEntry ? (
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-bold">{selectedNaicsEntry.code}</span>{' '}
                      <span className="text-gray-700">{selectedNaicsEntry.name}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Choose the closest match...</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {showingSuggestedNaics && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                      {Math.round((data.suggestedNaics.confidence || 0) * 100)}%
                    </span>
                  )}
                  <span className="text-sm text-blue-700">▾</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNaicsHelp(true)}
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-900 transition-colors hover:bg-blue-100"
            >
              What is this?
            </button>
            <button
              type="button"
              onClick={handleRefreshNaics}
              disabled={naicsLoading}
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-900 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {naicsLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {showNaicsHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-gray-900">What is a NAICS classification?</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    NAICS is a standard business category code. It helps insurance companies understand the type of work your business does so they can review risk more accurately.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    For restaurants, this can help separate a full-service restaurant, bar, caterer, coffee shop, food truck, or similar business. We suggest a code based on the details you enter, and you can refresh it if you update your information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNaicsHelp(false)}
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close NAICS help"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNaicsHelp(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  function renderSection(section) {
    const standardFields = section.fieldKeys.map((fieldKey) => BUSINESS_INFO_FIELD_MAP[fieldKey]).filter(Boolean)
    const checkboxFields = (section.checkboxKeys || []).map((fieldKey) => BUSINESS_INFO_FIELD_MAP[fieldKey]).filter(Boolean)
    const locationTailFields = section.key === 'location' ? standardFields.slice(1) : []
    const locationAddressField = section.key === 'location' ? standardFields[0] : null

    return (
      <div key={section.key} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{section.icon}</span>
          <h3 className="font-semibold text-gray-800">{section.title}</h3>
        </div>

        {section.key === 'aboutYou' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{standardFields.map((field) => renderStandardField(field.key))}</div>}

        {section.key === 'business' && (
          <div className="space-y-4">
            {standardFields.map((field) => renderStandardField(field.key))}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {checkboxFields.map((field) => (
                <label key={field.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-gray-800"
                    checked={!!data[field.key]}
                    onChange={(event) => handleChange(field.key, event.target.checked)}
                  />
                  {field.label}
                </label>
              ))}
            </div>
            {renderBusinessEnhancements()}
          </div>
        )}

        {section.key === 'location' && (
          <div className="space-y-4">
            {locationAddressField && renderStandardField(locationAddressField.key)}

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
              {locationTailFields.map((field) => renderStandardField(field.key))}
            </div>
          </div>
        )}
      </div>
    )
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

      {BUSINESS_INFO_SECTIONS.map(renderSection)}

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
            onChange={(event) => handleChange('googlePlaceUrl', event.target.value)}
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
                {reviewsResult.excerpts.map((ex, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
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

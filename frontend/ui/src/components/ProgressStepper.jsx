import { Fragment } from 'react'

const STEPS = [
  { number: 1, label: 'Business', fullLabel: 'Business Info' },
  { number: 2, label: 'Interior', fullLabel: 'Interior' },
  { number: 3, label: 'Exterior', fullLabel: 'Exterior' },
  { number: 4, label: 'Summary', fullLabel: 'Summary' },
]

export default function ProgressStepper({ currentStep, completion = {}, onStepClick }) {
  const clickable = typeof onStepClick === 'function'

  return (
    <div className="flex items-start justify-between mb-8 sm:mb-10 px-1 max-w-md mx-auto">
      {STEPS.map((step, i) => {
        const isCurrent = currentStep === step.number
        const isComplete = !!completion[step.number]

        return (
          <Fragment key={step.number}>
            <div className="flex flex-col items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => clickable && onStepClick(step.number)}
                disabled={!clickable}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                  isComplete
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : isCurrent
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete && !isCurrent ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </button>
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight whitespace-nowrap ${
                  isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <span className="sm:hidden">{step.label}</span>
                <span className="hidden sm:inline">{step.fullLabel}</span>
              </span>
              <span
                className={`mt-0.5 text-[9px] sm:text-[10px] font-medium ${
                  isComplete ? 'text-green-600' : isCurrent ? 'text-transparent' : 'text-orange-500'
                }`}
              >
                {isComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mt-4 sm:mt-[18px] mx-1 sm:mx-2 transition-colors min-w-0 ${
                  isComplete ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

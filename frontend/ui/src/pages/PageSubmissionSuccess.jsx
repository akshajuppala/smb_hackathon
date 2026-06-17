import { useLanguage } from '../i18n/LanguageContext'

export default function PageSubmissionSuccess() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{t('Enjoy your morning, Arthur!')}</h2>
    </div>
  )
}

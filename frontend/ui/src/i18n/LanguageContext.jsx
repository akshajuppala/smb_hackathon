import { createContext, useContext, useState, useCallback } from 'react'
import { ES } from './translations'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  // Translate an English source string. The English string itself is the key;
  // when the language is Spanish we look it up in the ES dictionary and fall
  // back to the original English if no translation exists yet.
  const t = useCallback(
    (en) => {
      if (lang !== 'es') return en
      return ES[en] ?? en
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

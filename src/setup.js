import React, { useState, useContext } from 'react'

const defaults = {
  languages: ['en'],
  language: 'en'
}

export const TranslatorContext = React.createContext(defaults)

export const useTranslator = () => {
  const props = useContext(TranslatorContext)
  return props
}

export const withTranslator = WrappedComponent => {
  return xprops => {
    const props = useContext(TranslatorContext)
    return <WrappedComponent {...props} {...xprops} />
  }
}

export const Translator = ({ children, setLanguageCallback, ...props }) => {
  const [context, setContext] = useState({ ...defaults, ...props })
  const setLanguage = language => {
    setContext({ ...context, language })
    setLanguageCallback && setLanguageCallback(language)
  }
  return (
    <TranslatorContext.Provider value={{ ...context, setLanguage }}>
      {children}
    </TranslatorContext.Provider>
  )
}

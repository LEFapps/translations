import React, { useState, useContext } from 'react'

const defaults = {
  languages: ['en'],
  language: 'en'
}

export const TranslatorContext = React.createContext(defaults)

export const useTranslator = () => {
  const [props] = useContext(TranslatorContext)
  return props
}

export const Translator = ({ children, ...props }) => {
  const [context, setContext] = useState(defaults)
  const setLanguage = language => setContext({ ...context, language })
  return (
    <TranslatorContext.Provider value={{ ...context, setLanguage }}>
      {children}
    </TranslatorContext.Provider>
  )
}

import React, { useState, useContext, Component } from 'react'

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

// export const Translator = ({ children, ...props }) => {
//   // const [context, setContext] = useState({ ...defaults, ...props })
//   // const setLanguage = language => setContext({ ...context, language })
//   const context = { ...defaults, ...props }
//   const setLanguage = language => (context.language = language)
//   return (
//     <TranslatorContext.Provider value={{ ...context, setLanguage }}>
//       {children}
//     </TranslatorContext.Provider>
//   )
// }

class Translator extends Component {
  constructor (props) {
    super(props)
    this.state = defaults
  }
  render () {
    const setLanguage = language => this.setState({ language })
    const { children, ...props } = this.props
    return (
      <TranslatorContext.Provider
        value={{ ...this.state, ...props, setLanguage }}
      >
        {children}
      </TranslatorContext.Provider>
    )
  }
}

export { Translator }

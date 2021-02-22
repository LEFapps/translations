import React, { Component, useContext } from 'react'
import PropTypes from 'prop-types'

const TranslatorContext = React.createContext()

class Translator extends Component {
  constructor (props) {
    super(props)
    this.state = {
      translations: {}
    }
    this.setCurrentLanguage = this.setCurrentLanguage.bind(this)
    this.getTranslation = this.getTranslation.bind(this)
  }
  static getDerivedStateFromProps (
    { settings, getUserLanguage },
    { currentLanguage }
  ) {
    let language
    language =
      getUserLanguage && getUserLanguage() ? getUserLanguage() : currentLanguage
    if (!language || !settings.languages.includes(language)) {
      const navLang =
        typeof navigator !== 'undefined'
          ? (navigator.language || navigator.userLanguage).split('-')[0]
          : settings && settings.default
      if (settings.languages.includes(navLang)) {
        language = navLang
      } else {
        language = settings.default
      }
    }
    settings.currentLanguage = language
    return settings
  }
  setCurrentLanguage (language) {
    const { setUserLanguage } = this.props
    if (setUserLanguage) {
      setUserLanguage(language)
    }
    this.setState({ currentLanguage: language })
    Object.keys(this.state.translations).map(_id => {
      this.getTranslation(
        { _id },
        { language, skipSettings: true, forceUpdate: true }
      )
    })
  }
  getTranslation (props, params = {}) {
    const { skipSettings, forceUpdate } = params
    const { translations, currentLanguage } = this.state
    const language = params.language || currentLanguage
    const { _id } = props
    if (!translations[_id] || forceUpdate) {
      translations[_id] = true
      this.props
        .getTranslation(props, { language, skipSettings })
        .then(result => {
          translations[_id] = result
          this.setState({ translations })
        })
        .catch(error => console.error(error))
    }
  }
  render () {
    const {
      allowEditing,
      updateTranslation,
      getTranslation,
      MarkdownImageUpload
    } = this.props
    return (
      <TranslatorContext.Provider
        value={{
          translator: {
            ...this.state,
            setCurrentLanguage: this.setCurrentLanguage,
            getTranslation: this.getTranslation,
            allowEditing,
            updateTranslation,
            getFullTranslation: getTranslation,
            MarkdownImageUpload
          }
        }}
      >
        {this.props.children}
      </TranslatorContext.Provider>
    )
  }
}

Translator.propTypes = {
  settings: PropTypes.shape({
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    default: PropTypes.string.isRequired,
    titles: PropTypes.object.isRequired
  }),
  getTranslation: PropTypes.any.isRequired,
  setUserLanguage: PropTypes.func,
  getUserLanguage: PropTypes.func,
  allowEditing: PropTypes.func.isRequired,
  updateTranslation: PropTypes.func.isRequired,
  MarkdownImageUpload: PropTypes.func
}

const withTranslator = Component => {
  return function TranslatorComponent (props) {
    const translator = useContext(TranslatorContext)
    return <Component {...props} {...translator} />
  }
}

export { Translator, withTranslator }

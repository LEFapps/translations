import React from 'react'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslator } from './Translator'
import PropTypes from 'prop-types'

const PickLanguage = withTranslator(({ translator, showTitle }) => {
  if (translator.languages.lenght === 0) return null
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        {showTitle ? (
          translator.titles[translator.currentLanguage]
        ) : (
          <FontAwesomeIcon icon='flag' />
        )}
      </DropdownToggle>
      <DropdownMenu right>
        {translator.languages.map(language => {
          if (showTitle && language === translator.currentLanguage) return null
          return (
            <a
              href='#'
              className='dropdown-item'
              key={language}
              onClick={() => {
                translator.setCurrentLanguage(language)
              }}
            >
              {translator.titles && translator.titles[language]
                ? translator.titles[language]
                : language.toUpperCase()}{' '}
              {translator.currentLanguage === language ? (
                <FontAwesomeIcon icon={'check'} />
              ) : null}
            </a>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
})

PickLanguage.propTypes = {
  showTitle: PropTypes.bool
}

export default PickLanguage

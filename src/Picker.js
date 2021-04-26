import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Translate } from './Translate'
import { useTranslator } from './setup'

export const Picker = ({ showTitle, children }) => {
  const { languages = [], language, setLanguage } = useTranslator()

  if (languages.length < 2) return null

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        {showTitle ? (
          <Translate _id={`translator/${language}`}>{language}</Translate>
        ) : (
          <FontAwesomeIcon icon='flag' />
        )}
      </DropdownToggle>
      <DropdownMenu right>
        {languages.map(lang => {
          if (showTitle && lang === language) return null
          return (
            <DropdownItem
              key={lang}
              active={lang === language}
              disabled={lang === language}
              onClick={() => setLanguage(lang)}
            >
              <Translate _id={`translator/${lang}`}>{lang}</Translate>
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

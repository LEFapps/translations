import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

import { Translate } from './Translate'
import { useTranslator } from './setup'

export const Picker = ({ showTitle, children }) => {
  const { languages = [], language, setLanguage } = useTranslator()

  if (languages.length < 2) return null

  return (
    <UncontrolledDropdown id='language-picker' nav inNavbar>
      <DropdownToggle nav caret>
        {showTitle && language}
        {children}
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
              <Translate _id={`translator/${lang}`} language={lang}>
                {lang}
              </Translate>
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

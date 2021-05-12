import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Helmet } from 'react-helmet'
import stubFalse from 'lodash/stubFalse'
import isFunction from 'lodash/isFunction'

import { Editor } from './Edit'
import { useTranslator } from './setup'
import { TRANSLATION_GET } from './queries'
import { markdown } from './helpers/markdown'

export const useRawTranslation = _id => {
  const { language } = useTranslator()
  const { loading, error, data = {} } = useQuery(TRANSLATION_GET, {
    variables: { _id, language }
  })
  const { translation = '' } = data.translate || {}
  return { loading, error, ...data.translate, translation }
}

export const Translate = ({
  _id,
  md,
  tag: Tag = 'span',
  className = '',
  params = {},
  autoHide,
  children,
  language,
  ...props
}) => {
  const { language: defaultLanguage, canEdit = stubFalse } = useTranslator()
  language = language || defaultLanguage
  const { loading, error, data = {} } = useQuery(TRANSLATION_GET, {
    variables: { _id, language }
  })
  const [isEditing, setEditing] = useState()
  const toggleEditing = () => setEditing(!isEditing)

  const { translate } = data

  const editable = isFunction(canEdit) && canEdit()
  const classes = [...className.split(' '), 'translation']
  if (loading) classes.push('translation__loading')
  if (md) classes.push('translation__md')
  if (error || !translate) classes.push('translation__error')

  // data
  let { translation } = translate || {}
  translation = translation || ''
  if (!translation && autoHide) props.hidden = true

  // params
  Object.keys(params).map(param => {
    const pattern = new RegExp(`{{${param}}}`, 'g')
    translation = translation.replace(pattern, params[param])
  })

  // render
  if (md) translation = markdown.render(translation)

  return (
    <Tag
      {...props}
      className={classes.join(' ')}
      data-translation={_id}
      onDoubleClick={() => editable && toggleEditing()}
    >
      {translation || children || ''}
      {editable && (
        <Editor _id={_id} isOpen={isEditing} toggle={toggleEditing} />
      )}
      <Helmet>
        <style>
          {
            "@keyframes translator__loading{0%{left:-1em}80%{left:100%}}.translator-preview img{max-width:100%}.translation.translation__loading{position:relative;width:100%;max-width:5em;display:inline-block;color:transparent;background-color:hsla(0,0%,50%,0.1);white-space:nowrap;}.translation.translation__laoding.translation__md{width:100%;display:block;}.translation.translation__loading::after{content:'';position:absolute;left:-1em;top:0;bottom:0;width:1em;background-image:linear-gradient(to right,hsla(0,0%,50%,0),hsla(0,0%,50%,0.2),hsla(0,0%,50%,0));animation:translator__loading 1s linear 0s infinite forwards;}"
          }
        </style>
      </Helmet>
    </Tag>
  )
}

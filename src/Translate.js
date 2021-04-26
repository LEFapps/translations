import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import stubFalse from 'lodash/stubFalse'

import { Editor } from './Edit'
import { useTranslator } from './setup'
import { TRANSLATION_GET } from './queries'
import { markdown } from './helpers/markdown'

export const Translate = ({
  _id,
  md,
  tag: Tag = 'span',
  className = '',
  params = {},
  autoHide,
  children,
  ...props
}) => {
  const { language, canEdit = stubFalse } = useTranslator()
  const { loading, error, data = {} } = useQuery(TRANSLATION_GET, {
    variables: { _id, language }
  })
  const [isEditing, setEditing] = useState()
  const toggleEditing = () => setEditing(!isEditing)

  const { translate } = data

  const editable = canEdit()
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
      onDoubleClick={() => editable && toggleEditing()}
    >
      {translation || children || ''}
      {editable && (
        <Editor _id={_id} isOpen={isEditing} toggle={toggleEditing} />
      )}
    </Tag>
  )
}

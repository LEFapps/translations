import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { TranslatorContext } from './setup'
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
  const { language } = useContext(TranslatorContext)
  const { loading, error, data = {} } = useQuery(TRANSLATION_GET, {
    variables: { _id, language }
  })

  const { translate } = data

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

  if (md) translation = markdown.render(translation)

  return (
    <Tag {...props} className={classes.join(' ')}>
      {translation || children || ''}
    </Tag>
  )
}

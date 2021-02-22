import React from 'react'
import { useQuery } from '@apollo/client'

import { TranslatorContext } from './setup'
import { TRANSLATION_GET } from './queries'

export const Translate = ({
  _id,
  md,
  tag: Tag = 'span',
  className = '',
  ...props
}) => {
  const { language } = useContext(TranslatorContext)
  const { loading, error, data } = useQuery(TRANSLATION_GET, {
    variables: { _id, language }
  })

  const classes = [...className.split(' '), 'translation']
  if (loading) classes.push('translation__loading')
  if (md) classes.push('translation__md')
  if (error) classes.push('translation__error')

  return (
    <Tag {...props} className={classes.join(' ')}>
      {data && data.translation}
    </Tag>
  )
}

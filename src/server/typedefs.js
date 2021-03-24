import { gql } from 'apollo-server'

export default gql`
  scalar Translations # object as follows: { en: 'EN Text', ...}
  type Translation {
    _id: String
    params: [String]
    md: Boolean
    translation: String
    translations: Translations
  }

  extend type Query {
    translate(_id: String, language: String): Translation
    translated(
      _id: String
      translations: Translations
      md: Boolean
      params: [String]
    ): Translation
    translations: [Translation]
  }
`

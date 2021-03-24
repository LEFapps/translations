import { gql } from 'apollo-boost'

export const TRANSLATION_GET = gql`
  query getTranslation($key: String, $ln: String) {
    translate(_id: $key, language: $ln) {
      _id
      translation
    }
  }
`
export const TRANSLATION_GET__ADMIN = gql`
  query getTranslation($key: String) {
    translate(_id: $key) {
      translations
      params
      md
    }
  }
`
export const TRANSLATION_LIST = gql`
  query getTranslations {
    translations {
      _id
      md
      params
    }
  }
`
export const TRANSLATION_SET = gql`
  query setTranslation(
    $key: String
    $translations: TranslationInput
    $md: Boolean
  ) {
    translated(_id: $key, translations: $translations, md: $md) {
      _id
    }
  }
`

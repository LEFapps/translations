import { gql } from 'apollo-boost'

export const TRANSLATION_GET = gql`
  query getTranslation($_id: String, $language: String) {
    translate(_id: $_id, language: $language) {
      _id
      translation
    }
  }
`
export const TRANSLATION_GET__ADMIN = gql`
  query getTranslation($_id: String) {
    translate(_id: $_id) {
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
  mutation setTranslation(
    $_id: String
    $translations: Translations
    $md: Boolean
  ) {
    translated(_id: $_id, translations: $translations, md: $md) {
      _id
    }
  }
`

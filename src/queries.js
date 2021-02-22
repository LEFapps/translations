import { gql } from '@apollo/client'

export const TRANSLATION_GET = gql`
  query getTranslation($key: String, $ln: String) {
    translate(_id: $key, language: $ln) {
      translation
    }
  }
`
export const TRANSLATION_LIST = gql`
  query getTranslations {
    translations {
      key
      translations
    }
  }
`
export const TRANSLATION_SET = gql`
  query setTranslation($key: String, $ln: String, $value: String) {
    translated(_id: $key, language: $ln, value: $value) {
      key
      translation
    }
  }
`

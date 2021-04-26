import {
  TranslatorContext,
  useTranslator,
  withTranslator,
  Translator
} from './setup'
import { Translate } from './Translate'
import { Editor } from './Edit'
import { Picker } from './Picker'
import * as queries from './queries'

export { TranslatorContext, useTranslator, withTranslator, Translator }
export { Translate, Editor }
export { Picker, Picker as PickLanguage }

export { queries }

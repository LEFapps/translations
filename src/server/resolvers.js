import pick from 'lodash/pick'

export default {
  Query: {
    translate: async (_, { _id, language }, { models: { Translation } }) => {
      const result = (await Translation.get({ _id })) || {}
      console.log('translate', _id, language, result)
      if (!result) return false
      const { _id: path, params, md, ...translations } = result
      const r = { _id: path, params, md }
      if (language) r.translation = result[language]
      if (!language) r.translations = translations
      console.log('translate2', r)
      return r
    },
    translations: async (_, q = {}, { models: { Translation } }) => {
      const results = await Translation.getAll(q)
      if (!results) return false
      console.log('translations', results)
      return results.map(({ _id, md = false, params = [] }) => ({
        _id,
        md,
        params
      }))
    }
  },
  Mutation: {
    translated: async (
      _,
      { _id, translations, md },
      { models: { Translation } }
    ) => {
      console.log('translatedIN', _id, translations)
      const result = await Translation.update({ _id }, { ...translations, md })
      console.log('translatedOUT', _id, result)
      return { _id }
    }
  }
}

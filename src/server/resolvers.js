import pick from 'lodash/pick'

export default {
  Query: {
    translate: async (_, { _id, language }, { models }) => {
      const { Translation } = models
      const result = await Translation.get({ _id })
      console.log(result)
      if (!result) return false
      const fields = ['_id', 'params', 'md']
      return {
        ...pick(result, fields),
        translation: language ? result[language] : result['en'] || ''
      }
    },
    translations: async (_, q = {}, { models }) => {
      const { Translation } = models
      const results = await Translation.getAll(q)
      if (!results) return false
      return results.map(({ _id, md, params }) => ({
        _id,
        md,
        params
      }))
    },
    translated: async (_, { _id, translations, md }, { models }) => {
      const { Translation } = models
      const result = await Translation.update({ _id }, { ...translations, md })
      console.log(result)
      return { _id }
    }
  }
}

import upperCase from 'lodash/upperCase'
import filter from 'lodash/filter'

const prepend = '{{'
const append = '}}'

export const schema = ({ languages, params = {}, toolbarImage }) => {
  const toolbarParams = Object.keys(params).map(param => ({
    icon: 'puzzle-piece',
    title: `Insert ${param}`,
    prepend,
    append,
    middleware: ({ value, cursor }) => {
      return new Promise((resolve, reject) => {
        // if (!param) return reject({ value, cursor })
        const insert = prepend + param + append
        value = value.slice(0, cursor[0]) + insert + value.slice(cursor[1])
        cursor[0] += insert.length
        cursor[1] += insert.length
        return resolve({ value, cursor })
      })
    }
  }))

  // set formatting
  const md = {
    type: 'switch',
    name: 'md',
    label: 'Formatting supported'
  }

  // input for each available language
  const translations = languages.map(ln => ({
    type: 'textarea',
    name: `translations.${ln}`,
    label: upperCase(ln),
    toolbar: filter([toolbarImage, toolbarParams])
  }))

  // return full schema
  return [md, ...translations]
}

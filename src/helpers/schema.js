import upperCase from 'lodash/upperCase'
import filter from 'lodash/filter'

const prepend = '{{'
const append = '}}'

export const schema = ({ languages, params = [], toolbarImage }) => {
  /* eslint-disable indent */
  const toolbarParams = params &&
    !!params.length && {
      icon: 'puzzle-piece',
      title: `Insert dynamic value`,
      dropdown: params.map(param => ({
        prepend,
        append,
        title: param,
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
    }
  const toolbar = filter([filter([toolbarImage]), filter([toolbarParams])])

  // set formatting
  const md = {
    type: 'checkbox',
    name: 'md',
    label: 'Formatting supported'
  }

  // input for each available language
  const translations = languages.flatMap(ln => [
    {
      type: 'textarea',
      name: `translations.${ln}`,
      label: upperCase(ln),
      dependent: {
        on: 'md',
        operator: 'isnt',
        values: true
      }
    },
    {
      type: 'textarea',
      name: `translations.${ln}`,
      label: upperCase(ln),
      md: true,
      toolbar,
      dependent: {
        on: 'md',
        operator: 'is',
        values: true
      }
    }
  ])

  // return full schema
  return [md, ...translations]
}

import React from 'react'
import { Button, ButtonGroup, Input } from 'reactstrap'
import ImgUpload, { Preview } from '@lefapps/uploader'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import castArray from 'lodash/castArray'

let translatorText, form
try {
  form = require('@lefapps/forms')
} catch (e) {}
if (form) translatorText = form.translatorText
const defaultHost = `${window.location.protocol}//${window.location.hostname}/`

const Component = props => {
  // extract values
  const { bindInput, element, translator, attributes: propsAttributes } = props
  const { key, name, attributes: elementAttributes = {} } = element
  const {
    multiple,
    sizes: elementSizes = [],
    uploadHandler,
    host = defaultHost
  } = elementAttributes || {}
  const { value, onChange } = bindInput(name)

  // reactstrap input config
  const custom = {
    label: translatorText(
      get(
        elementAttributes,
        'placeholders',
        get(elementAttributes, 'placeholder', '')
      ),
      translator
    ),
    id: key,
    name,
    ...elementAttributes,
    invalid: get(propsAttributes, 'invalid'),
    uploader: uploadHandler
  }

  // helpers for manipulating model
  const _getValue = () => {
    const data = value ? cloneDeep(castArray(value)) : []
    return { name, value: data, onChange }
  }
  const _modifyModel = (action, { index, model, direction }) => {
    let { value, onChange } = _getValue()
    const multiple = get(element, 'attributes.multiple', false)
    // CRUD naming + move + duplicate
    switch (action) {
      case 'create':
        if (model === undefined) {
          console.warn('This action requires the options {model} to be set')
        }
        multiple ? value.splice(value.length, 0, model) : (value = model)
        break
      case 'update':
        if (index < 0 || model === undefined) {
          console.warn(
            'This action requires the options {model, index} to be set'
          )
        }
        multiple ? value.splice(index, 1, model) : (value = model)
        break
      case 'delete':
        if (index < 0) {
          console.warn('This action requires the options {index} to be set')
        }
        if (window.confirm('Are you sure you want to delete this file?')) {
          multiple ? value.splice(index, 1) : (value = undefined)
        }
        break
      case 'move':
        if (index < 0 || direction === undefined || model === undefined) {
          console.warn(
            'This action requires the options {index, direction, model} to be set'
          )
        }
        if (multiple) {
          value.splice(index, 1)
          value.splice(index + direction, 0, model)
        }
        break
      case 'duplicate':
        const newModel = value[index]
        if (index < 0 || newModel === undefined) {
          console.warn(
            'This action requires the options {index} to be set and a valid source'
          )
        }
        if (multiple) value.splice(1 + index, 0, newModel)
        break
      default:
        break
    }

    onChange({ target: { name, value } }) // onChange event
    return value
  }

  // helpers for multiple uploads
  const canMove = (index, direction) => {
    const multiple = get(element, 'attributes.multiple', false)
    const { value } = bindInput(element.name)
    return (
      multiple &&
      ((direction > 0 && index < value.length - 1) ||
        (direction < 0 && index > 0))
    )
  }
  const move = (index, direction) => {
    const model = _getValue().value[index]
    _modifyModel('move', { index, direction, model })
  }

  // helper for removing files
  const remove = index => {
    _modifyModel('delete', { index })
  }

  //  helper components
  const metaFields = () => [{ name: 'alt', type: 'text' }]
  const metaFieldBuilder = (value, index) => ({ name, type }, key) => (
    <Input
      key={key}
      type={type}
      defaultValue={value[name]}
      placeholder={name}
      onChange={({ target }) =>
        _modifyModel('update', {
          index,
          model: { name: value.name, alt: value.alt, [name]: target.value }
        })
      }
    />
  )

  // generate thumbnail for uploader
  const previewSize = {
    label: 'upload-preview',
    width: 192,
    height: 192,
    crop: true
  }
  const uploadSizes = [previewSize, ...elementSizes]

  // modifier components
  const tools = index => (
    <ButtonGroup>
      {multiple ? (
        <>
          <Button
            color={'info'}
            size={'sm'}
            outline
            onClick={() => move(index, -1)}
            disabled={!canMove(index, -1)}
            title={'Move up'}
          >
            △
          </Button>
          <Button
            color={'info'}
            size={'sm'}
            outline
            onClick={() => move(index, 1)}
            disabled={!canMove(index, 1)}
            title={'Move down'}
          >
            ▽
          </Button>
        </>
      ) : null}
      <Button
        color={'danger'}
        size={'sm'}
        outline
        onClick={() => remove(index)}
        title={'Remove'}
      >
        ✕
      </Button>
    </ButtonGroup>
  )

  const visibleValue =
    value &&
    [value].flat().map((v, index) => {
      const [base, type] = v.name.split('.')
      const isImage = ['jpg', 'jpeg', 'png'].includes(type)
      return (
        <Preview
          name={v.name}
          local={`${host}upload-preview/${v.name}`}
          url={host + v.name}
          key={index}
          extras={metaFields(isImage).map(
            metaFieldBuilder({ isImage, base, type, ...v }, index)
          )}
        >
          {tools(index)}
        </Preview>
      )
    })

  // render
  return (
    <div>
      {elementAttributes.disabled ? null : uploadHandler ? (
        <ImgUpload
          onChange={({ name, alt }) =>
            _modifyModel('create', { model: { name, alt } })
          }
          {...custom}
          sizes={uploadSizes}
          children={visibleValue || null}
        />
      ) : (
        visibleValue || null
      )}
    </div>
  )
}

const config = ({ translator, model }) => [
  {
    type: 'divider',
    key: 'upload.divider',
    layout: {
      col: {
        xs: 12
      }
    }
  },
  {
    type: 'infobox',
    key: 'upload.info',
    label: {
      nl: 'Bestanden',
      en: 'Files'
    },
    layout: {
      col: {
        xs: 12
      }
    }
  },
  {
    type: 'checkbox',
    name: 'attributes.multiple',
    key: 'attributes.multiple',
    label: {
      nl: 'Laat meerdere bestanden toe',
      en: 'Allow multiple files'
    },
    layout: {
      col: {
        xs: 12
      }
    }
  },
  {
    type: 'select',
    key: 'upload.select',
    name: 'attributes.uploader',
    label: {
      nl: 'Bestandsformaten',
      en: 'Allowed File Types'
    },
    options: [
      { _id: 'images', nl: 'Afbeeldingen', en: 'Images' },
      {
        _id: 'files',
        nl: 'Courante bestanden',
        en: 'Well-known formats'
      },
      { _id: 'custom', nl: 'Projectspecifiek', en: 'Custom' }
    ],
    layout: {
      col: {
        xs: 12,
        sm: 6
      }
    }
  },
  {
    type: 'subform',
    key: 'upload.sizes',
    name: 'attributes.sizes',
    label: {
      nl: 'Formaten',
      en: 'Thumbnails'
    },
    layout: {
      col: { xs: 12 }
    },
    attributes: {
      columns: [
        { name: 'label', label: 'Label' },
        { name: 'width', label: 'W' },
        { name: 'height', label: 'H' },
        { name: 'crop', label: 'Crop' },
        { name: 'retina', label: 'Retina' },
        { name: 'quality', label: 'Quality' }
      ]
    },
    elements: [
      {
        name: 'label',
        type: 'text',
        label: {
          nl: 'Formaatlabel',
          en: 'Size Label'
        },
        required: true,
        layout: { col: { xs: 12 } }
      },
      {
        name: 'width',
        type: 'number',
        label: {
          nl: 'Maximale breedte',
          en: 'Max. Width'
        },
        required: true,
        layout: { col: { xs: 12, sm: 6 } }
      },
      {
        name: 'height',
        type: 'number',
        label: {
          nl: 'Maximale hoogte',
          en: 'Max. Height'
        },
        required: true,
        layout: { col: { xs: 12, sm: 6 } }
      },
      {
        name: 'crop',
        type: 'checkbox',
        label: {
          nl: 'Afbeelding bijsnijden',
          en: 'Crop image'
        },
        layout: { col: { xs: 12 } }
      },
      {
        name: 'retina',
        type: 'checkbox',
        label: {
          nl: 'Dit formaat ook voorzien voor retina-schermen',
          en: 'Thumbnail also available for retina screens'
        },
        layout: { col: { xs: 12 } }
      },
      {
        name: 'quality',
        type: 'select',
        label: {
          nl: 'Kwaliteit',
          en: 'Quality'
        },
        options: [
          { en: '60 % (default)', nl: '60 % (standaard)' },
          { _id: 40, default: '40 %' },
          { _id: 50, default: '50 %' },
          { _id: 75, default: '75 %' },
          { _id: 90, default: '90 %' },
          { _id: 100, default: '100 %' }
        ],
        layout: { col: { xs: 12 } }
      }
    ]
  }
]

const transform = (element, { translator }, saving) => element

Component.displayName = 'UploadComponent'
export default Component
export { config, transform }

export const uploadComponent = {
  component: Component,
  config,
  transform,
  filter: () => false,
  icon: 'file'
}

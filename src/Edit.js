import React, { useContext, useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from 'reactstrap'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import get from 'lodash/get'

import { Form } from './helpers/Form'
import { schema } from './helpers/schema'
import { TranslatorContext } from './setup'
import { TRANSLATION_GET__ADMIN, TRANSLATION_SET } from './queries'
import Component from './helpers/Upload'
import { render } from 'react-dom'

export const Editor = ({ _id, toggle, isOpen, ...props }) => {
  const [isBusy, setBusy] = useState()
  const [alerts, setAlert] = useState()
  const { languages, ...context } = useContext(TranslatorContext)
  const { loading, error, data } = useQuery(TRANSLATION_GET__ADMIN, {
    variables: { _id }
  })
  // const [
  //   setTranslation,
  //   { loading: loadingUpdate, error: errorUpdate, data: dataUpdate }
  // ] = useLazyQuery(TRANSLATION_SET)
  const [
    setTranslation,
    { loading: loadingUpdate, error: errorUpdate, data: dataUpdate }
  ] = useMutation(TRANSLATION_SET)

  // save changes
  const updateTranslation = model => {
    setBusy(true)
    setAlert()
    const r = setTranslation({ variables: { _id, ...model } })
    if (!loadingUpdate) {
      setBusy(false)
      if (errorUpdate) return setAlert(errorUpdate)
      toggle()
    }
  }

  // data
  const translation =
    (dataUpdate && dataUpdate.translate) || (data && data.translate)

  // render edit modal
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size={'lg'}
      className={'admin-dashboard__style'}
    >
      <ModalHeader>{_id}</ModalHeader>
      <ModalBody>
        {loading && <Spinner size='lg' color='primary' />}
        {translation && !loading && (
          <Form
            elements={schema({
              languages,
              params: translation.params,
              ...context
            })}
            onSubmit={updateTranslation}
            initialModel={translation}
          >
            <Button
              type={'button'}
              disabled={isBusy}
              onClick={toggle}
              color='warning'
            >
              <FontAwesomeIcon icon={'times'} />
            </Button>{' '}
            <Button type={'submit'} disabled={isBusy} color='success'>
              <FontAwesomeIcon icon={'check'} />
            </Button>
          </Form>
        )}
      </ModalBody>
      <ModalFooter className='text-danger'>{alerts || ''}</ModalFooter>
    </Modal>
  )
}

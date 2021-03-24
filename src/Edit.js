import React, { useContext, useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from 'reactstrap'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Form } from './helpers/Form'
import { schema } from './helpers/schema'
import { TranslatorContext } from './setup'
import { TRANSLATION_GET__ADMIN, TRANSLATION_SET } from './queries'
import Component from './helpers/Upload'
import { render } from 'react-dom'

export const Editor = ({ _id, toggle, isOpen, ...props }) => {
  const [isBusy, setBusy] = useState()
  const [alert, setAlert] = useState()
  const { languages, ...context } = useContext(TranslatorContext)
  const { loading, error, data } = useQuery(TRANSLATION_GET__ADMIN, {
    variables: { _id }
  })
  const [setTranslation, settledTranslation] = useLazyQuery(TRANSLATION_SET)

  // save changes
  const updateTranslation = model => {
    setBusy(true)
    setAlert()
    setTranslation({ variables: { _id, ...model } })
    const { loading, error, data } = settledTranslation
    if (!loading) {
      setBusy(false)
      if (error) return setAlert(error)
      toggle()
    }
  }

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
        {data && !loading && (
          <Form
            elements={schema({ languages, params: data.params, ...context })}
            onSubmit={updateTranslation}
            initialModel={data}
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
      <ModalFooter className='text-danger'>{alert || ''}</ModalFooter>
    </Modal>
  )
}

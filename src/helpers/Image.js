// import React, { useState } from 'react'
// import { render } from 'react-dom'
// import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'

// import { Form } from './Form'

// const { assets } = config.storage || {}

// const uploader = [
//   {
//     name: 'image',
//     label: 'Image',
//     type: 'upload',
//     required: true,
//     attributes: {
//       placeholder: 'Choose an image'
//     }
//   }
// ]

// const MarkdownImageModal = ({ handler }) => {
//   const [isOpen, setOpen] = useState(true)
//   const toggle = () => setOpen(!isOpen)
//   const handleSubmit = uploaded => {
//     handler(uploaded)
//     toggle()
//   }
//   return (
//     <Modal toggle={toggle} isOpen={isOpen} className={'admin-dashboard__style'}>
//       <ModalHeader toggle={toggle}>Inserting an image…</ModalHeader>
//       <ModalBody>
//         <Form elements={uploader} onSubmit={handleSubmit}>
//           <Button type={'submit'}>Add</Button>
//         </Form>
//       </ModalBody>
//     </Modal>
//   )
// }

// const insertMdImage = (source, { name, alt, ...uploaded }, [start, end]) => {
//   console.log(uploaded)
//   let result = ''
//   result += source.slice(0, start)
//   result += alt || name
//   result += ']('
//   result += assets + 'main/' + name
//   result += source.slice(end)
//   return result
// }

// const markdownImage = ({ value, cursor }) =>
//   new Promise((resolve, reject) => {
//     const parentNode = document.createElement('div')
//     document
//       .querySelector('.admin-board__full .admin-board__body')
//       .append(parentNode)
//     const handler = image => {
//       if (image) {
//         let inc = value.length
//         value = insertMdImage(value, image, cursor)
//         inc = value.length - inc
//         cursor[1] += inc
//         return resolve({ value, cursor })
//       } else return reject({ value, cursor })
//     }
//     render(<MarkdownImageModal handler={handler} />, parentNode)
//   })

// /** @member markdownImage
//  *
//  * Renders an upload button in the toolbar
//  * of a textarea with the option {md:true}
//  * assign this value to the key 'toolbar' `toolbar: [[ markdownImage ]]`
//  *
//  */

// export default {
//   icon: 'image',
//   title: 'insert image',
//   prepend: '![',
//   append: ')',
//   middleware: markdownImage
// }

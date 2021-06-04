let EasyForm, form, uploadComponent, upload
try {
  form = require('@lefapps/forms')
} catch (e) {
  // console.error(e)
}

if (form) {
  upload = require('./Upload')
  EasyForm = form.EasyForm
  if (upload) uploadComponent = upload.uploadComponent
}

const MyForm = EasyForm && new EasyForm()
if (MyForm && uploadComponent) MyForm.addComponent('upload', uploadComponent)

export const Form = MyForm && MyForm.instance()
export default Form

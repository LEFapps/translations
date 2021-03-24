import { EasyForm } from '@lefapps/forms'

import { uploadComponent } from './Upload'

const MyForm = new EasyForm()
MyForm.addComponent('upload', uploadComponent)

export const Form = MyForm.instance()
export default Form

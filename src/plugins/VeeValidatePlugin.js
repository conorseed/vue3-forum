import { localize } from '@vee-validate/i18n'
import { required, email, min, url } from '@vee-validate/rules'
import { defineRule, Form, Field, ErrorMessage, configure } from 'vee-validate'
import firebase from '@/helpers/firebase'

export default (app) => {
  // define rules
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let resource, field, exclude
    if (Array.isArray(args)) {
      [resource, field, exclude] = args
    } else {
      ({ resource, field, exclude } = args)
    }
    if (value === exclude) return true
    const snapshot = await firebase.firestore().collection(resource).where(field, '==', value).get()

    return snapshot.empty
  })

  // config
  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} is required',
        email: '{field} must be a valid email',
        min: '{field} must be at least 0:{min} characters long',
        unique: '{field} has been taken by another user',
        url: '{field} must be a valid url'
      }
    }),
    validateOnInput: true
  })

  // register components
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}

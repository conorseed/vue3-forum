/* import the fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil, faCamera } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPencil, faCamera)

export default (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
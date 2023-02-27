const DirectiveClickOutside = {
  mounted (el, binding) {
    el.__ClickOutsideHandler__ = e => {
      if ((el === event.target || el.contains(e.target))) {
        return false
      }
      binding.value(e)
    }
    document.body.addEventListener('click', el.__ClickOutsideHandler__)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  }
}

export default (app) => {
  app.directive('click-outside', DirectiveClickOutside)
}

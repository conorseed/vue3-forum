import debounce from 'lodash/debounce'

const DirectivePageScroll = {
  mounted (el, binding) {
    el.__PageScroll__ = debounce(() => {
      binding.value()
    }, 200, { leading: true })
    document.addEventListener('scroll', el.__PageScroll__, { passive: true })
  },
  unmounted (el) {
    document.removeEventListener('scroll', el.__PageScroll__)
  }
}

export default (app) => {
  app.directive('page-scroll', DirectivePageScroll)
}

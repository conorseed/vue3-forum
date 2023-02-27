<template>
  <div ref="observerEl" class="intersection-observer"></div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  done: { type: Boolean, default: false }
})

const emit = defineEmits(['scroll:load'])

const observerEl = ref(null)
const observer = ref(null)

onMounted(() => {
  if (props.done) return
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) emit('scroll:load')
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.9
  })
  observer.value.observe(observerEl.value)
})

function unobserve () {
  if (observer.value && observerEl.value) {
    observer.value.unobserve(observerEl.value)
    observer.value = null
  }
}

onUnmounted(() => {
  unobserve()
})

watch(() => props.done, () => {
  if (props.done) {
    unobserve()
  }
})

</script>

<style scoped>
div{
  position: relative;
  z-index: -1;
  pointer-events: none;
  bottom: 200px
}
</style>

<template>
  <div class="text-center" style="margin-bottom:15px">
    <button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
      Random Avatar
    </button>
    <br>
    <small style="opacity:0.5">Powered by <a href="https://pixabay.com" target="_blank">Pixabay</a></small>
  </div>
</template>

<script setup>
import { arrayRandom } from '@/helpers'
import { defineEmits } from 'vue'

const emit = defineEmits(['RandomAvatar:hit'])

async function getRandomImage () {
  const searchTerms = [
    'cats',
    'dogs',
    'abstract',
    'cars',
    'mountains',
    'beach',
    'landscape',
    'object',
    'food',
    'flowers',
    'architecture',
    'yellow',
    'green',
    'blue',
    'orange',
    'black',
    'white',
    'brown',
    'red',
    'patterns',
    'animal',
    'code',
    'space'
  ]
  const randomWord = arrayRandom(searchTerms)
  const res = await fetch(`https://pixabay.com/api/?key=33964373-d915ae5b6e0fb728517aab98d&q=${randomWord}`)
  const data = await res.json()
  const randomImage = arrayRandom(data.hits)
  emit('RandomAvatar:hit', randomImage.webformatURL)
}
</script>

<style scoped>

</style>

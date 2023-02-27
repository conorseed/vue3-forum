<template>
  <span :title="humanFriendlyDate">
      {{ diffForHumans }}
  </span>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime).extend(localizedDate)

const props = defineProps({
  timestamp: {
    required: true,
    type: [Number, Object]
  }
})
const normalisedTimestamp = computed(() => {
  return props.timestamp?.seconds || props.timestamp
})
const diffForHumans = computed(() => {
  return dayjs.unix(normalisedTimestamp.value).fromNow()
})
const humanFriendlyDate = computed(() => {
  return dayjs.unix(normalisedTimestamp.value).format('llll')
})
</script>

<style scoped>

</style>

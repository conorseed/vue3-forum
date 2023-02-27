<template>
  <div class="form-group">
      <label :for="props.name">{{ label }}</label>
      <vee-field
      :name="props.name"
      :label="props.label"
      :modelValue="props.modelValue"
      @input="emit('modelUpdate', $event)"
      :id="props.name"
      class="form-input"
      v-bind="$attrs" />
      <vee-error-message :name="props.name" class="form-error" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['modelUpdate'])
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  modelValue: { type: String, default: '' }
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style scoped>

</style>

<template>
  <vee-form @submit="save">
    <app-form-field label="Title" name="title" v-model="form.title" rules="required" />
    <app-form-field as="textarea" label="Content" name="content" v-model="form.text" rules="required" rows="8" />

        <div class="btn-group">
          <button @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
          <button class="btn btn-blue" type="submit" name="Publish">
            {{ existingThread ? 'Update' : 'Publish' }}
          </button>
        </div>
    </vee-form>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'

const emit = defineEmits(['save', 'cancel', 'dirty', 'clean'])

const props = defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' }
})

const form = ref({
  title: props.title,
  text: props.text
})

async function save () {
  emit('clean')
  emit('save', { ...form.value })
}

function cancel () {
  emit('cancel')
}

const existingThread = computed(() => {
  return !!props.title
})

watch(form, () => {
  if (form.value.title !== props.title || form.value.text !== props.text) {
    emit('dirty')
  } else {
    emit('clean')
  }
}, { deep: true })

</script>

<style scoped>

</style>

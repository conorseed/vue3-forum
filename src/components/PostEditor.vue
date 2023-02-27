<template>
  <vee-form @submit="savePost" :key="formKey">

        <app-form-field as="textarea" name="content" v-model="postCopy.text" rules="required" rows="8" cols="140" />

        <div class="btn-group">
          <button @click.prevent="emitCancel" class="btn btn-ghost">Cancel</button>
          <button class="btn btn-blue" type="submit" name="Publish">
            {{ post.id ? 'Update Post' : 'Submit Post' }}
          </button>
        </div>
    </vee-form>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['PostEditor:Save', 'PostEditor:Cancel'])
const props = defineProps({
  post: {
    type: Object, default: () => ({ text: null })
  }
})

const postCopy = ref({ ...props.post })

function savePost () {
  // add post data
  emit('PostEditor:Save', postCopy.value)

  // clear form
  clearForm()
}

function emitCancel () {
  emit('PostEditor:Cancel', postCopy.value)
  // clear form
  clearForm()
}

const formKey = ref(Math.random())
function clearForm () {
  postCopy.value.text = ''
  formKey.value = Math.random()
}
</script>

<style scoped>

</style>

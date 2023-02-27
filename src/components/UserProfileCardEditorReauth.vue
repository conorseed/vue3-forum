<template>
  <vue-final-modal v-model="showModal" class="modal-container" content-class="modal">
    <div class="modal-content">
      <h4>Please login again to change your email</h4>
      <vee-form @submit="reauthenticate">
        <app-form-field v-model="email" name="email" label="Email" rules="required|email" type="email" />
        <app-form-field v-model="password" name="password" label="Password" rules="required" type="password" />
        <div class="push-top">
            <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>
      </vee-form>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits(['success', 'fail'])
const props = defineProps({
  modelValue: { type: Boolean, default: true }
})

const email = ref('')
const password = ref('')

async function reauthenticate () {
  try {
    await useUsersStore().reauthenticate({ email: email.value, password: password.value })
    emit('success')
  } catch (error) {
    emit('fail', error)
  }
}

const showModal = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>

</style>

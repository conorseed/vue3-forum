<template>
<div class="flex-grid justify-center">
    <div class="col-2">

        <vee-form @submit="register" class="card card-form">
            <h1 class="text-center">Register</h1>

            <app-form-field v-model="form.name" name="name" label="Name" rules="required" />
            <app-form-field v-model="form.username" name="username" label="Username" rules="required|unique:users,username" />
            <app-form-field v-model="form.email" name="email" label="Email" rules="required|email|unique:users,email" type="email" />
            <app-form-field v-model="form.password" name="password" label="Password" rules="required|min:8" type="password" />

            <div class="form-group">
                <label for="avatar">
                  Avatar
                  <div v-if="avatarPreview">
                    <img :src="avatarPreview" class="avatar-xlarge" alt="Avatar Preview" />
                  </div>
                </label>
                <vee-field name="avatar"
                v-show="!avatarPreview"
                @change="handleImageUpload"
                accept="image/*"
                id="avatar" type="file" class="form-input" />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-blue btn-block">Register</button>
            </div>

        </vee-form>
        <div class="text-center push-top">
            <button @click.prevent="signInWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: ''
})
const avatarPreview = ref(null)

async function register () {
  const newUser = await useUsersStore().registerUserWithEmailAndPassword(form.value)
  router.push('/')
}

async function signInWithGoogle () {
  await useUsersStore().signInWithGoogle()
}

function handleImageUpload (e) {
  form.value.avatar = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (event) => {
    avatarPreview.value = event.target.result
  }
  reader.readAsDataURL(form.value.avatar)
}

</script>

<style scoped>

</style>

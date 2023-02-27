<template>
  <div class="flex-grid justify-center">
        <div class="col-2">

            <vee-form @submit="signIn" class="card card-form">
                <h1 class="text-center">Login</h1>

                <app-form-field v-model="form.email" name="email" label="Email" rules="required|email" type="email" />
                <app-form-field v-model="form.password" name="password" label="Password" rules="required" type="password" />

                <div class="push-top">
                    <button type="submit" class="btn-blue btn-block">Log in</button>
                </div>

                <div class="form-actions text-right">
                    <router-link :to="{name: 'Register'}">Create an account?</router-link>
                </div>
            </vee-form>

            <div class="push-top text-center">
                <button @click.prevent="signInWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/UsersStore'

const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})

async function signIn () {
  try {
    await useUsersStore().signInWithEmailAndPassword(form.value)
    successRedirect()
  } catch (e) {
    alert(e.message)
  }
}

async function signInWithGoogle () {
  try {
    await useUsersStore().signInWithGoogle()
    successRedirect()
  } catch (e) {
    alert(e.message)
  }
}

function successRedirect () {
  const redirectTo = route.query.redirect || { name: 'Home' }
  router.push(redirectTo)
}
</script>

<style scoped>

</style>

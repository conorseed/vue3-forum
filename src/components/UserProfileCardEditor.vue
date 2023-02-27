<template>
  <div class="profile-card">

    <vee-form @submit="save">
      <label class="text-center avatar-edit" for="avatar">
          <app-user-avatar size="xlarge" :user="activeUser" />
          <div class="avatar-upload-overlay">
            <app-spinner v-if="uploadingAvatar" color="white" />
            <font-awesome-icon v-else icon="camera" size="3x" :style="{color: 'white', opacity: '8'}" />
          </div>
          <input v-show="false" @change="handleAvatarUpload" type="file" id="avatar" accept="image/*" />
      </label>
      <div class="form-group">
        <user-profile-card-editor-random-avatar @RandomAvatar:hit="randomAvatarHit" />
      </div>
      <app-form-field v-model="activeUser.username" name="username" label="Username" :rules="`required|unique:users,username,${props.user.username}`" />
      <app-form-field v-model="activeUser.name" name="name" label="Name" rules="required" />
      <app-form-field as="textarea" name="user_bio" label="Bio" v-model="activeUser.bio" rows="8" cols="140" />
      <div class="stats">
        <span>{{ user.postsCount }} post{{ (user.postsCount === 1) ? '' : 's' }}</span>
        <span>{{ user.threadsCount }} thread{{ (user.threadsCount === 1) ? '' : 's' }}</span>
      </div>
      <hr>
      <app-form-field v-model="activeUser.website" name="user_website" label="Website" autocomplete="off" rules="url" />
      <app-form-field v-model="activeUser.location" name="user_location" label="Location" list="locations" autocomplete="off" @mouseenter="loadLocationOptions" @focus="loadLocationOptions" />
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
      </datalist>

      <hr>

      <app-form-field v-model="activeUser.email" name="email" label="Email" :rules="`required|email|unique:users,email,${props.user.email}`" type="email" />
      <app-form-field v-model="activeUser.password" name="password" label="Password" rules="required|min:8" type="password" />

      <div class="btn-group space-between">
          <button @click.prevent="cancel" class="btn-ghost">Cancel</button>
          <button type="submit" class="btn-blue">Save</button>
      </div>
    </vee-form>
    <user-profile-card-editor-reauth
    v-model="needsReauth"
    @success="onReauth"
    @fail="OnReauthFailed" />
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/UsersStore'
import useNotifications from '@/composables/useNotifications'
import UserProfileCardEditorRandomAvatar from '@/components/UserProfileCardEditorRandomAvatar.vue'
import UserProfileCardEditorReauth from '@/components/UserProfileCardEditorReauth.vue'

const usersStore = useUsersStore()
const router = useRouter()
const { addNotification } = useNotifications()

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const activeUser = ref({ ...props.user })
const uploadingAvatar = ref(false)

async function handleAvatarUpload (e) {
  uploadingAvatar.value = true
  const file = e.target.files[0]
  const uploadedImage = await usersStore.uploadAvatar({ file })
  activeUser.value.avatar = uploadedImage || activeUser.value.avatar
  uploadingAvatar.value = false
}

function randomAvatarHit (payload) {
  activeUser.value.avatar = payload || activeUser.value.avatar
}

async function handleRandomAvatarUpload () {
  const randomAvatar = activeUser.value.avatar?.startsWith('https://pixabay')
  if (randomAvatar) {
    const image = await fetch(activeUser.value.avatar)
    const blob = await image.blob()
    activeUser.value.avatar = await usersStore.uploadAvatar({ file: blob, filename: 'random' })
  }
}

const locationOptions = ref([])
async function loadLocationOptions () {
  if (locationOptions.value.length) return
  const res = await fetch('https://restcountries.com/v3/all')
  locationOptions.value = await res.json()
}

const needsReauth = ref(false)
async function save () {
  await handleRandomAvatarUpload()
  const emailChanged = activeUser.value.email !== props.user.email
  const passwordChanged = activeUser.value.password
  if (emailChanged || passwordChanged) {
    needsReauth.value = true
    return
  }
  saveUserData()
}

async function saveUserData () {
  await usersStore.updateUser({ ...activeUser.value, threads: activeUser.value.threadIds })
  router.push({ name: 'Profile' })
  addNotification({ message: 'User successfully updated', timeout: 6000 })
}

async function onReauth () {
  if (activeUser.value.email !== props.user.email) await usersStore.updateEmail({ email: activeUser.value.email })
  if (activeUser.value.password) await usersStore.updatePassword({ password: activeUser.value.password })
  saveUserData()
}

async function OnReauthFailed () {
  addNotification({ message: 'Error updating user', type: 'error', timeout: 6000 })
}

function cancel () {
  router.push({ name: 'Profile' })
}

</script>

<style scoped>
 .spinner{
  margin: 0
 }
</style>

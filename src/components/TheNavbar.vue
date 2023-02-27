<template>
  <header class="header" id="header"
  v-click-outside="()=>mobileNavMenu = false"
  v-page-scroll="()=> mobileNavMenu = false"
  >

    <router-link :to="{name: 'Home'}" class="logo">
        <img src="../assets/img/svg/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger" @click.prevent="mobileNavMenu = !mobileNavMenu">
        <!-- use .btn-humburger-active to open the menu -->
        <div class="top bar"></div>
        <div class="middle bar"></div>
        <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavMenu}">
    <ul>
        <li v-if="usersStore.authedUser && 'username' in usersStore.authedUser" class="navbar-user">
            <a
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            v-click-outside="() => userDropdownOpen = false"
            >
                <app-user-avatar size="small" />
                <span>
                    {{ usersStore.authedUser.name }}
                    <img class="icon-profile" src="../assets/img/svg/arrow-profile.svg" alt="">
                </span>
              </a>

            <!-- dropdown menu -->
            <!-- add class "active-drop" to show the dropdown -->
            <div id="user-dropdown" :class="{'active-drop': userDropdownOpen}">
                <div class="triangle-drop"></div>
                <ul class="dropdown-menu">
                    <li class="dropdown-menu-item"><router-link :to="{name: 'Profile'}">View profile</router-link></li>
                    <li class="dropdown-menu-item"><router-link :to="{name: 'SignOut'}">Sign Out</router-link></li>
                </ul>
            </div>
        </li>
        <li v-if="!usersStore.authedUser" class="navbar-item">
          <router-link :to="{name: 'SignIn'}">Sign In</router-link>
        </li>
        <li v-if="!usersStore.authedUser" class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
        <li v-if="usersStore.authedUser && 'username' in usersStore.authedUser" class="navbar-mobile-item">
          <router-link :to="{name: 'Profile'}">View Profile</router-link>
        </li>
        <li v-if="usersStore.authedUser && 'username' in usersStore.authedUser" class="navbar-mobile-item">
          <router-link :to="{name: 'SignOut'}">Sign Out</router-link>
        </li>
    </ul>

    <!-- <ul>
        <li class="navbar-item">
            <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
            <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
            <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
            <a href="thread.html">Thread</a>
        </li>
        Show these option only on mobile
        <li class="navbar-item mobile-only">
            <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
            <a href="#">Logout</a>
        </li>
    </ul> -->
    </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/UsersStore'

const router = useRouter()
const usersStore = useUsersStore()

const userDropdownOpen = ref(false)
const mobileNavMenu = ref(false)

router.beforeEach(() => {
  mobileNavMenu.value = false
})

</script>

<style scoped>

</style>

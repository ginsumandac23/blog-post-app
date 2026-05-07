<script setup>
  import { ref } from 'vue';
  import { useGlobalStore } from '../stores/global.js';
  const store = useGlobalStore();
  const dropdownOpen = ref(false);

  function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
  }

  function closeDropdown() {
    dropdownOpen.value = false;
  }
</script>

<template>
  <header class="bg-white py-2">
    <div class="container-xxl p-0">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid d-flex align-items-center">
          <!-- LEFT: Logo -->
          <router-link :to="{name: 'Home'}" class="navbar-brand logo">
            <img src="/images/logo.png" alt="Logo" />
          </router-link>
          <!-- Mobile Toggle -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- CENTER: Navigation -->
          <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <router-link :to="{name: 'Home'}" class="nav-link active">Home</router-link>
              <router-link :to="{name: 'Blogs'}" class="nav-link">Blog</router-link>
              <router-link :to="{name: 'CreateBlog'}" class="nav-link" v-if="store.user.email">Create Blog Post</router-link>
            </div>
          </div>
          <!-- RIGHT: Icons -->
          <div class="d-flex align-items-center ms-auto nav-auth gap-3">
            <!-- If NOT logged in -->
            <router-link :to="{name: 'Register'}" class="nav-link" v-if="!store.user.email">Register</router-link>
            <router-link :to="{name: 'Login'}" class="nav-link" v-if="!store.user.email">Login</router-link>
            <!-- If logged in -->
            <div 
              class="dropdown profile-dropdown" 
              v-if="store.user.email"
              v-click-outside="closeDropdown"
            >
              <a 
                href="#" 
                class="d-flex align-items-center text-decoration-none" 
                @click.prevent="toggleDropdown"
              >
                <i class="bi bi-person-circle fs-5"></i>
              </a>
              <ul 
                class="dropdown-menu dropdown-menu-end"
                :class="{ show: dropdownOpen }"
              >
                <li>
                  <router-link 
                    :to="{name: 'Logout'}" 
                    class="dropdown-item"
                    @click="closeDropdown"
                  >
                    Logout
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style>
  .profile-dropdown i {
    color: var(--primary-color);
  }
  .profile-dropdown .dropdown-menu {
    background: var(--primary-color);
  }
  .profile-dropdown .dropdown-menu .dropdown-item {
    color: #fff;
  }
  .profile-dropdown .dropdown-menu .dropdown-item:hover {
    background: transparent !important;
    text-decoration: underline;
    color: #fff;
  }

  .profile-dropdown {
  position: relative;
}
.profile-dropdown .dropdown-menu {
  background: var(--primary-color);
  position: absolute;
  right: 0;
  left: auto;
}
</style>
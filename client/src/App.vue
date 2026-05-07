<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useGlobalStore } from './stores/global.js';

const store = useGlobalStore();

// Re-fetch user details if a token exists in localStorage
if (store.user.token) {
  store.getUserDetails(store.user.token);
}
</script>

<template>
 <Navbar />
 <main>
      <router-view />
  </main>
  <Footer />
</template>

<style scoped></style>

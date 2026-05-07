<script setup>
  import { onBeforeMount } from 'vue';
  import { useGlobalStore } from '../stores/global.js';
  import { useRouter } from 'vue-router';
  
  const store = useGlobalStore(); 
  const router = useRouter();

  onBeforeMount(async () => {
    localStorage.clear();
    await store.getUserDetails(null);
    router.push({ path: '/login' });
  })
</script>
<template></template>
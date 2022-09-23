<script setup lang="ts">
import { ref } from "vue"
import { RouterView } from "vue-router"
import SideBar from "@/components/SideBar.vue"

const isConnected = ref(false);
</script>

<template>
  <div :class="isConnected ? 'app-wrapper':''">
    <SideBar v-if="isConnected"/>
    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: grid;
  grid-auto-rows: 100vh;
  grid-template-columns: 250px auto;
}
</style>

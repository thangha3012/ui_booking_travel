<template>
  <RouterView />
  <ToastContainer />
  <ConfirmDialog />
  <TravelChatbot />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from 'primevue/confirmdialog'
import TravelChatbot from '@/components/ui/TravelChatbot.vue'
</script>

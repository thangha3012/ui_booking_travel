<template>
  <RouterView />
  <ToastContainer />
  <ConfirmDialog />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<script setup lang="ts">
import { useSnackbarStore } from '@/store/snackbar'

const snackbarStore = useSnackbarStore()
</script>

<template>
  <v-snackbar
    v-model="snackbarStore.open"
    :timeout="snackbarStore.timeout"
    :color="snackbarStore.color"
  >
    {{ snackbarStore.message }}
  </v-snackbar>
</template>

<style scoped>

</style>

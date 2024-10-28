<script setup lang="ts">
import { mdiCopyright, mdiEmail, mdiHeart, mdiPhone } from '@mdi/js'

const dialog = ref(false)
</script>

<template>
  <v-footer :app="false" height="60">
    <div class="d-flex align-center justify-space-between w-100">
      <div class="text-center">
        Avtorske pravice <v-icon :icon="mdiCopyright" color="primary" size="small" style="margin-bottom: 3px;" /> 2023 - {{ new Date().getFullYear() }} <b>Pirihcode & Onixweb</b>
      </div>
      <v-btn variant="text" class="pl-3" @click="dialog = !dialog">
        Kontakt
      </v-btn>
    </div>
  </v-footer>
  <v-dialog v-model="dialog" width="auto">
    <v-card class="pa-5">
      <div class="subTitle mb-2">
        Kontaktirajte nas
      </div>
      <p>
        <v-icon :icon="mdiEmail" color="primary" class="mr-2" />
        tilen.pirih@gmail.com
      </p>
      <p class="mt-1">
        <v-icon :icon="mdiPhone" color="primary" class="mr-2" />
        +386 51 731 371
      </p>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { mdiHome, mdiImage, mdiImageSync, mdiLogout } from '@mdi/js'
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
const router = useRouter()
const drawer = ref(false)

function logout() {
  userStore.logout()
  router.push('/prijava')
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    clipped="false"
    temporary
    app
  >
    <div>
      <div style="height: 64px;" class="logo pa-2">
        <div class="d-flex align-center">
          <v-img src="/img/logo.png" max-width="44" min-width="44" height="44" alt="logo" class="mx-3" />
          <div class="font-weight-bold title" style="font-size: 18px;">
            KK Krka
          </div>
        </div>
      </div>
      <v-list nav class="text-secondary px-4 py-0">
        <v-list-item title="Home" to="/" class="rounded-lg" active-class="text-primary">
          <template #prepend>
            <v-icon :icon="mdiHome" />
          </template>
        </v-list-item>
        <v-list-item title="Generator" to="/generator" class="rounded-lg" active-class="text-primary">
          <template #prepend>
            <v-icon :icon="mdiImage" />
          </template>
        </v-list-item>

        <v-list-item title="Zmanjševalnik slik" href="https://squoosh.app/" target="_blank" class="rounded-lg" active-class="text-primary">
          <template #prepend>
            <v-icon :icon="mdiImageSync" />
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-app-bar app color="2b2222" flat>
    <v-app-bar-nav-icon v-if="userStore.user" variant="tonal" class="rounded-lg text-primary ml-2 ml-md-3 ml-lg-6" @click.stop="drawer = !drawer" />
    <div style="height: 64px;" class="logo pa-2">
      <div class="d-flex align-center">
        <v-img src="/img/logo.png" max-width="44" min-width="44" height="44" alt="logo" class="" />
        <div class="font-weight-bold title ml-2" style="font-size: 18px;">
          KK Krka
        </div>
      </div>
    </div>
    <v-spacer />
    <change-theme />
    <v-btn v-if="userStore.user" variant="tonal" class="px-4 mr-2 mr-md-3 mr-lg-6" color="primary" height="44" rounded="xl" @click="logout">
      <template #prepend>
        <v-icon size="x-large" :icon="mdiLogout" />
      </template>
      Odjava
    </v-btn>
  </v-app-bar>
</template>

<style lang="scss" scoped>
:deep(.v-btn[aria-expanded='false'] .v-btn__content i) {
  transition: rotate 0.3s;
}

:deep(.v-btn[aria-expanded='true'] .v-btn__content i) {
  rotate: 180deg;
  transition: rotate 0.3s;
}
.title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 22px;
}
</style>

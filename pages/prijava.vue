<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const valid = ref(true)

async function login() {
  if (!valid.value)
    return
  loading.value = true
  const response = await userStore.login(username.value, password.value)
  if (response.status === 200)
    router.push('/')

  loading.value = false
}
</script>

<template>
  <!-- {{ userStore.user.username }} -->
  <v-container class="h-100 d-flex align-center justify-center">
    <v-card class="pa-4" width="300" elevation="4">
      <h1 class="mb-2">
        Prijava
      </h1>
      <v-form v-model="valid">
        <v-text-field
          v-model="username"
          label="Uporabniško ime"
          color="primary"
          variant="outlined"
          :rules="[v => !!v || 'Polje je obvezno']"
          @keyup.enter="login()"
        />
        <v-text-field
          v-model="password"
          class="mt-2"
          label="Geslo"
          color="primary"
          variant="outlined"
          type="password"
          :rules="[v => !!v || 'Polje je obvezno']"
          @keyup.enter="login()"
        />
        <v-btn :loading="loading" :disabled="!valid" class="mt-3" @click="login()">
          Prijava
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>

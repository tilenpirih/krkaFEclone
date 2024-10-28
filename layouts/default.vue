<template>
  <v-app class="bg-surface">
    <snackbar />
    <navbar />
    <v-main class="mx-2 mx-md-3 mx-lg-6">
      <v-container class="bg-background" fluid style="border-radius: 16px; height: calc(100% - 60px)">
        <slot />
      </v-container>
      <footers />
    </v-main>
  </v-app>
</template>
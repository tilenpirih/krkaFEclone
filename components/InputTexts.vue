<script setup lang="ts">
import { mdiPlus } from '@mdi/js'
import type { customText } from '@/types'

const modelValue = defineModel<customText[]>({
  default: () => [],
})

function addText() {
  modelValue.value.push({ text: 'Besedilo', xMargin: 0, yMargin: 0, size: 50, color: '#000000', bold: false, italic: false, underline: false, justify: 'center', xSize: 100, opacity: 100, font: 'Poppins' })
}
function removeText(index: number) {
  modelValue.value.splice(index, 1)
}
</script>

<template>
  <div>
    <v-row>
      <v-col v-for="(text, index) in modelValue" :key="index" cols="12" sm="6" md="4" xl="3">
        <input-text :model-value="text" :index="index" @remove-text="removeText" />
      </v-col>
      <v-col cols="12" sm="6" md="4" xl="3">
        <v-card class="pa-3 h-100 d-flex justify-center align-center flex-column">
          <v-btn size="large" :icon="mdiPlus" @click.stop="addText()" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
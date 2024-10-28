<script setup lang="ts">
import { mdiPlus } from '@mdi/js'
import type { customImage } from '@/types'
import 'vue-advanced-cropper/dist/style.css'
import { useResolutionStore } from '@/store/resolution'

const modelValue = defineModel<customImage[]>({
  default: () => [],
})

const resolutionStore = useResolutionStore()

function addImage() {
  modelValue.value.push({ originalFile: { name: null, url: null }, croppedFile: { url: null, coordinates: null }, width: resolutionStore.selectedWidth, height: resolutionStore.selectedHeight, xMargin: 0, yMargin: 0, darken: 100, opacity: 100, fit: 'cover' })
}
function moveImage({ index, direction }: { index: number, direction: 'left' | 'right' }) {
  if (index < 0 || index >= modelValue.value.length) {
    console.error('Index out of bounds')
    return
  }

  if (direction === 'left') {
    if (index === 0) {
      console.error('Cannot move left from the first element')
      return
    }
    [modelValue.value[index - 1], modelValue.value[index]] = [modelValue.value[index], modelValue.value[index - 1]]
  }
  else if (direction === 'right') {
    if (index === modelValue.value.length - 1) {
      console.error('Cannot move right from the last element')
      return
    }
    [modelValue.value[index + 1], modelValue.value[index]] = [modelValue.value[index], modelValue.value[index + 1]]
  }
}

function removeImage(index: number) {
  modelValue.value.splice(index, 1)
}
</script>

<template>
  <div>
    <v-row>
      <v-col v-for="(image, index) in modelValue" :key="index" cols="12" sm="6" md="4" xl="3">
        <input-image v-model="modelValue[index]" :index="index" @move-image="moveImage" @remove-image="removeImage" />
      </v-col>
      <v-col cols="12" sm="6" md="4" xl="3">
        <v-card class="pa-3 h-100 d-flex justify-center align-center flex-column">
          <v-btn size="large" :icon="mdiPlus" @click.stop="addImage()" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
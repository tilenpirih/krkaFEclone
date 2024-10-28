<script setup lang="ts">
import { mdiArrowLeft, mdiArrowRight, mdiCog, mdiDelete, mdiImageMinus, mdiImagePlus, mdiPaperclip } from '@mdi/js'
import { Cropper } from 'vue-advanced-cropper'
import type { Config } from '@imgly/background-removal'
import { removeBackground } from '@imgly/background-removal'
import type { customImage } from '@/types'
import { useResolutionStore } from '@/store/resolution'
import 'vue-advanced-cropper/dist/style.css'

defineProps(['index'])
defineEmits(['moveImage', 'removeImage'])
const modelValue = defineModel<customImage>({
  default: () => ({ file: null, width: 100, height: 100, xMargin: 0, yMargin: 0, fit: 'cover' }),
})
const config: Config = {
  device: 'gpu',
  output: {
    format: 'image/webp',
  },
}

const resolutionStore = useResolutionStore()
const croper = ref<any>(null)
const image = ref<any>(null)
const blob = ref<string | null >(null)
const isBackground = ref(false)
const expandSettings = ref(true)

const aspectRatio = computed(() => {
  if (isBackground.value)
    return resolutionStore.selectedWidth / resolutionStore.selectedHeight
  return null
})

async function filesAdded() {
  expandSettings.value = true
  await nextTick()
  if (!image.value)
    return
  blob.value = URL.createObjectURL(image.value)
  modelValue.value.originalFile.url = blob.value
  modelValue.value.originalFile.name = image.value.name
  await nextTick()
  croper.value.setCoordinates(({ imageSize }: { imageSize: { width: number, height: number } }) => ({
    width: imageSize.width,
    height: imageSize.height,
  }))
}

const removingBackground = ref(false)
const originalFile = ref<string | null>(null)
async function rmBackground() {
  if (!modelValue.value.originalFile.url)
    return
  try {
    removingBackground.value = true
    const response = await fetch(modelValue.value.originalFile.url)
    const blob2 = await response.blob()
    const response2 = await removeBackground(blob2, config)
    const url = URL.createObjectURL(response2)
    originalFile.value = modelValue.value.originalFile.url
    modelValue.value.originalFile.name = modelValue.value.originalFile.name.replace(/\.[^/.]+$/, ".webp")
    blob.value = url
    modelValue.value.originalFile.url = url
    removingBackground.value = false
    croper.value.setCoordinates(() => ({
      width: modelValue.value.croppedFile.coordinates.width,
      height: modelValue.value.croppedFile.coordinates.height,
      left: modelValue.value.croppedFile.coordinates.left,
      top: modelValue.value.croppedFile.coordinates.top,
    }))
  }
  catch (e) {
    removingBackground.value = false
  }
}
function setBackgroundBack() {
  if (originalFile.value) {
    modelValue.value.originalFile.url = originalFile.value
    blob.value = originalFile.value
    croper.value.setCoordinates(() => ({
      width: modelValue.value.croppedFile.coordinates.width,
      height: modelValue.value.croppedFile.coordinates.height,
      left: modelValue.value.croppedFile.coordinates.left,
      top: modelValue.value.croppedFile.coordinates.top,
    }))
    originalFile.value = null
  }
}

function isBackgroundChange() {
  if (isBackground.value) {
    modelValue.value.width = resolutionStore.selectedWidth
    modelValue.value.height = resolutionStore.selectedHeight
    modelValue.value.fit = 'cover'
    modelValue.value.xMargin = 0
    modelValue.value.yMargin = 0
  }
}
async function cropImage(data: { coordinates: any, image: any, visibleArea: any, imageTransforms: any }) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx)
    return

  const { width, height, left, top } = data.coordinates
  const img = new Image()

  img.src = data.image.src

  img.onload = () => {
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, left, top, width, height, 0, 0, width, height)
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        if (!modelValue.value)
          return null
        modelValue.value.croppedFile.url = url
        modelValue.value.croppedFile.coordinates = data.coordinates
      }
    })
  }
}
onMounted(async () => {
  await setFiles()
  // expandSettings.value = false
})
async function setFiles() {
  if (typeof modelValue.value.originalFile.url === 'string') {
    try {
      const response = await fetch(modelValue.value.originalFile.url)
      const blob2 = await response.blob()
      const file = new File([blob2], modelValue.value.originalFile?.name || 'slika', { type: blob2.type })
      blob.value = URL.createObjectURL(blob2)
      modelValue.value.originalFile.url = blob.value
      image.value = file
      await nextTick()
      if (modelValue.value.croppedFile.coordinates) {
        croper.value.setCoordinates(() => ({
          width: modelValue.value.croppedFile.coordinates.width,
          height: modelValue.value.croppedFile.coordinates.height,
          left: modelValue.value.croppedFile.coordinates.left,
          top: modelValue.value.croppedFile.coordinates.top,
        }))
      }
    }
    catch (error) {
      console.error('Error fetching the image file:', error)
    }
  }
}
onUpdated(async () => {
  await setFiles()
})
</script>

<template>
  <v-card class="pa-3">
    <v-file-input
      v-model="image"
      hide-details
      :clearable="false"
      label="Naloži sliko"
      prepend-icon=""
      accept="image/*"
      :prepend-inner-icon="mdiPaperclip"
      :append-icon="mdiCog"
      @update:model-value="filesAdded()"
      @click:append="expandSettings = !expandSettings"
    />
    <v-expand-transition>
      <div v-show="expandSettings">
        <cropper
          v-if="image"
          ref="croper"
          class="mt-3"
          style="max-height: 200px"
          :src="blob"
          :stencil-props="{
            aspectRatio,
          }"
          @change="cropImage"
        />
        <div v-if="image" class="mt-1">
          <div class="d-flex justify-space-between">
            <div>
              <v-btn :icon="mdiArrowLeft" size="small" @click="$emit('moveImage', { index, direction: 'left' })" />
              <v-btn :icon="mdiArrowRight" size="small" class="ml-2" @click="$emit('moveImage', { index, direction: 'right' })" />
            </div>
            <v-tooltip v-if="!originalFile" text="Odstrani ozadje" location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" :icon="mdiImageMinus" size="small" :loading="removingBackground" @click="rmBackground()" />
              </template>
            </v-tooltip>
            <v-tooltip v-else text="Dodaj ozadje" location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" :icon="mdiImagePlus" size="small" @click="setBackgroundBack()" />
              </template>
            </v-tooltip>
            <v-btn :icon="mdiDelete" size="small" color="danger" class="ml-2" @click="$emit('removeImage', index)" />
          </div>
          <v-checkbox v-model="isBackground" label="Slika je ozadje" hide-details @change="isBackgroundChange()" />
          <div class="d-flex justify-center my-2">
            <v-btn class="rounded-e-0" :variant="modelValue.fit === 'cover' ? 'flat' : 'tonal'" :disabled="isBackground" @click.stop="modelValue.fit = 'cover'">
              Prekrij
            </v-btn>
            <v-btn class="rounded-s-0" :variant="modelValue.fit === 'contain' ? 'flat' : 'tonal'" :disabled="isBackground" @click.stop="modelValue.fit = 'contain'">
              Prilagodi
            </v-btn>
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.width" min="0" :max="resolutionStore.selectedWidth" step="1" hide-details :disabled="isBackground" />
            <v-text-field v-model="modelValue.width" label="Širina" density="compact" hide-details suffix="px" class="ml-3" max-width="100" :disabled="isBackground" />
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.height" min="0" :max="resolutionStore.selectedHeight" step="1" hide-details :disabled="isBackground" />
            <v-text-field v-model="modelValue.height" label="Višina" density="compact" hide-details suffix="px" class="ml-3" max-width="100" :disabled="isBackground" />
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.xMargin" min="0" :max="resolutionStore.selectedHeight" step="1" hide-details :disabled="isBackground" />
            <v-text-field v-model="modelValue.xMargin" label="X odmik" density="compact" hide-details suffix="px" class="ml-3" max-width="100" :disabled="isBackground" />
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.yMargin" min="0" :max="resolutionStore.selectedHeight" step="1" hide-details :disabled="isBackground" />
            <v-text-field v-model="modelValue.yMargin" label="Y odmik" density="compact" hide-details suffix="px" class="ml-3" max-width="100" :disabled="isBackground" />
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.darken" min="0" max="100" step="1" hide-details />
            <v-text-field v-model="modelValue.darken" label="Svetlost" density="compact" hide-details suffix="%" class="ml-3" max-width="100" />
          </div>
          <div class="d-flex mt-2">
            <v-slider v-model="modelValue.opacity" min="0" max="100" step="1" hide-details />
            <v-text-field v-model="modelValue.opacity" label="Prosojnost" density="compact" hide-details suffix="%" class="ml-3" max-width="100" />
          </div>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped lang="scss">
:deep(.v-field__input) {
  text-wrap: nowrap;
  overflow: hidden;
}
</style>
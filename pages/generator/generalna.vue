<script setup lang="ts">
import html2canvas from 'html2canvas'
import { useResolutionStore } from '@/store/resolution'
import { useTemplateStore } from '~/store/template'
import type { customImage, customText } from '@/types'

const resolutionStore = useResolutionStore()
const templateStore = useTemplateStore()
const route = useRoute()
const router = useRouter()

const texts = ref<customText[]>([])
const images = ref<customImage[]>([])
const themeName = ref('')

const runtimeConfig = useRuntimeConfig()

onMounted(async () => {
  const query = route.query
  if (!query.template || Number.isNaN(Number(query.template)))
    return
  const template = await templateStore.getTemplate(Number(query.template)) as any
  if (!template)
    return
  themeName.value = template.name
  images.value = template.data.images
  texts.value = template.data.texts
  resolutionStore.selectedWidth = template.width || 1080
  resolutionStore.selectedHeight = template.height || 1350
})

const containerStyle = computed(() => ({
  'width': `${resolutionStore.selectedWidth}px`,
  'height': `${resolutionStore.selectedHeight}px`,
  'scale': `${resolutionStore.containerWidth / resolutionStore.selectedWidth}`,
  'margin-left': `${resolutionStore.marginLeft}px`,
}))
const htmlContainer = ref<HTMLElement | null>(null)
const originalScale = ref<boolean>(false)
const previewWindow = ref<Window | null>(null)
const saveModal = ref(false)

async function downloadImage() {
  originalScale.value = true
  await nextTick()
  const container = htmlContainer.value
  if (!container)
    return

  const canvas = await html2canvas(container, { allowTaint: false, useCORS: true, backgroundColor: null, scale: 1 })
  const link = document.createElement('a')
  link.download = `Generalna.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
  originalScale.value = false
}

const savingTheme = ref(false)
async function saveTheme() {
  savingTheme.value = true
  originalScale.value = true
  await nextTick()
  const container = htmlContainer.value
  if (!container) {
    saveModal.value = false
    savingTheme.value = false
    return
  }
  const canvas = await html2canvas(container, { allowTaint: false, useCORS: true, backgroundColor: null, scale: 1 })
  const base64Image = canvas.toDataURL('image/png')
  originalScale.value = false
  if (route.query.template) {
    if (typeof route.query.template !== 'string')
      return
    await templateStore.updateTemplate(route.query.template, themeName.value, texts.value, images.value, resolutionStore.selectedWidth, resolutionStore.selectedHeight, {}, 'generalna', base64Image)
    templateStore.templates = []
    router.push('/')
  }
  else {
    await templateStore.addTemplate(themeName.value, texts.value, images.value, resolutionStore.selectedWidth, resolutionStore.selectedHeight, {}, 'generalna', base64Image)
    templateStore.templates = []
    router.push('/')
  }
  saveModal.value = false
  savingTheme.value = false
}

function generatePreviewHTML() {
  const container = htmlContainer.value
  if (!container)
    return ''
  const clonedContainer = container.cloneNode(true) as HTMLElement
  clonedContainer.style.width = `${resolutionStore.selectedWidth}px`
  clonedContainer.style.minWidth = `${resolutionStore.selectedWidth}px`
  clonedContainer.style.height = `${resolutionStore.selectedHeight}px`
  clonedContainer.style.minHeight = `${resolutionStore.selectedHeight}px`
  clonedContainer.style.scale = `0.4`
  clonedContainer.style.marginLeft = `0px`
  const htmlContent = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          @font-face {
            font-family: 'Tomarik Brush';
            src: url('${runtimeConfig.public.BASE_URL}/fonts/Tomarik-Brush.woff2') format('woff2'),
          }
          
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        ${clonedContainer.outerHTML}
      </body>
    </html>
  `
  return htmlContent
}
function openPreviewWindow() {
  const previewHTML = generatePreviewHTML()
  const previewWindowFeatures = `width=${resolutionStore.selectedWidth / 2.4},height=${resolutionStore.selectedHeight / 2.4}`
  previewWindow.value = window.open('', '_blank', previewWindowFeatures)
  if (previewWindow.value) {
    previewWindow.value.document.body.innerHTML = previewHTML
  }
}

async function updatePreviewWindow() {
  if (previewWindow.value) {
    await nextTick()
    const previewHTML = generatePreviewHTML()
    previewWindow.value.document.body.innerHTML = previewHTML
  }
}
onBeforeUnmount(() => {
  if (previewWindow.value) {
    previewWindow.value.close()
  }
})
watch(texts, updatePreviewWindow, { deep: true })
watch(images, updatePreviewWindow, { deep: true })
</script>

<template>
  <div>
    <h2>Resolucija</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="resolutionStore.selectedWidth" label="Širina" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="resolutionStore.selectedHeight" label="Širina" />
      </v-col>
    </v-row>
    <h2>Napisi</h2>
    <input-texts v-model="texts" />
    <v-divider class="my-3" />
    <h2>Slike</h2>
    <input-images v-model="images" />
    <v-btn class="mr-3 mt-3" @click.stop="downloadImage()">
      Shrani sliko
    </v-btn>
    <v-btn class="mr-3 mt-3" @click.stop="openPreviewWindow()">
      Predogled
    </v-btn>
    <v-btn class="mr-3 mt-3" @click.stop="saveModal = !saveModal">
      {{ route.query.template ? 'Posodobi' : 'Shrani' }} temo
    </v-btn>
    <div v-if="images.length !== 0 || texts.length !== 0" ref="htmlContainer" style="position: relative; overflow: hidden;" class="mt-3 htmlContainer" :class="{ originalScale }" :style="containerStyle">
      <div v-for="(image, index) in images" :key="index" style="position: absolute; height: 100%; width: 100%;">
        <div
          style="background-repeat: no-repeat;"
          :style="`
            background-image: url('${image.croppedFile.url}');
            height: ${image.height}px;
            width:${image.width}px;
            background-size: ${image.fit};
            margin-left:${image.xMargin}px;
            margin-top:${image.yMargin}px;
            filter: brightness(${image.darken}%);
            opacity: ${image.opacity / 100};
          `"
        />
      </div>
      <div v-for="(text, index) in texts" :key="index" style="position: absolute; height: 100%; width: 100%;">
        <div
          style="line-height: normal; display: flex; text-align: center;"
          :style="`
          margin-top:${text.yMargin}px;
          margin-left:${text.xMargin}px;
          font-size: ${text.size}px;
          width: ${text.xSize}%;
          color: ${text.color};
          justify-content: ${text.justify};
          text-align: center;
          font-weight: ${text.bold ? 'bold' : 'normal'};
          font-style: ${text.italic ? 'italic' : 'normal'};
          text-decoration: ${text.underline ? 'underline' : 'none'};
          opacity: ${text.opacity / 100};
          font-family: '${text.font}';
        `"
        >
          {{ text.text }}
        </div>
      </div>
    </div>
    <v-dialog v-model="saveModal" width="auto">
      <v-card class="pa-3" min-width="300">
        <h2 class="mb-2">
          {{ route.query.template ? 'Posodobi' : 'Shrani' }} temo
        </h2>
        <v-text-field v-model="themeName" label="Ime teme" />
        <v-btn :disabled="themeName.length <= 0" :loading="savingTheme" @click="saveTheme()">
          {{ route.query.template ? 'Posodobi' : 'Shrani' }}
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>
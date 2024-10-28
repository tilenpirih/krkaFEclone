<script setup lang="ts">
import html2canvas from 'html2canvas'
import { useResolutionStore } from '@/store/resolution'
import { useTemplateStore } from '~/store/template'
import type { customImage, customText } from '@/types'
import type { Competition, Match } from '@/store/kzs'
import { useKZSStore } from '@/store/kzs'

const templateStore = useTemplateStore()
const resolutionStore = useResolutionStore()
const kzsStore = useKZSStore()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const texts = ref<customText[]>([])
const images = ref<customImage[]>([])
const templateName = ref('')
const templateData = ref({
  selectedSeason: null as number | null,
  selectedCompetition: null as Competition | null,
  selectedMatch: null as Match | null,
})

const loadingSeasons = ref(true)
const loadingCompetitions = ref(true)
const loadingMatches = ref(true)
const competitions = ref<Competition[]>([])
const matches = ref<Match[]>([])

onMounted(async () => {
  if (kzsStore.seasons.length === 0)
    await kzsStore.getSeasons()
  loadingSeasons.value = false
  const query = route.query
  if (query.template) {
    const template = await templateStore.getTemplate(Number(query.template)) as any
    templateName.value = template.name
    images.value = template.data.images
    texts.value = template.data.texts
    templateData.value = template.templateData
    if (templateData.value.selectedSeason) {
      competitions.value = await kzsStore.getCompetitions(templateData.value.selectedSeason)
    }
    loadingCompetitions.value = false
    if (templateData.value.selectedCompetition) {
      matches.value = await kzsStore.getMatches({ seasonId: templateData.value.selectedSeason, competitionId: templateData.value.selectedCompetition.id, statuses: 'FINISHED,ENDED' })
    }
    loadingMatches.value = false
  }
  else {
    const activeSeason = kzsStore.seasons.find(season => season.active)
    templateData.value.selectedSeason = activeSeason?.id || 0
    loadingSeasons.value = false
    competitions.value = await kzsStore.getCompetitions(templateData.value.selectedSeason)
    loadingCompetitions.value = false
    loadingMatches.value = false
  }
})

async function changeSeason() {
  templateData.value.selectedCompetition = null
  templateData.value.selectedMatch = null
  if (!templateData.value.selectedSeason)
    return
  loadingCompetitions.value = true
  competitions.value = await kzsStore.getCompetitions(templateData.value.selectedSeason)
  loadingCompetitions.value = false
}

async function changeCompetition() {
  templateData.value.selectedMatch = null
  loadingMatches.value = true
  if (!templateData.value.selectedSeason || !templateData.value.selectedCompetition)
    return
  matches.value = await kzsStore.getMatches({ seasonId: templateData.value.selectedSeason, competitionId: templateData.value.selectedCompetition.id, statuses: 'FINISHED,ENDED' })
  loadingMatches.value = false
}

function changeMatch() {
  if (!templateData.value.selectedMatch)
    return
  texts.value = []
  const ekipa1Index = images.value.findIndex(image => image.originalFile.name === 'Ekipa1.png')
  if (ekipa1Index !== -1) {
    images.value.splice(ekipa1Index, 1)
    images.value.splice(ekipa1Index, 0, { originalFile: { name: 'Ekipa1.png', url: `${runtimeConfig.public.API_URL}/getKzsImage?image_uuid=${templateData.value.selectedMatch.firstTeamLogoUuid}` }, croppedFile: { url: null, coordinates: { width: 80000, height: 80000, left: 96, top: 0 } }, width: 300, height: 300, xMargin: 0, yMargin: 950, darken: 100, opacity: 100, fit: 'cover' })
  }
  else {
    images.value.push({ originalFile: { name: 'Ekipa1.png', url: `${runtimeConfig.public.API_URL}/getKzsImage?image_uuid=${templateData.value.selectedMatch.firstTeamLogoUuid}` }, croppedFile: { url: null, coordinates: { width: 80000, height: 80000, left: 96, top: 0 } }, width: 300, height: 300, xMargin: 0, yMargin: 950, darken: 100, opacity: 100, fit: 'cover' })
  }
  const ekipa2Index = images.value.findIndex(image => image.originalFile.name === 'Ekipa2.png')
  if (ekipa2Index !== -1) {
    images.value.splice(ekipa2Index, 1)
    images.value.splice(ekipa2Index, 0, { originalFile: { name: 'Ekipa2.png', url: `${runtimeConfig.public.API_URL}/getKzsImage?image_uuid=${templateData.value.selectedMatch.secondTeamLogoUuid}` }, croppedFile: { url: null, coordinates: { width: 80000, height: 80000, left: 96, top: 0 } }, width: 300, height: 300, xMargin: 780, yMargin: 950, darken: 100, opacity: 100, fit: 'cover' })
  }
  else {
    images.value.push({ originalFile: { name: 'Ekipa2.png', url: `${runtimeConfig.public.API_URL}/getKzsImage?image_uuid=${templateData.value.selectedMatch.secondTeamLogoUuid}` }, croppedFile: { url: null, coordinates: { width: 80000, height: 80000, left: 96, top: 0 } }, width: 300, height: 300, xMargin: 780, yMargin: 950, darken: 100, opacity: 100, fit: 'cover' })
  }
  texts.value.push({ text: `${templateData.value.selectedMatch.firstTeamScore}`, xMargin: -580, yMargin: 1025, size: 125, color: '#000000', bold: true, italic: false, underline: false, justify: 'end', opacity: 100, xSize: 100, font: 'Poppins' })
  texts.value.push({ text: `:`, xMargin: 0, yMargin: 1015, size: 125, color: '#000000', bold: true, italic: false, underline: false, justify: 'center', opacity: 100, xSize: 100, font: 'Poppins' })
  texts.value.push({ text: `${templateData.value.selectedMatch.secondTeamScore}`, xMargin: 580, yMargin: 1025, size: 125, color: '#000000', bold: true, italic: false, underline: false, justify: 'start', opacity: 100, xSize: 100, font: 'Poppins' })
  texts.value.push({ text: templateData.value.selectedMatch.competitionName, xMargin: 0, yMargin: 20, size: 70, color: '#fff', bold: false, italic: false, underline: false, justify: 'center', opacity: 100, xSize: 100, font: 'Poppins' })
  texts.value.push({ text: `${templateData.value.selectedMatch.round}. kolo`, xMargin: 0, yMargin: 1170, size: 50, color: '#000000', bold: true, italic: false, underline: false, justify: 'center', opacity: 100, xSize: 100, font: 'Poppins' })
}

const containerStyle = computed(() => ({
  'width': `${resolutionStore.selectedWidth}px`,
  'height': `${resolutionStore.selectedHeight}px`,
  'scale': `${resolutionStore.containerWidth / resolutionStore.selectedWidth}`,
  'margin-left': `${resolutionStore.marginLeft}px`,
}))
const htmlContainer = ref<HTMLElement | null>(null)
const originalScale = ref<boolean>(false)
const previewWindow = ref<Window | null>(null)

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

const saveModal = ref(false)
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
    await templateStore.updateTemplate(route.query.template, templateName.value, texts.value, images.value, resolutionStore.selectedWidth, resolutionStore.selectedHeight, templateData.value, 'rezultat_tekme', base64Image)
    templateStore.templates = []
    router.push('/')
  }
  else {
    await templateStore.addTemplate(templateName.value, texts.value, images.value, resolutionStore.selectedWidth, resolutionStore.selectedHeight, templateData.value, 'rezultat_tekme', base64Image)
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
    <v-row>
      <v-col cols="12" xs="12" sm="6" lg="4">
        <v-autocomplete
          v-model="templateData.selectedSeason"
          :loading="loadingSeasons"
          :disabled="loadingSeasons"
          :items="kzsStore.seasons"
          label="Izberi sezono"
          item-title="name"
          item-value="id"
          variant="outlined"
          color="primary"
          hide-details
          class="mb-3"
          clearable
          no-data-text="Ni sezon"
          auto-select-first
          @update:model-value="changeSeason()"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="6" lg="4">
        <v-autocomplete
          v-model="templateData.selectedCompetition"
          :loading="loadingCompetitions"
          :disabled="loadingCompetitions || !templateData.selectedSeason"
          :items="competitions"
          label="Izberi tekmovanje"
          item-title="name"
          variant="outlined"
          color="primary"
          hide-details
          class="mb-3"
          clearable
          no-data-text="Ni tekmovanj"
          auto-select-first
          return-object
          @update:model-value="changeCompetition()"
        />
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          v-model="templateData.selectedMatch"
          :loading="loadingMatches && !!templateData.selectedCompetition"
          :disabled="loadingMatches || !templateData.selectedCompetition"
          :items="matches"
          label="Izberi tekmo"
          item-title="title"
          variant="outlined"
          color="primary"
          return-object
          hide-details
          clearable
          no-data-text="Ni tekem"
          auto-select-first
          @update:model-value="changeMatch()"
        />
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
        <v-text-field v-model="templateName" label="Ime teme" />
        <v-btn :disabled="templateName.length <= 0" :loading="savingTheme" @click="saveTheme()">
          {{ route.query.template ? 'Posodobi' : 'Shrani' }}
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>
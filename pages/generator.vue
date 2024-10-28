<script setup lang="ts">
import { useResolutionStore } from '@/store/resolution'

definePageMeta({
  middleware: ['auth'],
})

const resolutionStore = useResolutionStore()
const templates = ref<{ name: string, path: string, width: number, height: number }[]>([
  { name: 'Generalna', path: 'generalna', width: 1080, height: 1350 },
  { name: 'Napoved tekme', path: 'napoved_tekme', width: 1080, height: 1350 },
  { name: 'Rezultat tekme', path: 'rezultat_tekme', width: 1080, height: 1350 },
])
const selectedTemplate = ref<{ name: string, path: string, width: number, height: number } | null>(null)
const router = useRouter()
const route = useRoute()

const container = ref<HTMLElement | null>(null)
function onResize() {
  if (!container.value)
    return
  let width = (container.value as any).$el.offsetWidth - 32
  let marginLeft = 0
  if (width >= 600 && width < 1280) {
    marginLeft = width / 6
    width = width / 1.5
  }
  else if (width >= 1280 && width < 1920) {
    marginLeft = width / 4
    width = width / 2
  }
  else if (width >= 1920) {
    marginLeft = width / 6
    width = width / 3
  }
  resolutionStore.marginLeft = marginLeft
  resolutionStore.containerWidth = width
}

function changeTemplate() {
  const params = route.params
  const path = selectedTemplate.value?.path || ''
  router.push({ path: `/generator/${path}`, query: params })
  resolutionStore.selectedWidth = selectedTemplate.value?.width || 0
  resolutionStore.selectedHeight = selectedTemplate.value?.height || 0
}

const currentPath = router.currentRoute.value.path.split('/').pop()
if (currentPath) {
  const template = templates.value.find(template => template.path === currentPath)
  if (template) {
    selectedTemplate.value = template
    resolutionStore.selectedWidth = template.width
    resolutionStore.selectedHeight = template.height
  }
}
</script>

<template>
  <v-container ref="container" v-resize="onResize">
    <v-autocomplete
      v-model="selectedTemplate"
      :items="templates"
      label="Izberi temo"
      item-title="name"
      hide-details
      return-object
      @update:model-value="changeTemplate()"
    />
    <v-divider v-if="selectedTemplate" class="my-3" />
    <nuxt-page />
  </v-container>
</template>

<style scoped>

</style>

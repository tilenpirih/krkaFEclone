<script setup lang="ts">
import { useTemplateStore } from '~/store/template'
import type { customTemplate } from '~/types'

definePageMeta({
  middleware: ['auth'],
})
const templateStore = useTemplateStore()
const router = useRouter()
const templates = ref<customTemplate[]>([])

onMounted(async () => {
  templates.value = await templateStore.getTemplates()
})

function deletedTemplate(id: number) {
  templates.value = templates.value.filter(template => template.id !== id)
}
</script>

<template>
  <v-container>
    <div class="d-flex">
      <h2>Bližnjice</h2>
      <v-btn class="ml-3" @click.stop="router.push(`/generator`)">
        Generator
      </v-btn>
    </div>
    <v-row class="mt-3">
      <v-col v-for="template in templates" :key="template.id" cols="12" sm="6" md="3" lg="3">
        <preview-template :template="template" @deleted-template="deletedTemplate" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>

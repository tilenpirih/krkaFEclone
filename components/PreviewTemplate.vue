<script setup lang="ts">
import { mdiDelete } from '@mdi/js'
import { useTemplateStore } from '~/store/template'

defineProps(['template'])
const emit = defineEmits(['deletedTemplate'])

const router = useRouter()
const templateStore = useTemplateStore()
const runtimeConfig = useRuntimeConfig()

const deleteModal = ref(false)
async function deleteTemplate(id: number) {
  await templateStore.deleteTemplate(id)
  emit('deletedTemplate', id)
  deleteModal.value = false
}
</script>

<template>
  <div class="rounded-lg bg-surface elevation-1 cursor-pointer" @click.stop="router.push(`/generator/${template?.templateName}?template=${template.id}`)">
    <div class="pa-2 d-flex justify-space-between align-center">
      <h3>
        {{ template.name }}
      </h3>
      <v-btn :icon="mdiDelete" size="small" color="danger" @click.stop="deleteModal = true" />
    </div>
    <v-dialog v-model="deleteModal" width="auto">
      <v-card class="pa-3">
        <h3 class="text-center">
          Ali ste prepričani da želite izbrisati temo: {{ template.name }}
        </h3>
        <div class="d-flex mt-4 justify-space-between">
          <v-btn @click="deleteModal = false">
            Prekliči
          </v-btn>
          <v-btn color="danger" @click="deleteTemplate(template.id)">
            Izbriši
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-img :aspect-ratio="template.width / template.height" :src="`${runtimeConfig.public.API_URL}/${template.previewImg}`" />
  </div>
</template>

<style scoped>

</style>
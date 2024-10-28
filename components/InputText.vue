<script setup lang="ts">
import { mdiCog, mdiDelete, mdiFormatAlignCenter, mdiFormatAlignLeft, mdiFormatAlignRight, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiPalette, mdiPlus } from '@mdi/js'
import type { customText } from '@/types'
import { useResolutionStore } from '@/store/resolution'

defineProps(['index'])
const emit = defineEmits(['removeText'])
const modelValue = defineModel<customText>({
  default: () => [],
})

const fonts = ref([
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Tomarik Brush', value: 'Tomarik Brush' },
])
const expandSettings = ref(false)
const resolutionStore = useResolutionStore()

function removeText(index: number) {
  emit('removeText', index)
}
</script>

<template>
  <v-card class="pa-3">
    <v-text-field
      v-model="modelValue.text"
      hide-details
      :label="`Tekst ${index + 1}`"
      :append-icon="mdiCog"
      @click:append="expandSettings = !expandSettings"
    />
    <v-expand-transition>
      <div v-if="expandSettings">
        <div class="d-flex justify-space-between mt-2">
          <div class="d-flex">
            <v-btn size="small" :icon="mdiFormatAlignLeft" class="rounded rounded-e-0 pa-0" :variant="modelValue.justify === 'start' ? 'flat' : 'tonal'" @click.stop="modelValue.justify = 'start'" />
            <v-btn size="small" :icon="mdiFormatAlignCenter" class="rounded-0 pa-0" :variant="modelValue.justify === 'center' ? 'flat' : 'tonal'" @click.stop="modelValue.justify = 'center'" />
            <v-btn size="small" :icon="mdiFormatAlignRight" class="rounded rounded-s-0 pa-0" :variant="modelValue.justify === 'end' ? 'flat' : 'tonal'" @click.stop="modelValue.justify = 'end'" />
          </div>
          <v-btn :icon="mdiDelete" size="small" color="danger" @click.stop="removeText(index)" />
        </div>
        <v-select v-model="modelValue.font" item-title="name" item-value="value" :items="fonts" label="Font" hide-details class="mt-3" density="compact" />
        <div class="d-flex justify-space-between my-2">
          <div class="d-flex">
            <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn v-bind="props" :color="modelValue.color">
                  <v-icon :icon="mdiPalette" />
                </v-btn>
              </template>
              <v-card>
                <v-color-picker v-model="modelValue.color" mode="hex" />
              </v-card>
            </v-menu>
          </div>
          <div class="d-flex">
            <v-btn :icon="mdiFormatBold" class="rounded" size="small" :variant="modelValue.bold ? 'flat' : 'tonal'" @click.stop="modelValue.bold = !modelValue.bold" />
            <v-btn :icon="mdiFormatItalic" class="rounded mx-1" size="small" :variant="modelValue.italic ? 'flat' : 'tonal'" @click.stop="modelValue.italic = !modelValue.italic" />
            <v-btn :icon="mdiFormatUnderline" class="rounded" size="small" :variant="modelValue.underline ? 'flat' : 'tonal'" @click.stop="modelValue.underline = !modelValue.underline" />
          </div>
        </div>
        <div class="d-flex mt-2">
          <v-slider v-model="modelValue.size" min="1" max="200" step="1" hide-details />
          <v-text-field v-model="modelValue.size" label="Velikost" density="compact" hide-details suffix="px" class="ml-3" max-width="100" />
        </div>
        <div class="d-flex mt-2">
          <v-slider v-model="modelValue.xSize" min="0" max="100" step="1" hide-details />
          <v-text-field v-model="modelValue.xSize" label="Širina" density="compact" hide-details suffix="%" class="ml-3" max-width="100" />
        </div>
        <div class="d-flex mt-2">
          <v-slider v-model="modelValue.xMargin" :min="-resolutionStore.selectedWidth" :max="resolutionStore.selectedWidth" step="1" hide-details />
          <v-text-field v-model="modelValue.xMargin" label="X" density="compact" hide-details suffix="px" class="ml-3" max-width="100" />
        </div>
        <div class="d-flex mt-2">
          <v-slider v-model="modelValue.yMargin" min="0" :max="resolutionStore.selectedHeight" step="1" hide-details />
          <v-text-field v-model="modelValue.yMargin" label="Y" density="compact" hide-details suffix="px" class="ml-3" max-width="100" />
        </div>
        <div class="d-flex mt-2">
          <v-slider v-model="modelValue.opacity" min="0" max="100" step="1" hide-details />
          <v-text-field v-model="modelValue.opacity" label="Prosojnost" density="compact" hide-details suffix="%" class="ml-3" max-width="100" />
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>

</style>
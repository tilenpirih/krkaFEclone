import { axios } from '~/composables/useApiFetch'
import type { customImage, customTemplate, customText } from '@/types'

export const useTemplateStore = defineStore('template', {
  state: () => ({
    templates: [] as customTemplate[],
  }),
  actions: {
    async getTemplates() {
      try {
        if(this.templates.length > 0)
          return this.templates
        const response = await axios('/template/templates')
        const API_URL = useRuntimeConfig().public.API_URL
        for (const template of response.data) {
          for (const image of template.data.images) {
            image.originalFile.url = `${API_URL}/${image.originalFile.url}`
            image.croppedFile.url = null
          }
        }
        this.templates = response.data
        return response.data
      }
      catch (error) {
        return []
      }
    },
    async addTemplate(name: string, texts: customText[], images: customImage[], width: number, height: number, templateData: any, templateName: string, previewImg: string) {
      for (const image of images) {
        if (image.originalFile.url) {
          const blob = await urlToBase64(image.originalFile.url)
          image.originalFile.base64 = blob
        }
      }
      await axios('/template/template', {
        method: 'POST',
        data: { name, texts, images, width, height, templateData, templateName, previewImg },
      })
    },
    async updateTemplate(templateId: number | string, name: string, texts: customText[], images: customImage[], width: number, height: number, templateData: any, templateName: string, previewImg: string) {
      for (const image of images) {
        if (image.originalFile.url) {
          const blob = await urlToBase64(image.originalFile.url)
          image.originalFile.base64 = blob
        }
      }
      await axios(`/template/template/${templateId}`, {
        method: 'PUT',
        data: { name, texts, images, width, height, templateData, templateName, previewImg },
      })
    },
    async getTemplate(id: number) {
      if (this.templates.length === 0)
        await this.getTemplates()
      const template = this.templates.find(template => template.id === id) as any
      if (!template)
        return null
      return this.templates.find(template => template.id === id)
    },

    async deleteTemplate(id: number) {
      try {
        await axios(`/template/template/${id}`, {
          method: 'DELETE',
        })
        this.templates = this.templates.filter(template => template.id !== id)
      }
      catch (error) {
        console.error('Failed to delete template:', error)
      }
    },
  },
})

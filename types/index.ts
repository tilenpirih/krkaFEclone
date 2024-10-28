export interface customText {
  text: string
  xSize: number
  xMargin: number
  yMargin: number
  justify: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  size: number
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  opacity: number
  font: string
}

export interface customImage {
  width: number
  height: number
  xMargin: number
  yMargin: number
  darken: number
  opacity: number
  fit: 'contain' | 'cover'
  originalFile: {
    name: string | null
    url: string | null
    base64?: string
  }
  croppedFile:{
    url: any
    coordinates: any
  }
}

export interface customTemplate {
  name: string
  id?: number
  texts: customText[]
  images: customImage[]
  templateData: any
  previewImg: string
  templateName: string
}
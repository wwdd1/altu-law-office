export enum LANG {
  TR = 'tr'
} 

export const fallbackLng = LANG.TR as string
export const languages = [fallbackLng]
export const defaultNS = ''

export type TranslationOptions = {
  supportedLngs: string[]
  fallbackLng: string
  lng: string
  fallbackNS: string
  defaultNS: string
  ns: string
  returnObjects: boolean
  keyPrefix?: string
} 

export function getOptions (lng: string = fallbackLng, ns: string = defaultNS): TranslationOptions {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    returnObjects: true
  }
}

import { languages, LANG } from '@/i18n/settings'

const languageParams = {
  [LANG.TR]: {
    WOWEL_MAP: {
      "a": "a",
      "e": "e",
      "ı": "a",
      "i": "e",
      "o": "a",
      "ö": "e",
      "u": "a",
      "ü": "e",
    } as Record<string, string>,
    Y: 'y' // how tf I can name this one :D
  }
}

function createPossesiveFormulaForLang(lang: string): (word: string) => string {
  switch(lang) {
    case LANG.TR:
      return (word: string) => {
        const { WOWEL_MAP, Y } = languageParams[LANG.TR]
        let suffix = '`';
        const lastChars = word.substring(word.length - 2).toLowerCase()
        if (lastChars[1] in WOWEL_MAP) {
          suffix += Y + WOWEL_MAP[lastChars[1]]
        } else
        if (lastChars[0] in WOWEL_MAP) {
          suffix += WOWEL_MAP[lastChars[0]]
        }
        return word + suffix
      }
    default:
      return (word: string) => word
  }
}

export function convertToPossesive(word: string, lang: string = languages[0]): string {
  const formula = createPossesiveFormulaForLang(lang)
  return formula(word)
}
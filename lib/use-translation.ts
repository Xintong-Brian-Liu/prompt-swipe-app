import { useLanguage } from './language-context'
import { en } from './translations/en'
import { zh } from './translations/zh'

export function useTranslation() {
  const { language } = useLanguage()
  return language === 'en' ? en : zh
} 
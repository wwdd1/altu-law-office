import classNames from "classnames"
import { v4 as createId } from "uuid"
import { useMemo } from "react"
import Link from "next/link"

import { font_playfair } from "app/ui/fonts"
import Button from "app/ui/components/core/button"
import { IconTitleDescriptionList, iconNumberOrderRenderer } from "app/ui/components/icon-title-desctiption"

import { languages } from "app/i18n/settings"
import { useTranslation } from "app/i18n/client"

type ConsultancyStepTranslation = {
  title: string
  description: string
}

export default function ContactAboutUs() {
  const [lng] = languages
  const { t } = useTranslation(lng)

  const paragraphs = t('need-legal-help.paragraphs') as unknown as string[]
  const items = useMemo(() => {
    const translations = t('consultancy-how-to.steps') as unknown as ConsultancyStepTranslation[]
    return translations.map((item, i) => ({
      id: createId(),
      IconComponent: iconNumberOrderRenderer(i + 1),
      title: item.title,
      description: item.description,
    }))
  }, [])

  return (
    <div className="flex md-w-sidebar:block">
      <div className="flex-1 text-white px-12 py-32 bg-center bg-cover bg-[url('/pardon.jpg')] bg-[#444] bg-blend-multiply">
        <h6 className={classNames([
          'text-3xl mb-12 text-primary',
          font_playfair.className,
        ])}>
          { t('need-legal-help.title') }
        </h6>
        {
          paragraphs.map((pText, key) => (
            <p className="mb-12" key={key}>
              { pText }
            </p>
          ))
        }

        <div className="text-right">
          <Link href="/contact">
            <Button label={t('contact')}></Button>
          </Link>
        </div>
      </div>
      <div className="bg-alternate flex-1 px-12 py-32">
        <h6 className={classNames([
          'text-3xl mb-6',
          font_playfair.className,
        ])}>
          { t('consultancy-how-to.title') }
        </h6>

        <p className={classNames([font_playfair.className])}>
          { t('consultancy-how-to.description') }
        </p>

        <IconTitleDescriptionList items={items} />
      </div>
    </div>
  )
}
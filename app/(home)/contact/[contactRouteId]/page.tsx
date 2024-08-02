import classNames from "classnames"
// import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import SendMessageForm from "@/ui/components/send-message-form"
import { font_playfair } from "@/ui/fonts"
import withTranslations from "@/ui/components/hoc/withTranslations/server"
import { Translations } from "@/ui/components/hoc/withTranslations/types"
import { convertToPossesive } from "@/lib/string"
import { findMemberByFilters } from "@/api/(services)/member"

type Props = {
  params: {
    contactRouteId: string
  }
} & Translations
async function SendMessage({ t, params }: Props) {
  const { contactRouteId } = params

  if (!contactRouteId) {
    return notFound()
  }

  const member = await findMemberByFilters(process.env.COMPANY_ID as string, {
    client_route_id: contactRouteId
  })

  if (!member) {
    return notFound()
  }

  const fullname = `${member.firstname} ${convertToPossesive(member.lastname)}`

  return (
    <div className="min-w-[400px] xs:min-w-full max-w-[800px] mx-auto py-20 px-8">
      <h1 className={classNames([font_playfair.className, 'mb-4 text-2xl'])}>
        { t('contact-form.send-message-to', { name: fullname }) }
      </h1>
      <p className="mb-4">
        { t('contact-form.subheader') }
      </p>
      <SendMessageForm></SendMessageForm>
    </div>
  )
}

export default withTranslations(SendMessage)

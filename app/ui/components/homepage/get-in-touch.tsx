'use client'

import classNames from "classnames"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import Section from "@/ui/components/section"
import Map from "@/ui/components/map"
import IconTitleDescription from "@/ui/components/icon-title-desctiption"
import SendMessageForm from "@/ui/components/send-message-form"
import { font_playfair } from "@/ui/fonts"
import type { Translations } from "@/ui/components/hoc/withTranslations/types"
import withTranslations from "../hoc/withTranslations/client"
import { ContactDto } from "@/lib/dtos"
import { getDayRange, formatWorkHours } from "@/lib/datetime"

import PhoneOutlineSvg from "@/ui/icons/phone-outline.svg"
import MailOutlineSvg from "@/ui/icons/mail-outline.svg"
import ClockSvg from "@/ui/icons/clock.svg"

type Props = {
  className?: string;
} & Translations
function GetInTouch({ className, t }: Props) {
  if (!t) {
    throw new Error('Component needs to be wrapped with withTranslations HOC.')
  }

  const { data: contactData, error } = useQuery({
    queryKey: ['company-contact'],
    queryFn: async (): Promise<ContactDto> => {
      const apiUri = `/api/companies/${process.env.NEXT_PUBLIC_COMPANY_ID}/contact`
      const response = await fetch(apiUri)
      return response.json()
    }
  })
  
  const getInTouchData = useMemo(() => {
    if (!contactData) {
      return []
    }

    const workHours = formatWorkHours({
      startDateStr: contactData?.workhour_start as string,
      endDateStr: contactData?.workhour_end as string,
    })

    const workDays = getDayRange({
      dayIndexes: contactData?.workdays
        .split(',').map(i => Number(i)) as number[],
      t,
    })

    return [{
      id: 'phone',
      IconComponent: PhoneOutlineSvg,
      title: t('phone'),
      description: contactData?.phone_number,
    }, {
      id: 'email',
      IconComponent: MailOutlineSvg,
      title: t('email'),
      description: contactData?.email,
    }, {
      id: 'work-hours',
      IconComponent: ClockSvg,
      title: t('work-hours'),
      description: `${workDays} ${workHours}`,
    }]
  }, [contactData])

  if (error) {
    return <pre>{ error.message }</pre>
  }

  let lat = 0, lng = 0;
  if (contactData) {
    [lat, lng] = contactData?.map_coordinates.split(',').map(n => Number(n))
  }

  return (
    <Section
      header={t('get-in-touch.header')}
      subHeader={t('get-in-touch.subheader')}
      className={classNames(className)}
    >
      <div>
        <Map
          latLng={{lat, lng}}
          address={
            <>
              <p><strong>{ t('altu') } { t('law-office') }</strong></p>
              <p>{ contactData?.address_line_1 }</p>
              <p>{ contactData?.address_line_2 }</p>
            </>
          }
        ></Map>
        <div className="flex flex-wrap gap-32 py-6 mt-8">
          <ul className="[&>*]:mb-6">
            {
              getInTouchData.map(data => (
                <IconTitleDescription key={data.id} { ...data } />
              ))
            }
          </ul>
          <div className="flex-1 min-w-[400px] xs:min-w-full max-w-[800px] ml-auto">
            <h1 className={classNames([font_playfair.className, 'mb-4 text-2xl'])}>
              { t('contact-form.header') }
            </h1>
            <p className="mb-4">
              { t('contact-form.subheader') }
            </p>
            <SendMessageForm></SendMessageForm>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withTranslations(GetInTouch)

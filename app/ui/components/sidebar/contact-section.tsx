import classNames from 'classnames'
import { ReactNode } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import MailSvg from '@/ui/icons/mail.svg'
import { font_mukta } from 'app/ui/fonts'
import withTranslations from '@/ui/components/hoc/withTranslations/client'
import { Translations } from '@/ui/components/hoc/withTranslations/types'
import { getMembers } from '@/queries/member'

type ContactSectionItemProps = {
  icon: ReactNode,
  text: string;
  contactLink: string;
  hoverText: string;
  textClasses?: string;
}
function ContactSectionItem({
  icon,
  text,
  contactLink,
  hoverText,
  textClasses,
}: ContactSectionItemProps) {

  const textDefaultClasses = 'text-right tracking-wider text-primary break-keep whitespace-nowrap'
  return (
    <Link href={contactLink}>
      <li className="border rounded-full border-gray-var-1 flex items-center mx-8 my-2 px-4 py-1 h-10 cursor-pointer parent-hover overflow-hidden relative">
          <span className="w-4 text-primary">
            {icon}
          </span>
          <span className={classNames([
            'flex-1 transition-transform parent-hover:translate-x-full',
            textDefaultClasses,
            textClasses,
          ])}>{ text }</span>
          <span className={classNames([
            textDefaultClasses,
            'text-sm transition-transform translate-x-full absolute parent-hover:-translate-x-[1rem] right-0',
          ])}>{hoverText}</span>
      </li>
    </Link>
  )
}

type Props = {
  className?: string;
} & Translations
function SidebarContactSection({ className, t }: Props) {
  if (!t) {
    throw new Error('Component needs to be wrapped with HOC withTranslations')
  }

  const { data: members, error } = useQuery(getMembers({
    companyId: String(process.env.NEXT_PUBLIC_COMPANY_ID)
  }))

  if (error) {
    return <pre>{ error.message }</pre>;
  }

  return (
    <ul className={classNames([
      font_mukta.className,
      'font-semibold',
      className,
    ])}>
      {
        members?.map(member => (
          <ContactSectionItem
            key={member.id}
            icon={<MailSvg/>}
            contactLink={`/contact/${member.client_route_id}`}
            text={`${t(`_job-prefix.${member.job_prefix}.short`)} ${member.firstname} ${member.lastname}`}
            textClasses="text-xl"
            hoverText={t('contact')}
          />
        ))
      }
      <ContactSectionItem
        icon={<MailSvg/>}
        contactLink="/contact"
        text={'altuhukuk@gmail.com'}
        textClasses="text-xs"
        hoverText={t('send-email')}
      />
    </ul>
  )
}

export default withTranslations(SidebarContactSection)
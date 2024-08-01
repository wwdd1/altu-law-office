'use client'

import { Suspense } from "react"
import { isServer, useQuery } from "@tanstack/react-query"
import classNames from "classnames"

import withTranslations from "../hoc/withTranslations/client"
import type { Translations } from "app/ui/components/hoc/withTranslations/types"
import { font_playfair } from "app/ui/fonts"
import { TeamMemberDto } from "app/lib/dtos"
import TeamMemberItem from "@/ui/components/team-member-card"

type Props = {
  className?: string;
  hideHeader?: boolean;
} & Translations
function OurTeamOverview({
  className,
  hideHeader,
  t,
}: Props) {
  if (!t) {
    throw new Error('Component needs to be wrapped with HOC withTranslations')
  }

  console.log({ isServer })

  const { data: members, error } = useQuery({
    queryKey: ['members'],
    queryFn: async (): Promise<TeamMemberDto[]> => {
      const apiUri= `/api/companies/${process.env.NEXT_PUBLIC_COMPANY_ID}/members`
      const response = await fetch(apiUri)
      return response.json()
    },
  })

  if (error) {
    return <pre>{ error.message }</pre>;
  }

  return (
    <div className={className}>
      {
        !hideHeader ?
          <h4 className={classNames([font_playfair.className, 'uppercase text-center text-4xl font-bold py-24'])}>
            <span className="text-primary">Meet</span> our <span className="text-primary">attorneys</span>
          </h4>
        : ''
      }
      <Suspense fallback={<div>TODOOOOO IMPL THIS!!</div>}>
        <ul className="flex md-w-sidebar:block justify-center py-12 pt-0">
          {
            members?.map(member => (
              <TeamMemberItem
                className="md-w-sidebar:my-12"
                key={member.id}
                imageUri={member.image_uri}
                fullname={`${member.job_prefix} ${member.firstname} ${member.lastname}`}
                jobTitle={member.job_position}
                description={member.about_short}
                routeKey={member.client_route_id}
              ></TeamMemberItem>
            ))
          }
        </ul>
      </Suspense>
    </div>
  )
}

export default  withTranslations(OurTeamOverview)

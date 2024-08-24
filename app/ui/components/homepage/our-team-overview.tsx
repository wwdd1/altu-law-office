'use client'

import { Suspense } from "react"
import classNames from "classnames"
import { useQuery } from "@tanstack/react-query"

import withTranslations from "@/ui/components/hoc/withTranslations/client"
import type { Translations } from "app/ui/components/hoc/withTranslations/types"
import { font_playfair } from "app/ui/fonts"
import TeamMemberItem from "@/ui/components/team-member-card"
import { getMembers } from "@/queries/member"

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

  const { data: members, error } = useQuery(getMembers({
    companyId: String(process.env.NEXT_PUBLIC_COMPANY_ID),
  }))

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
      <Suspense fallback={<div>Loading...</div>}>
        <ul className="flex md-w-sidebar:block justify-center py-12 pt-0">
          {
            members?.map(member => (
              <TeamMemberItem
                className="md-w-sidebar:my-12"
                key={member.id}
                imageUri={member.image_uri}
                fullname={`${t(`_job-prefix.${member.job_prefix}.short`)} ${member.firstname} ${member.lastname}`}
                jobTitle={t(`_job-title.${member.job_position}.long`)}
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

export default withTranslations(OurTeamOverview)

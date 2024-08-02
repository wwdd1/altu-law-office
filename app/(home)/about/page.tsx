import Section from "app/ui/components/section"
import OurTeamOverview from "app/ui/components/homepage/our-team-overview"
import type { Translations } from "app/ui/components/hoc/withTranslations/types"

import withTranslations from "app/ui/components/hoc/withTranslations/server"
import ReactQueryClientProvider from "@/queries/provider/react-query"

type Props = {} & Translations
function AboutPage({ t }: Props) {

  if (!t) {
    throw new Error('Component needs to be wrapped with HOC withTranslations')
  }

  return (
    <ReactQueryClientProvider>
      <Section header={t('about-us')} subHeader={t('why-choose-us')} className="py-6">
        <div>Altu hukuk gecmis, vizyon, misyon, ovguler vs</div>
      </Section>
      <Section header={t('meet-our-team.header')} subHeader={t('meet-our-team.subheader')} className="bg-gray">
        <OurTeamOverview hideHeader></OurTeamOverview>
      </Section>
    </ReactQueryClientProvider>
  )
}

export default withTranslations(AboutPage)

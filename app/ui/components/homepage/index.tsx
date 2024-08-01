'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useScrollAnimations from "app/ui/hooks/use-scroll-animations"

import JumboOverlay from "app/ui/components/homepage/jumbo-image-overlay"
import ContactAboutUs from "app/ui/components/homepage/contact-about-us"
import MilestoneBanner from "app/ui/components/homepage/milestone-banner"
import OurTeamOverview from "app/ui/components/homepage/our-team-overview"
import GetInTouch from "app/ui/components/homepage/get-in-touch"
import CaseTypeTiles from "app/ui/components/homepage/case-type-tiles"
import ServiceTypeTiles from "app/ui/components/homepage/service-type-tiles"

export default function Home() {
  useScrollAnimations()

  return (
    <>
        <JumboOverlay></JumboOverlay>
        <CaseTypeTiles id="case-type-tiles" className="py-16 bg-white"></CaseTypeTiles>
        <ServiceTypeTiles className="py-16 bg-gray"></ServiceTypeTiles>
        <ContactAboutUs></ContactAboutUs>
        <OurTeamOverview></OurTeamOverview>
        <MilestoneBanner></MilestoneBanner>
        <GetInTouch className="py-16"></GetInTouch>
        <ReactQueryDevtools initialIsOpen />
    </>
  )
}

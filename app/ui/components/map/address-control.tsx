import React, { type ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import ExternalLinkSvg from "@/ui/icons/external-link.svg"
import { useGoogleMapsContext } from "app/ui/context/google-maps-context"
import { Translations } from "../hoc/withTranslations/types"

type Props = {
  children: ReactNode
  directionsUrl?: string
  position?: number
} & Translations
export default function AddressControl({
    children,
    directionsUrl = '#',
    position = window.google.maps.ControlPosition.TOP_LEFT,
    t,
}: Props) {

  const mapRef = useGoogleMapsContext()
  const controlDiv = document.createElement('div')

  useEffect(() => {
    const controls = mapRef?.current?.state?.map?.controls[position]
    if (controls) {
      const index = controls.getLength()
      controls.push(controlDiv)
      return () => {
        controls.removeAt(index)
      }
    }
  })

  return createPortal((
    <div className="bg-white flex p-3 m-2 shadow-md text-[0.9rem]">
      <div className="max-w-[260px]">
        { children }
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        className="text-link-alternate text-center self-center cursor-pointer hover:underline"
      >
        <ExternalLinkSvg width={22} height={22} className="inline mb-1"></ExternalLinkSvg>
        <div>{ t('direction') }</div>
      </a>
    </div>
  ), controlDiv)
}

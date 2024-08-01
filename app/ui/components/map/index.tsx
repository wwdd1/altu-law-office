'use client'

import { useRef, type ReactNode } from "react"
import classNames from "classnames"

import {
  GoogleMap,
  OverlayViewF,
  OVERLAY_MOUSE_TARGET,
  useJsApiLoader
} from "@react-google-maps/api"
import AddressControl from "app/ui/components/map/address-control"
import GoogleMapsContextProvider from "app/ui/context/google-maps-context"
import withTranslations from "@/ui/components/hoc/withTranslations/client"

import { font_playfair, font_mukta } from "app/ui/fonts"
import { Translations } from "../hoc/withTranslations/types"

function centerOverlayView(width: number, height: number): { x: number, y: number } {
  return {
    x: -(width / 2),
    y: -(height / 2),
  }
}

export type LatLng = {
  lat: number,
  lng: number,
}

type Props = {
  latLng: LatLng,
  address: ReactNode
} & Translations
function Map({ latLng, address, t }: Props) {
  if (!t) {
    throw new Error('Component needs to be wrapped with withTranslations HOC.')
  }

  const mapRef = useRef<GoogleMap>(null)
  const { isLoaded } = useJsApiLoader({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  })

  if (!isLoaded) {
    return <></>
  }

  return (
    <GoogleMap
      ref={mapRef}
      mapContainerStyle={{
        width: '100%',
        height: '400px'
      }}
      center={latLng}
      zoom={18}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <OverlayViewF
        position={latLng}
        mapPaneName={OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={centerOverlayView}
      >
        <div className={classNames([
          font_mukta.className,
          'relative rounded-lg bg-secondary text-center p-2 px-4'
        ])}>
          <h1 className={classNames([
            font_playfair.className,
            "text-primary font-bold text-xl tracking-wide mb-1"
          ])}>{ t('altu') }</h1>
          <h1 className="text-text-primary text-sm">{ t('law-office') }</h1>
          <div className="bottom-arrow border-black"></div>
        </div>
      </OverlayViewF>
      <GoogleMapsContextProvider mapRef={mapRef}>
        <AddressControl t={t}>
          { address }
        </AddressControl>
      </GoogleMapsContextProvider>
    </GoogleMap>
  )
}

export default withTranslations(Map)

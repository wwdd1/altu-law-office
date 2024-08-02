import ReactQueryClientProvider from "@/queries/provider/react-query"
import GetInTouch from "@/ui/components/homepage/get-in-touch"

export default function ContactPage() {
  return (
    <ReactQueryClientProvider>
      <GetInTouch></GetInTouch>
    </ReactQueryClientProvider>
  )
}

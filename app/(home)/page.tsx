import ReactQueryClientProvider from "@/queries/provider/react-query"
import Home from "@/ui/components/homepage"


export default async function Homepage() {
  return (
    <ReactQueryClientProvider>
      <Home />
    </ReactQueryClientProvider>
  )
}

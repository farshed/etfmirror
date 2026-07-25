import { EtfReplicator } from "@/components/etf-replicator"
import { WhyReplicate } from "@/components/why-replicate"

export function App() {
  return (
    <div className="flex min-h-svh justify-center bg-background p-6 pt-16">
      <div className="w-full max-w-2xl space-y-10">
        <EtfReplicator />
        <WhyReplicate />
      </div>
    </div>
  )
}

export default App

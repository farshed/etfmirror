import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  SlidersHorizontal,
  Vote,
  TrendingDown,
  Wallet,
  Scissors,
  type LucideIcon,
} from "lucide-react"

interface Reason {
  icon: LucideIcon
  title: string
  description: string
}

const reasons: Reason[] = [
  {
    icon: SlidersHorizontal,
    title: "Full control over your portfolio",
    description:
      "Hold the index on your own terms. Exclude sectors or individual stocks you would rather not own, overweight the ones you believe in, and rebalance on your own schedule instead of the fund's.",
  },
  {
    icon: Vote,
    title: "Direct ownership of the underlying stocks",
    description:
      "The shares sit in your own CDC account, so you get voting rights and the right to participate in general meetings. An ETF holder owns units of the fund, while the fund owns the companies.",
  },
  {
    icon: TrendingDown,
    title: "No management fee eating into compounding",
    description:
      "An expense ratio is charged every year on your entire holding, not just on your gains. Skipping it leaves more capital invested, and the difference widens the longer you hold.",
  },
  {
    icon: Wallet,
    title: "No cash drag",
    description:
      "Funds keep a slice of assets in cash to handle redemptions and expenses, and that slice earns no market return. Replicating directly keeps every rupee in the market.",
  },
  {
    icon: Scissors,
    title: "Room for tax-loss harvesting",
    description:
      "When you own the constituents individually, you can realise a loss on the ones that are down to offset gains elsewhere. Inside an ETF those losses are netted away in a single position you cannot touch.",
  },
]

export function WhyReplicate() {
  return (
    <Card>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="why" className="border-b-0">
            <AccordionTrigger className="py-0 text-sm font-normal">
              Why replicate an ETF?
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-5 pb-1">
              {reasons.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}

              <p className="border-t border-border pt-4 text-xs text-muted-foreground">
                Replication is not free either. You have to maintain the basket
                yourself as the index changes, and small holdings will not track
                the ETF exactly.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

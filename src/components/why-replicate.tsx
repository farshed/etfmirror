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
  HandCoins,
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
    icon: TrendingDown,
    title: "No management fee eating into compounding",
    description:
      "Avoiding the expense ratio leaves more capital invested, and the difference widens with a longer horizon or a bigger portfolio.",
  },
  {
    icon: Vote,
    title: "Direct ownership of the underlying stocks",
    description:
      "Directly owning companies gives you voting rights and the right to participate in general meetings.",
  },
  {
    icon: HandCoins,
    title: "Receive dividends as they are paid",
    description:
      "Dividends reach you as soon as they are paid. No need to wait for the ETF's annual dividend distribution.",
  },
  {
    icon: Wallet,
    title: "No cash component",
    description:
      "Funds keep a cash component to handle redemptions and expenses, which just sits there making no return. Replication keeps every rupee in the market.",
  },
  {
    icon: SlidersHorizontal,
    title: "Full control over your portfolio",
    description:
      "Hold the index on your own terms. Exclude sectors or individual stocks you would rather not own and rebalance on your own schedule instead of the fund's.",
  },
  {
    icon: Scissors,
    title: "Room for tax-loss harvesting",
    description:
      "You can realise a loss on individual stocks that are down to offset gains elsewhere. Inside an ETF those losses are netted away in a single position you cannot touch.",
  },
]

export function WhyReplicate() {
  return (
    <Card>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="why" className="border-b-0">
            <AccordionTrigger className="py-0 text-sm font-normal">
              Why replicate ETFs?
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

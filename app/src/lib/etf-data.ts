export interface ETFConstituent {
  name: string
  count: number
}

export interface ETF {
  name: string
  price: number
  constituents: ETFConstituent[]
}

export async function fetchETFs(): Promise<ETF[]> {
  const response = await fetch("/api/etfs").then((r) => r.json())
  return response
}

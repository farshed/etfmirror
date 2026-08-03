export interface ETFConstituent {
  name: string
  count: number
  sector?: string
  logo?: string
}

export interface ETF {
  name: string
  price: number
  constituents: ETFConstituent[]
}

export async function fetchETFs(): Promise<ETF[]> {
  const response = await fetch(
    "https://mttgttziavgglvmjwhha.supabase.co/functions/v1/etfs"
  )
    .then((r) => r.json())
    .catch(() => [])
  return response
}

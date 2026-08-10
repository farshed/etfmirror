import etfs from "./etfs.json"

export interface ETFConstituent {
  name: string
  count: number
  sector?: string | null
  logo?: string | null
}

export interface ETF {
  name: string
  price: number
  constituents: ETFConstituent[]
}

// The ETF data is fetched from the Supabase function at build time by
// scripts/fetch-etfs.ts and bundled as etfs.json, so no runtime request is
// needed. The snapshot is refreshed on every deploy (see the deploy script and
// the daily GitHub Actions build).
export const etfData: ETF[] = etfs

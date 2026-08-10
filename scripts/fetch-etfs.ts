/**
 * Fetches the latest ETF data from the Supabase function and writes it to
 * src/lib/etfs.json, which is imported and bundled at build time. Run this
 * before every build so the deployed snapshot is fresh (see the deploy script
 * and the GitHub Actions workflow).
 */
import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const ENDPOINT = "https://mttgttziavgglvmjwhha.supabase.co/functions/v1/etfs"

const outPath = join(dirname(fileURLToPath(import.meta.url)), "../src/lib/etfs.json")

const response = await fetch(ENDPOINT)
if (!response.ok) {
  throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
}

const data = await response.json()
if (!Array.isArray(data) || data.length === 0) {
  throw new Error("Expected a non-empty array of ETFs, refusing to overwrite snapshot")
}

await writeFile(outPath, JSON.stringify(data, null, 2) + "\n")
console.log(`Wrote ${data.length} ETFs to src/lib/etfs.json`)

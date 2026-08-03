import { useState, useEffect, useMemo } from "react"
import { fetchETFs, type ETF } from "@/lib/etf-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Banknote, Layers, AlertCircle } from "lucide-react"

type InputMode = "cash" | "units"

interface ReplicatedStock {
  name: string
  count: number
  sector?: string
  logo?: string
}

interface CalculationResult {
  stocks: ReplicatedStock[]
  targetUnits: number
}

interface CalculationState {
  result: CalculationResult | null
  error: string | null
}

function createCalculationResult(
  etf: ETF,
  targetUnits: number
): CalculationResult {
  const ratio = targetUnits / 10000
  const stocks = etf.constituents.map((constituent) => ({
    name: constituent.name,
    count: Math.round(constituent.count * ratio),
    sector: constituent.sector,
    logo: constituent.logo,
  }))

  return { stocks, targetUnits }
}

export function EtfReplicator() {
  const [etfs, setEtfs] = useState<ETF[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEtfName, setSelectedEtfName] = useState<string>("")
  const [inputMode, setInputMode] = useState<InputMode>("cash")
  const [cashAmount, setCashAmount] = useState<string>("")
  const [units, setUnits] = useState<string>("")
  const [hasCalculated, setHasCalculated] = useState(false)

  useEffect(() => {
    fetchETFs()
      .then((data) => {
        setEtfs(data)
        if (data.length > 0) {
          setSelectedEtfName(data[0].name)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const selectedEtf = useMemo(
    () => etfs.find((e) => e.name === selectedEtfName),
    [etfs, selectedEtfName]
  )

  const calculation = useMemo<CalculationState>(() => {
    if (!selectedEtf) return { result: null, error: null }

    if (inputMode === "cash") {
      const cash = parseFloat(cashAmount)
      if (isNaN(cash) || cash <= 0) {
        return {
          result: null,
          error: "Please enter a valid cash amount greater than zero.",
        }
      }

      const minRequired = selectedEtf.price * 500
      if (cash < minRequired) {
        return {
          result: null,
          error: `You need at least Rs ${minRequired.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} to replicate the minimum 500 units of ${selectedEtf.name}.`,
        }
      }

      const calculatedUnits = Math.floor(cash / selectedEtf.price / 500) * 500
      return {
        result: createCalculationResult(selectedEtf, calculatedUnits),
        error: null,
      }
    }

    const targetUnits = parseFloat(units)
    if (isNaN(targetUnits) || targetUnits <= 0) {
      return {
        result: null,
        error: "Please enter a valid number of units greater than zero.",
      }
    }

    if (targetUnits < 500) {
      return {
        result: null,
        error: `Minimum purchase is 500 units. You entered ${Math.floor(targetUnits).toLocaleString()}.`,
      }
    }

    const flooredUnits = Math.floor(targetUnits / 500) * 500
    return {
      result: createCalculationResult(selectedEtf, flooredUnits),
      error: null,
    }
  }, [selectedEtf, inputMode, cashAmount, units])

  const result = hasCalculated ? calculation.result : null
  const error = hasCalculated ? calculation.error : null

  const handleCalculate = () => setHasCalculated(true)

  const isCalculateDisabled = useMemo(() => {
    if (inputMode === "cash") {
      return cashAmount.trim() === "" || parseFloat(cashAmount) <= 0
    }
    return units.trim() === "" || parseFloat(units) <= 0
  }, [inputMode, cashAmount, units])

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex min-h-svh items-center justify-center bg-background"
        role="status"
        aria-label="Loading ETF data"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading ETF data</span>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          PSX ETF Replicator{" "}
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an ETF and enter your budget or desired units to see which
          stocks to buy to replicate it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* ETF Selector */}
          <div className="space-y-2">
            <Label htmlFor="etf-select">Select ETF</Label>
            <Select value={selectedEtfName} onValueChange={setSelectedEtfName}>
              <SelectTrigger id="etf-select" className="w-full">
                <SelectValue placeholder="Choose an ETF" />
              </SelectTrigger>
              <SelectContent>
                {etfs.map((etf) => (
                  <SelectItem key={etf.name} value={etf.name}>
                    <div className="flex w-full items-center justify-between gap-4">
                      <span>{etf.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input Mode Toggle */}
          <div className="space-y-2">
            <Label>Calculate by</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode("cash")}
                className={`flex flex-1 items-center justify-center gap-2 border px-3 py-2 text-sm transition-colors ${
                  inputMode === "cash"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Banknote className="h-4 w-4" />
                Cash Amount
              </button>
              <button
                type="button"
                onClick={() => setInputMode("units")}
                className={`flex flex-1 items-center justify-center gap-2 border px-3 py-2 text-sm transition-colors ${
                  inputMode === "units"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Layers className="h-4 w-4" />
                ETF Units
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <Label htmlFor="value-input">
              {inputMode === "cash" ? "Cash to invest (Rs)" : "ETF Units"}
            </Label>
            <Input
              id="value-input"
              type="number"
              min="0"
              step={inputMode === "cash" ? "5000" : "500"}
              placeholder={inputMode === "cash" ? "e.g. 10000" : "e.g. 5000"}
              value={inputMode === "cash" ? cashAmount : units}
              onChange={(e) => {
                if (inputMode === "cash") {
                  if (/^\d*$/.test(e.target.value)) {
                    setCashAmount(e.target.value)
                  }
                } else {
                  setUnits(e.target.value)
                }
              }}
            />
            {inputMode === "cash" && selectedEtf && (
              <p className="text-xs text-muted-foreground">
                Minimum cash amount: Rs.{" "}
                {Math.ceil(selectedEtf.price * 500).toLocaleString()}
              </p>
            )}
            {inputMode === "units" && (
              <p className="text-xs text-muted-foreground">
                Units must be in multiples of 500
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleCalculate}
            disabled={isCalculateDisabled}
          >
            Calculate Replication
          </Button>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Replication Breakdown</CardTitle>
              <Badge variant="secondary">{result.stocks.length} stocks</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 rounded-lg bg-muted p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ETF</span>
                <span className="font-medium">{selectedEtf?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Units</span>
                <span className="font-medium">
                  {result.targetUnits.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Approximate cost</span>
                <span className="font-medium">
                  Rs{" "}
                  {(selectedEtf!.price * result.targetUnits).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  {/* <TableHead className="text-right">Sector</TableHead> */}
                  <TableHead className="text-right">Shares to Buy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.stocks.map((stock) => (
                  <TableRow key={stock.name}>
                    <TableCell>
                      <div className="flex items-center gap-3 font-medium">
                        {stock.logo && (
                          <img
                            src={stock.logo}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-md bg-white object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <span>{stock.name}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-right text-gray-500">
                      {stock.sector}
                    </TableCell> */}
                    <TableCell className="text-right font-mono font-semibold">
                      {stock.count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

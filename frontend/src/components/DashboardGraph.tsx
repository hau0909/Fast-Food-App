"use client"

import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function DashboardGraph() {
  const [days, setDays] = useState<number>(10)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generateStatus, setGenerateStatus] = useState<string | null>(null)

  const fetchReports = useCallback(async (limit = days) => {
    setLoading(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        withCredentials: true,
      })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setReports(list)
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      await fetchReports(days)
    })()
    return () => {
      mounted = false
    }
  }, [days, fetchReports])

  const prepare = (list: any[]) => {
    const chronological = [...list].reverse()
    // ISO date labels (YYYY-MM-DD) so Chart can format them consistently
    const labels = chronological.map((r) => {
      const d = new Date(r.report_date)
      return isNaN(d.getTime()) ? String(r.report_date) : d.toISOString().slice(0, 10)
    })
    const orders = chronological.map((r) => Number(r.total_orders ?? 0))
    // detect an optional revenue-like field
    const revenueField = ["total_revenue", "revenue", "total_amount", "total_sales", "amount"].find((f) => chronological.some((r) => r[f] != null))
    const revenue = revenueField ? chronological.map((r) => Number(r[revenueField] ?? 0)) : undefined
    return { labels, orders, revenue, revenueField }
  }

  const { labels, orders, revenue } = prepare(reports)

  // aggregate top_products across the fetched reports to display an overall top list
  const aggregatedTopProducts = (() => {
    const map = new Map<string, { product_id: string; name: string; total_sold: number }>()
    for (const r of reports) {
      const tops = Array.isArray(r.top_products) ? r.top_products : []
      for (const p of tops) {
        const id = p.product_id || p._id || String(p.name)
        const existing = map.get(id) ?? { product_id: id, name: p.name || "Unknown", total_sold: 0 }
        existing.total_sold += Number(p.total_sold ?? 0)
        map.set(id, existing)
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total_sold - a.total_sold)
  })()

  const chartData: any = {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: orders,
        fill: true,
        backgroundColor: 'rgba(59,130,246,0.08)',
        borderColor: '#3b82f6',
        tension: 0,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        yAxisID: 'y',
      },
    ],
  }
  if (revenue && revenue.some((v) => v > 0)) {
    chartData.datasets.push({
      label: 'Revenue',
      data: revenue,
      fill: false,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      tension: 0,
      pointRadius: 3,
      yAxisID: 'y1',
    })
  }

  const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

  const options: any = {
    responsive: true,
    // allow the chart to fill the container height we set via CSS
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.dataset.label || ''
            const value = ctx.parsed?.y ?? ctx.parsed ?? 0
            if (ctx.dataset.yAxisID === 'y1') return `${label}: ${currencyFormatter.format(value)}`
            return `${label}: ${numberFormatter.format(Number(value))}`
          },
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          // value may be the label index for category axes; map through our labels array
          callback: (value: any, index: number) => {
            try {
              const raw = typeof value === 'number' ? labels[value] ?? labels[index] : labels[index] ?? String(value)
              const d = new Date(String(raw))
              if (isNaN(d.getTime())) return String(raw)
              return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            } catch (e) {
              return String(value)
            }
          },
          autoSkip: true,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: (ctx: any) => {
            // render stronger lines for integer ticks, lighter for fractional gridlines
            const val = ctx.tick?.value
            return val != null && Number(val) % 1 === 0 ? 'rgba(229,231,235,0.8)' : 'rgba(229,231,235,0.35)'
          },
        },
        title: { display: true, text: 'Orders' },
        ticks: {
          // draw extra grid lines at 0.5 steps but only label whole numbers
          stepSize: 0.5,
          callback: (v: any) => {
            const n = Number(v)
            if (Number.isInteger(n)) return numberFormatter.format(n)
            return ''
          },
        },
      },
      y1: {
        display: !!(revenue && revenue.some((v) => v > 0)),
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          callback: (v: any) => currencyFormatter.format(Number(v)),
        },
        title: { display: !!(revenue && revenue.some((v) => v > 0)), text: 'Revenue' },
      },
    },
  }

  return (
    <div className="bg-card p-4 border border-border rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-semibold text-foreground">Orders (last {days} days)</h3>
          <p className="text-muted-foreground text-sm">Time series of total orders per day</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={String(days)} onChange={(e) => setDays(Number(e.target.value))} className="bg-background px-3 py-2 border border-input rounded-md text-foreground text-sm">
            <option value="10">10 days</option>
            <option value="20">20 days</option>
            <option value="50">50 days</option>
          </select>
          <Dialog open={generateOpen} onOpenChange={(v) => setGenerateOpen(v)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={generating}>Generate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Generate dashboard reports</DialogTitle>
              <DialogDescription>
                Generate dashboard statistics for either the dates currently shown, or for all available dates on the server. Generating all dates can take a long time and uses only the orders already in the system.
              </DialogDescription>
              <div className="space-y-3 mt-3">
                <div className="text-sm">
                  <strong>Visible range:</strong> Generate statistics for the dates currently shown ({reports.length} day(s)). This updates data only for these dates.
                </div>
                <div className="text-sm">
                  <strong>Generate all:</strong> Ask the server to generate statistics for all dates. This may take a while; the server will process using the orders it currently has.
                </div>
                {generateStatus && (
                  <div className="mt-2 text-muted-foreground text-xs">{generateStatus}</div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" disabled={generating}>Cancel</Button>
                </DialogClose>
                <Button variant="outline" size="sm" disabled={generating || !reports.length} onClick={async () => {
                  // generate for visible range (send array of dates in one request)
                  setGenerating(true)
                  setGenerateStatus(null)
                  try {
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
                    // unique dates from reports (YYYY-MM-DD)
                    const uniqueDates = Array.from(new Set(reports.map((r) => {
                      try { return new Date(r.report_date).toISOString().slice(0,10) } catch { return String(r.report_date) }
                    })))
                    if (uniqueDates.length === 0) {
                      setGenerateStatus('No dates available to generate')
                      setGenerating(false)
                      return
                    }
                    setGenerateStatus(`Generating ${uniqueDates.length} date(s)...`)
                    // send all dates in a single request (backend supports array or comma-separated string)
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/generate`, { date: uniqueDates }, {
                      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                      withCredentials: true,
                    })
                    setGenerateStatus('Done. Refreshing data...')
                    await fetchReports(days)
                    setTimeout(() => setGenerateOpen(false), 600)
                  } catch (e: any) {
                    setGenerateStatus(e?.response?.data?.message || 'Generate failed')
                  } finally {
                    setGenerating(false)
                  }
                }}>Generate visible</Button>
                <Button variant="destructive" size="sm" disabled={generating} onClick={async () => {
                  // generate all
                  setGenerating(true)
                  setGenerateStatus(null)
                  try {
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
                    setGenerateStatus('Requesting server to generate all reports...')
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/generate`, { all: true }, {
                      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                      withCredentials: true,
                    })
                    setGenerateStatus('Request accepted. The server is processing the full generation; statistics will be available when it finishes.')
                    // refresh after short delay — server may take longer; still attempt
                    await fetchReports(days)
                    setTimeout(() => setGenerateOpen(false), 600)
                  } catch (e: any) {
                    setGenerateStatus(e?.response?.data?.message || 'Generate all failed')
                  } finally {
                    setGenerating(false)
                  }
                }}>Generate all</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="py-8 h-40 text-muted-foreground text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 h-40 text-destructive text-center">{error}</div>
      ) : !reports.length ? (
        <div className="py-8 h-40 text-muted-foreground text-center">No data</div>
      ) : (
        <div>
          <div className="w-full h-40">
            <Line data={chartData} options={options} />
          </div>
            {/* aggregated top products list */}
            <div className="mt-4">
              <h4 className="font-medium text-foreground text-sm">Top products (last {days} days)</h4>
              {aggregatedTopProducts.length === 0 ? (
                <div className="mt-2 text-muted-foreground text-xs">No top products available</div>
              ) : (
                <ul className="mt-2 divide-y">
                  {aggregatedTopProducts.slice(0, 10).map((p, i) => (
                    <li key={p.product_id} className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium">{i + 1}. {p.name}</div>
                      </div>
                      <div className="font-semibold text-sm">{p.total_sold}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
        </div>
      )}
    </div>
  )
}

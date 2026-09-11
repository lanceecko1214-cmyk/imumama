import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { getDashboardSummary } from '../api/dashboard'
import { listEquipment } from '../api/equipment'

const peso = (n) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n || 0)

export default function Reports() {
  const [summary, setSummary] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getDashboardSummary().then((res) => setSummary(res.data))
  }, [])

  const exportCsv = async () => {
    setExporting(true)
    try {
      const rows = []
      let page = 1
      let lastPage = 1
      do {
        const res = await listEquipment({ page, per_page: 100 })
        rows.push(...res.data.data)
        lastPage = res.data.meta.last_page
        page += 1
      } while (page <= lastPage)

      const header = ['Property Number', 'Name', 'Category', 'Location', 'Status', 'Condition', 'Acquisition Cost', 'Acquisition Date']
      const csvRows = rows.map((r) => [
        r.property_number, r.name, r.category.name, r.location.label,
        r.status, r.condition, r.acquisition_cost ?? '', r.acquisition_date ?? '',
      ])

      const csv = [header, ...csvRows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dlsjbc-equipment-inventory-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  if (!summary) return <p className="text-slate-500 text-sm">Loading report data…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Inventory breakdowns for planning and audits.</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={exporting}
          className="flex items-center gap-2 bg-blueprint text-white text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-blueprint-light transition-colors disabled:opacity-60"
        >
          <Download size={16} />
          {exporting ? 'Preparing…' : 'Export Full Inventory (CSV)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="tag-card">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">By Category</h3>
          <table className="w-full text-sm">
            <tbody>
              {summary.by_category.map((c) => (
                <tr key={c.name} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 text-slate-600">{c.name}</td>
                  <td className="py-2 text-right font-mono text-ink">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tag-card">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">By Building</h3>
          <table className="w-full text-sm">
            <tbody>
              {summary.by_location.map((l) => (
                <tr key={l.building} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 text-slate-600">{l.building}</td>
                  <td className="py-2 text-right font-mono text-ink">{l.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tag-card">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">By Condition</h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(summary.by_condition).map(([condition, total]) => (
                <tr key={condition} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 text-slate-600 capitalize">{condition}</td>
                  <td className="py-2 text-right font-mono text-ink">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tag-card">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">Portfolio Value</h3>
          <p className="font-display text-3xl font-semibold text-ink">{peso(summary.total_value)}</p>
          <p className="text-xs text-slate-400 mt-1">Sum of recorded acquisition cost, active inventory</p>
        </div>
      </div>
    </div>
  )
}

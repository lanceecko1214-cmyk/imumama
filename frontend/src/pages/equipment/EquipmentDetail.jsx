import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Clock } from 'lucide-react'
import { getEquipment, deleteEquipment } from '../../api/equipment'
import StatusPill from '../../components/ui/StatusPill.jsx'
import ConditionPill from '../../components/ui/ConditionPill.jsx'

const peso = (n) =>
  n == null ? '—' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)

export default function EquipmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEquipment(id)
      .then((res) => setItem(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Archive ${item.property_number}? This removes it from active inventory.`)) return
    await deleteEquipment(id)
    navigate('/equipment')
  }

  if (loading) return <p className="text-slate-500 text-sm">Loading…</p>
  if (!item) return <p className="text-slate-500 text-sm">Equipment record not found.</p>

  const fields = [
    ['Brand', item.brand || '—'],
    ['Model', item.model || '—'],
    ['Serial Number', item.serial_number || '—'],
    ['Category', item.category.name],
    ['Location', item.location.label],
    ['Acquisition Date', item.acquisition_date || '—'],
    ['Acquisition Cost', peso(item.acquisition_cost)],
    ['Supplier', item.supplier || '—'],
    ['Warranty Expiry', item.warranty_expiry || '—'],
    ['Recorded By', item.creator || '—'],
  ]

  return (
    <div className="space-y-6">
      <Link to="/equipment" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blueprint w-fit">
        <ArrowLeft size={15} /> Back to inventory
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-blueprint mb-1">{item.property_number}</p>
          <h2 className="font-display text-2xl font-semibold text-ink">{item.name}</h2>
          <div className="flex gap-2 mt-2">
            <StatusPill status={item.status} />
            <ConditionPill condition={item.condition} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/equipment/${id}/edit`}
            className="flex items-center gap-2 border border-slate-300 text-sm font-medium px-4 py-2 rounded-sm hover:bg-slate-50"
          >
            <Pencil size={14} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 border border-status-damaged text-status-damaged text-sm font-medium px-4 py-2 rounded-sm hover:bg-red-50"
          >
            <Trash2 size={14} /> Archive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="tag-card lg:col-span-2">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">Asset Details</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-mono uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="text-sm text-ink mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
          {item.remarks && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <dt className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">Remarks</dt>
              <dd className="text-sm text-slate-600">{item.remarks}</dd>
            </div>
          )}
        </div>

        <div className="tag-card">
          <h3 className="font-display text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <Clock size={15} /> Tracking History
          </h3>
          {item.histories?.length ? (
            <ol className="space-y-4">
              {item.histories.map((h) => (
                <li key={h.id} className="text-sm border-l-2 border-slate-200 pl-3">
                  <p className="text-ink font-medium capitalize">{h.action.replace('_', ' ')}</p>
                  {h.field_changed && (
                    <p className="text-xs text-slate-500">
                      {h.field_changed}: <span className="font-mono">{h.old_value}</span> →{' '}
                      <span className="font-mono">{h.new_value}</span>
                    </p>
                  )}
                  {h.notes && <p className="text-xs text-slate-500">{h.notes}</p>}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(h.created_at).toLocaleString()} {h.user ? `· ${h.user}` : ''}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">No history recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

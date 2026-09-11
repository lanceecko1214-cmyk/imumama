import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { listEquipment } from '../../api/equipment'
import { listCategories, listLocations } from '../../api/lookups'
import StatusPill from '../../components/ui/StatusPill.jsx'
import ConditionPill from '../../components/ui/ConditionPill.jsx'
import EquipmentForm from './EquipmentForm.jsx'

const categoryMeta = {
  'ICT & Computer Equipment': { color: '#4F46E5', image: '/images/ict/ict.jpg' },
  'Furniture & Fixtures': { color: '#10B981', image: '/images/furniture/furniture.jpg' },
  'Laboratory Equipment': { color: '#F59E0B', image: '/images/lab/lab.jpg' },
  'Air Conditioning Units': { color: '#0EA5E9', image: '/images/ac/ac.jpg' },
  'Audio-Visual Equipment': { color: '#EC4899', image: '/images/av/av.jpg' },
  'Facilities & Maintenance Tools': { color: '#8B5CF6', image: '/images/facilities/facilities.jpg' },
}

const getCategoryCount = (category) => category.equipment_count ?? category.count ?? category.items?.length ?? 0

const getStatusClassName = (status) =>
  `status-badge status-${status.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`

export default function EquipmentList() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 })
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)

  const [filters, setFilters] = useState({ search: '', status: '', category_id: '', location_id: '', page: 1 })

  const fetchData = useCallback(() => {
    setLoading(true)
    listEquipment(filters)
      .then((res) => {
        setItems(res.data.data)
        setMeta(res.data.meta)
      })
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    listCategories().then((res) => setCategories(res.data))
    listLocations().then((res) => setLocations(res.data))
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchData, 300)
    return () => clearTimeout(t)
  }, [fetchData])

  useEffect(() => {
    if (!isPanelOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPanelOpen(false)
        setSelectedCategory(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isPanelOpen])

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }))

  const openCategory = (category) => {
    setSelectedCategory({
      ...category,
      items: items.filter((item) => String(item.category_id) === String(category.id)),
    })
    setIsPanelOpen(true)
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    setSelectedCategory(null)
  }

  const closeAddEquipment = () => {
    setIsAddEquipmentOpen(false)
  }

  const handleAddEquipmentSaved = () => {
    fetchData()
    listCategories().then((res) => setCategories(res.data))
    setIsAddEquipmentOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Equipment Inventory</h2>
              <p className="text-slate-500 text-sm mt-1">
                {meta.total ?? items.length} asset{(meta.total ?? items.length) === 1 ? '' : 's'} on record
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddEquipmentOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#123f31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f352d]"
            >
              <Plus size={16} />
              Add Equipment
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">Equipment Categories</h3>
          </div>

          <div className="category-grid grid-cols-3" role="list" aria-label="Equipment categories">
            {categories.map((category) => {
              const meta = categoryMeta[category.name] || { color: '#123f31', image: null }

              return (
                <button
                  key={category.id}
                  type="button"
                  className="category-tile"
                  style={{
                    backgroundColor: meta.color,
                    backgroundImage: meta.image
                      ? `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.35)), url(${meta.image})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  onClick={() => openCategory(category)}
                  aria-haspopup="dialog"
                  aria-expanded={isPanelOpen && selectedCategory?.id === category.id}
                >
                  <span className="tile-count">{getCategoryCount(category)}</span>
                  <span className="tile-name">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search by name, property number, serial…"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blueprint"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="border border-slate-300 rounded-sm text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blueprint"
            >
              <option value="">All statuses</option>
              <option value="operational">Operational</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="damaged">Damaged</option>
              <option value="decommissioned">Decommissioned</option>
            </select>

            <select
              value={filters.category_id}
              onChange={(e) => updateFilter('category_id', e.target.value)}
              className="border border-slate-300 rounded-sm text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blueprint"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={filters.location_id}
              onChange={(e) => updateFilter('location_id', e.target.value)}
              className="border border-slate-300 rounded-sm text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blueprint"
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-mono uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Property No.</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Condition</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No equipment matches these filters.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-paper/60">
                    <td className="px-5 py-3">
                      <Link to={`/equipment/${item.id}`} className="font-mono text-xs text-blueprint hover:underline">
                        {item.property_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-5 py-3 text-slate-600">{item.category.name}</td>
                    <td className="px-5 py-3 text-slate-600">{item.location.label}</td>
                    <td className="px-5 py-3"><StatusPill status={item.status} /></td>
                    <td className="px-5 py-3"><ConditionPill condition={item.condition} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {meta.last_page > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={meta.current_page <= 1}
                  onClick={() => updateFilter('page', meta.current_page - 1)}
                  className="p-1.5 border border-slate-300 rounded-sm disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => updateFilter('page', meta.current_page + 1)}
                  className="p-1.5 border border-slate-300 rounded-sm disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {isPanelOpen && selectedCategory && (
          <>
            <button
              type="button"
              className="modal-backdrop"
              onClick={closePanel}
              aria-label="Close category details"
            />

            <aside
              className="category-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-panel-title"
            >
              <div className="panel-header">
                <div>
                  <p className="panel-label">Equipment Category</p>
                  <h3 id="category-panel-title">{selectedCategory.name}</h3>
                </div>

                <button
                  type="button"
                  className="close-button"
                  onClick={closePanel}
                  aria-label="Close equipment category panel"
                >
                  ×
                </button>
              </div>

              <div className="panel-summary">
                <span>Total items</span>
                <strong>{getCategoryCount(selectedCategory)}</strong>
              </div>

              <div className="table-wrap">
                <table className="item-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCategory.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="mono">{item.property_number}</td>
                        <td>
                          <span className={getStatusClassName(item.status)}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </aside>
          </>
        )}

        {isAddEquipmentOpen && (
          <>
            <button
              type="button"
              className="modal-backdrop"
              onClick={closeAddEquipment}
              aria-label="Close add equipment form"
            />

            <aside
              className="add-equipment-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-equipment-title"
            >
              <EquipmentForm embedded={true} onClose={closeAddEquipment} onSaved={handleAddEquipmentSaved} />
            </aside>
          </>
        )}
      </div>
    </div>
  )
}

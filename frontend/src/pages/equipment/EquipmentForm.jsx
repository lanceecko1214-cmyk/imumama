import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getEquipment, createEquipment, updateEquipment } from '../../api/equipment'
import { listCategories, listLocations, createLocation } from '../../api/lookups'

const emptyForm = {
  name: '', brand: '', model: '', serial_number: '',
  category_id: '', location_id: '', status: 'operational', condition: 'good',
  acquisition_date: '', acquisition_cost: '', supplier: '', warranty_expiry: '', remarks: '',
}

export default function EquipmentForm({ embedded = false, onClose = null, onSaved = null }) {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [locationInput, setLocationInput] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listCategories().then((res) => setCategories(res.data))
    listLocations().then((res) => setLocations(res.data))
  }, [])

  useEffect(() => {
    if (!locations.length || !form.location_id) return

    const selectedLocation = locations.find((location) => String(location.id) === String(form.location_id))

    if (selectedLocation) {
      const label = selectedLocation.label || [selectedLocation.building, selectedLocation.floor, selectedLocation.room].filter(Boolean).join(' - ')
      setLocationInput(label)
    }
  }, [locations, form.location_id])

  useEffect(() => {
    if (!isEdit) return
    getEquipment(id).then((res) => {
      const d = res.data.data
      setForm({
        name: d.name, brand: d.brand || '', model: d.model || '', serial_number: d.serial_number || '',
        category_id: d.category.id, location_id: d.location.id, status: d.status, condition: d.condition,
        acquisition_date: d.acquisition_date || '', acquisition_cost: d.acquisition_cost || '',
        supplier: d.supplier || '', warranty_expiry: d.warranty_expiry || '', remarks: d.remarks || '',
      })
    })
  }, [id, isEdit])

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const resolveLocationId = async () => {
    const typedLocation = locationInput.trim()

    if (!typedLocation) {
      return null
    }

    const normalizedTypedLocation = typedLocation.toLowerCase()

    const matchedLocation = locations.find((location) => {
      const label = location.label || [location.building, location.floor, location.room].filter(Boolean).join(' - ')
      return label.toLowerCase() === normalizedTypedLocation
    })

    if (matchedLocation) {
      setForm((f) => ({ ...f, location_id: matchedLocation.id }))
      return matchedLocation.id
    }

    const response = await createLocation({
      building: typedLocation,
      floor: '',
      room: '',
      custodian: '',
    })

    const newLocation = response.data

    setLocations((currentLocations) => [...currentLocations, newLocation])
    setForm((f) => ({ ...f, location_id: newLocation.id }))

    return newLocation.id
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      const resolvedLocationId = await resolveLocationId()

      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          if (key === 'location_id' && resolvedLocationId) {
            formData.append(key, resolvedLocationId)
            return
          }

          formData.append(key, value)
        }
      })

      if (resolvedLocationId) {
        formData.set('location_id', resolvedLocationId)
      }

      if (imageFile) formData.append('image', imageFile)

      if (isEdit) {
        await updateEquipment(id, formData)

        if (embedded) {
          if (typeof onSaved === 'function') onSaved(id)
          if (typeof onClose === 'function') onClose()
          return
        }

        navigate(`/equipment/${id}`)
      } else {
        const res = await createEquipment(formData)

        if (embedded) {
          if (typeof onSaved === 'function') onSaved(res.data.data.id)
          if (typeof onClose === 'function') onClose()
          return
        }

        navigate(`/equipment/${res.data.data.id}`)
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blueprint'
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5'

  const fieldError = (key) => errors[key] && <p className="text-xs text-status-damaged mt-1">{errors[key][0]}</p>

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6 max-w-3xl'}>
      {!embedded && (
        <Link to="/equipment" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blueprint w-fit">
          <ArrowLeft size={15} /> Back to inventory
        </Link>
      )}

      <div className={embedded ? 'flex items-center justify-between gap-3 border-b border-slate-200 pb-3' : ''}>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {isEdit ? 'Edit Equipment' : 'Add Equipment'}
        </h2>

        {embedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="close-button"
            aria-label="Close add equipment form"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={embedded ? 'space-y-5 pt-1' : 'tag-card space-y-5'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Equipment Name</label>
            <input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
            {fieldError('name')}
          </div>

          <div>
            <label className={labelClass}>Brand</label>
            <input value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <input value={form.model} onChange={(e) => handleChange('model', e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Serial Number</label>
            <input value={form.serial_number} onChange={(e) => handleChange('serial_number', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Supplier</label>
            <input value={form.supplier} onChange={(e) => handleChange('supplier', e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select required value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className={inputClass}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {fieldError('category_id')}
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              required
              list="location-options"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Type a location"
              className={inputClass}
            />
            <datalist id="location-options">
              {locations.map((location) => (
                <option key={location.id} value={location.label || [location.building, location.floor, location.room].filter(Boolean).join(' - ')} />
              ))}
            </datalist>
            {fieldError('location_id')}
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className={inputClass}>
              <option value="operational">Operational</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="damaged">Damaged</option>
              <option value="decommissioned">Decommissioned</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition</label>
            <select value={form.condition} onChange={(e) => handleChange('condition', e.target.value)} className={inputClass}>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Acquisition Date</label>
            <input type="date" value={form.acquisition_date} onChange={(e) => handleChange('acquisition_date', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Acquisition Cost (PHP)</label>
            <input type="number" step="0.01" min="0" value={form.acquisition_cost} onChange={(e) => handleChange('acquisition_cost', e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Warranty Expiry</label>
            <input type="date" value={form.warranty_expiry} onChange={(e) => handleChange('warranty_expiry', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Remarks</label>
            <textarea rows={3} value={form.remarks} onChange={(e) => handleChange('remarks', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <Link to="/equipment" className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-ink">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blueprint text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-blueprint-light transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Equipment'}
          </button>
        </div>
      </form>
    </div>
  )
}

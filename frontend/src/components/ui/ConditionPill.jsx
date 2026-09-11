const CONDITION_LABELS = {
  new: 'New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export default function ConditionPill({ condition }) {
  return (
    <span className="status-pill bg-slate-100 text-slate-600 border border-slate-200">
      {CONDITION_LABELS[condition] || condition}
    </span>
  )
}

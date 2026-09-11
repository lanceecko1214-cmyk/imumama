const STATUS_CONFIG = {
  operational: { label: 'Operational', dot: 'bg-status-operational', text: 'text-status-operational' },
  under_maintenance: { label: 'Under Maintenance', dot: 'bg-status-maintenance', text: 'text-status-maintenance' },
  damaged: { label: 'Damaged', dot: 'bg-status-damaged', text: 'text-status-damaged' },
  decommissioned: { label: 'Decommissioned', dot: 'bg-status-decommissioned', text: 'text-status-decommissioned' },
}

export default function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.operational
  return (
    <span className={`status-pill bg-slate-50 border border-slate-200 ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

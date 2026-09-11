export default function StatCard({ label, value, sublabel, accent = false }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {sublabel && <p className="stat-card__meta">{sublabel}</p>}
    </div>
  )
}

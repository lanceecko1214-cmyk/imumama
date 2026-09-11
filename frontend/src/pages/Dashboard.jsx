import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react'
import { getDashboardSummary } from '../api/dashboard'
import StatCard from '../components/ui/StatCard.jsx'
import StatusPill from '../components/ui/StatusPill.jsx'

const STATUS_COLORS = {
  operational: '#1d7a58',
  under_maintenance: '#dca94b',
  damaged: '#d76f65',
  decommissioned: '#8ea2a1',
}

const STATUS_LABELS = {
  operational: 'Operational',
  under_maintenance: 'Under Maintenance',
  damaged: 'Damaged',
  decommissioned: 'Decommissioned',
}

const peso = (n) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n || 0)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-loading">Loading dashboard…</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-loading">Unable to load dashboard data.</div>
      </div>
    )
  }

  const statusData = Object.entries(data.by_status || {}).map(([status, total]) => ({
    status,
    label: STATUS_LABELS[status] || status,
    total,
    fill: STATUS_COLORS[status] || '#8A93A0',
  }))

  const chartData = (data.by_category || []).map((category) => ({
    name: category.name,
    total: Number(category.total || 0),
    secondary: Math.max(Number(category.total || 0) * 0.72, 0),
  }))

  const statusTotal = statusData.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h2>PPES Dashboard</h2>
        </div>

        <div className="dashboard-status-chip">
          <Sparkles size={14} />
          Live inventory snapshot
        </div>
      </header>

      <section className="kpi-grid">
        <StatCard label="Total Equipment" value={data.total_equipment} sublabel="Active inventory records" />
        <StatCard label="Total Asset Value" value={peso(data.total_value)} sublabel="Recorded acquisition cost" accent />
        <StatCard label="Needing Attention" value={data.needing_attention} sublabel="Under maintenance or damaged" />
        <StatCard label="Warranty Expiring" value={(data.warranty_expiring_soon || []).length} sublabel="Within the next 60 days" />
      </section>

      <section className="analytics-grid">
        <div className="analytics-card wave-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Analytics</p>
              <h3>Equipment activity by category</h3>
            </div>
            <div className="card-tag">Updated now</div>
          </div>

          <div className="wave-chart-wrap">
            <ResponsiveContainer width="100%" height={310}>
              <AreaChart data={chartData} margin={{ top: 16, right: 16, left: -18, bottom: 8 }}>
                <defs>
                  <linearGradient id="wavePrimary" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1d7a58" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#1d7a58" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="waveSecondary" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8cc7a4" stopOpacity={0.26} />
                    <stop offset="100%" stopColor="#8cc7a4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-16}
                  textAnchor="end"
                  height={52}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, 'Equipment']}
                  labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #dfeae3',
                    boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
                    backgroundColor: '#ffffff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="secondary"
                  stroke="#9ad3b0"
                  strokeWidth={2}
                  fill="url(#waveSecondary)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#1d7a58"
                  strokeWidth={3}
                  fill="url(#wavePrimary)"
                  fillOpacity={1}
                  activeDot={{ r: 5, fill: '#1d7a58', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card status-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Status</p>
              <h3>Equipment status</h3>
            </div>
          </div>

          <div className="status-summary">
            <div className="status-ring-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="total"
                    nameKey="label"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="status-center">
              <span className="status-center__label">Total</span>
              <strong>{statusTotal}</strong>
            </div>
          </div>

          <div className="status-legend">
            {statusData.map((item) => {
              const percentage = statusTotal ? Math.round((item.total / statusTotal) * 100) : 0

              return (
                <div key={item.status} className="legend-item">
                  <div className="legend-main">
                    <span className="legend-dot" style={{ backgroundColor: item.fill }} />
                    <span>{item.label}</span>
                  </div>
                  <div className="legend-meta">
                    <strong>{item.total}</strong>
                    <span>{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="info-grid">
        <div className="mini-card">
          <div className="card-header compact">
            <div>
              <p className="eyebrow">Priority</p>
              <h3>Warranty expiring soon</h3>
            </div>
            <div className="card-tag soft">
              <AlertTriangle size={14} />
              {data.warranty_expiring_soon?.length || 0}
            </div>
          </div>

          {data.warranty_expiring_soon?.length ? (
            <ul className="mini-list">
              {data.warranty_expiring_soon.map((item) => (
                <li key={item.id} className="mini-item">
                  <div className="mini-item__content">
                    <Link to={`/equipment/${item.id}`} className="mini-item__name">
                      {item.name}
                    </Link>
                    <span className="mini-item__code">{item.property_number}</span>
                  </div>
                  <span className="mini-item__date">
                    {new Date(item.warranty_expiry).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No warranties expiring in the next 60 days.</p>
          )}
        </div>

        <div className="mini-card">
          <div className="card-header compact">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h3>Recently added</h3>
            </div>
            <Link to="/equipment" className="card-link">
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <ul className="mini-list">
            {data.recently_added?.map((item) => (
              <li key={item.id} className="mini-item">
                <div className="mini-item__content">
                  <Link to={`/equipment/${item.id}`} className="mini-item__name">
                    {item.name}
                  </Link>
                  <span className="mini-item__code">{item.property_number}</span>
                </div>
                <StatusPill status={item.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

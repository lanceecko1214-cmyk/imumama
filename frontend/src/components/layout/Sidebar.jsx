import { NavLink } from 'react-router-dom'
import { LayoutGrid, Boxes, BarChart3, LogOut, Wrench } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/equipment', label: 'Equipment', icon: Boxes },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <Wrench size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="sidebar__brand-tag">DLSJBC · PPES</p>
          </div>
        </div>

        <h1 className="sidebar__title">Physical Plant &amp; Equipment System</h1>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
            }
          >
            <span className="sidebar__nav-icon">
              <Icon size={18} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <p>{user?.name}</p>
          <span>{user?.position || 'Physical Plant Office'}</span>
        </div>

        <button type="button" onClick={logout} className="sidebar__logout">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

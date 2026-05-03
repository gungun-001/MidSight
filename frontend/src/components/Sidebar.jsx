import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Upload, FileText, Settings, Activity } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload & Analyze', icon: Upload },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] glass-card rounded-none border-r border-t-0 border-b-0 border-l-0 flex flex-col z-40"
      style={{ borderRadius: '0 1.5rem 1.5rem 0' }}>
      
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(168,85,247,0.4)' }}>
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <span className="text-lg font-bold text-gradient-pink">MedSight</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'sidebar-item-active text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Version Footer */}
      <div className="px-6 py-4 flex items-center gap-2">
        <span className="font-mono text-xs text-white/30">v1.0.0-stable</span>
        <div className="pulse-dot-pink" style={{ width: 6, height: 6 }} />
      </div>
    </aside>
  )
}

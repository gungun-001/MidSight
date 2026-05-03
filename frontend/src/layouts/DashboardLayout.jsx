import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-[var(--sidebar-width)] min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

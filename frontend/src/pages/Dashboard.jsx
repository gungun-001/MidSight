import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, AlertCircle, CheckCircle, Activity, TrendingUp, FileText } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-sm">
        <p className="font-mono text-xs text-white/50 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white">
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [apiStatus, setApiStatus] = useState('checking')

  // Load real reports from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medsight_reports')
    if (saved) setReports(JSON.parse(saved))

    // Listen for storage changes (when user saves a report in Upload page)
    const handleStorage = () => {
      const updated = localStorage.getItem('medsight_reports')
      if (updated) setReports(JSON.parse(updated))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Check API health
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || ''
    fetch(`${apiBase}/health`)
      .then(r => r.json())
      .then(data => setApiStatus(data.model_loaded ? 'online' : 'degraded'))
      .catch(() => setApiStatus('offline'))
  }, [])

  // ── Build real-time data from saved reports ────────────────────────────────

  // Trend data: group reports by date
  const trendData = (() => {
    const last7Days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('en-CA') // YYYY-MM-DD
      last7Days.push({ date: dateStr, scans: 0, alerts: 0 })
    }

    reports.forEach(report => {
      if (!report.timestamp) return
      const reportDate = new Date(report.timestamp).toLocaleDateString('en-CA')
      const dayEntry = last7Days.find(d => d.date === reportDate)
      if (dayEntry) {
        dayEntry.scans += 1
        if (report.severity === 'Severe' || report.severity === 'Moderate') {
          dayEntry.alerts += 1
        }
      }
    })

    return last7Days
  })()

  // Class breakdown: count by disease type from real reports
  const classData = (() => {
    const counts = { Acne: 0, Eczema: 0, Psoriasis: 0, Normal: 0 }
    reports.forEach(r => {
      if (counts[r.disease] !== undefined) counts[r.disease] += 1
    })
    return [
      { name: 'Acne', count: counts.Acne, fill: 'url(#gradientPurple)' },
      { name: 'Eczema', count: counts.Eczema, fill: 'url(#gradientBlue)' },
      { name: 'Psoriasis', count: counts.Psoriasis, fill: 'url(#gradientPink)' },
      { name: 'Normal', count: counts.Normal, fill: 'url(#gradientGreen)' },
    ]
  })()

  // Stats from real data
  const totalScans = reports.length
  const severeCount = reports.filter(r => r.severity === 'Severe' || r.severity === 'Moderate').length
  const todayReports = reports.filter(r => {
    if (!r.timestamp) return false
    return new Date(r.timestamp).toDateString() === new Date().toDateString()
  })

  const stats = [
    {
      label: 'TOTAL SCANS',
      value: totalScans,
      icon: Eye,
      color: '#a855f7',
    },
    {
      label: 'ALERTS (M/S)',
      value: severeCount,
      icon: AlertCircle,
      color: '#ec4899',
    },
    {
      label: 'MODEL STATUS',
      value: apiStatus === 'online' ? 'Ready' : apiStatus === 'checking' ? '...' : 'Offline',
      icon: CheckCircle,
      color: apiStatus === 'online' ? '#22c55e' : '#f59e0b',
    },
    {
      label: 'TODAY\'S SCANS',
      value: todayReports.length,
      icon: Activity,
      color: '#a855f7',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Overview</h1>
        <p className="text-white/50">Real-time skin analysis metrics from your saved reports.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs tracking-widest text-white/40 uppercase">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Detection Trends (Last 7 Days)</h2>
          </div>
          {totalScans === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-white/30 text-sm">
              No scan data yet. Upload and save reports to see trends.
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="scans" name="scans" stroke="#ec4899" fill="url(#areaGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="alerts" name="alerts" stroke="#a855f7" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Class Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Class Breakdown</h2>
          {totalScans === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-white/30 text-sm text-center">
              No data yet.<br />Save reports to see breakdown.
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData} layout="vertical">
                  <defs>
                    <linearGradient id="gradientPurple" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="gradientBlue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="gradientPink" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                    <linearGradient id="gradientGreen" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-10 text-white/30 text-sm">
            No analyses yet. Go to Upload & Analyze to scan your first image.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-mono text-xs text-white/40 uppercase tracking-wider">Disease</th>
                  <th className="text-left py-3 px-4 font-mono text-xs text-white/40 uppercase tracking-wider">Severity</th>
                  <th className="text-left py-3 px-4 font-mono text-xs text-white/40 uppercase tracking-wider">Confidence</th>
                  <th className="text-left py-3 px-4 font-mono text-xs text-white/40 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{r.disease}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        r.severity === 'Mild' ? 'severity-mild' :
                        r.severity === 'Moderate' ? 'severity-moderate' : 'severity-severe'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-white/60">{(r.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono text-xs text-white/40">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reports.length > 5 && (
              <p className="text-center text-white/30 text-xs mt-3 font-mono">
                Showing 5 of {reports.length} reports — view all in Reports section
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

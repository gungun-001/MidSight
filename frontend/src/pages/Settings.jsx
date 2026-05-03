import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Cpu, Server, Gauge, Clock, Globe, Shield, RefreshCw } from 'lucide-react'

export default function Settings() {
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const apiBase = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${apiBase}/health`)
      const data = await response.json()
      setApiStatus(data)
    } catch {
      setApiStatus({ status: 'offline', model_loaded: false, version: 'unknown' })
    }
    setLoading(false)
  }

  useEffect(() => { checkHealth() }, [])

  const engineInfo = [
    { label: 'Model', value: 'MobileNetV2', icon: Cpu },
    { label: 'Backend', value: 'TensorFlow / Keras', icon: Server },
    { label: 'Input Size', value: '224 × 224 px', icon: Gauge },
    { label: 'Inference', value: '< 3 seconds', icon: Clock },
    { label: 'API Base', value: import.meta.env.VITE_API_URL || 'localhost:8000', icon: Globe },
    { label: 'Classes', value: 'Acne, Eczema, Psoriasis, Normal', icon: Shield },
  ]

  const severityThresholds = [
    { label: 'Mild', range: '< 50%', color: '#22c55e' },
    { label: 'Moderate', range: '50% – 75%', color: '#f59e0b' },
    { label: 'Severe', range: '≥ 75%', color: '#ef4444' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/50">Model configuration and system information.</p>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="glass-btn px-5 py-2.5 text-sm flex items-center gap-2 text-white/60 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-purple-400" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white/80">API Status</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 py-8 justify-center">
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-white/40 text-sm">Checking API health...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-white/50 text-sm">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className={apiStatus?.status === 'healthy' ? 'pulse-dot' : 'pulse-dot-pink'} />
                  <span className={`font-mono text-sm font-bold ${apiStatus?.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                    {apiStatus?.status === 'healthy' ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-white/50 text-sm">Model Loaded</span>
                <span className={`font-mono text-sm font-bold ${apiStatus?.model_loaded ? 'text-green-400' : 'text-yellow-400'}`}>
                  {apiStatus?.model_loaded ? 'YES' : 'NO'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-white/50 text-sm">API Version</span>
                <span className="font-mono text-sm text-white/80">{apiStatus?.version || '—'}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Engine Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white/80">Engine Info</h2>
          </div>

          <div className="space-y-3">
            {engineInfo.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white/30" />
                    <span className="text-white/50 text-sm">{info.label}</span>
                  </div>
                  <span className="font-mono text-xs text-white/80 bg-white/5 px-3 py-1 rounded-lg">{info.value}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Severity Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6">
            <Gauge className="w-5 h-5 text-purple-400" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white/80">Severity Thresholds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {severityThresholds.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-5 rounded-xl border transition-all hover:scale-[1.02]"
                style={{
                  background: `${t.color}08`,
                  borderColor: `${t.color}30`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}80` }} />
                  <span className="font-bold text-white">{t.label}</span>
                </div>
                <p className="font-mono text-2xl font-bold" style={{ color: t.color }}>{t.range}</p>
                <p className="text-white/30 text-xs mt-1">confidence threshold</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

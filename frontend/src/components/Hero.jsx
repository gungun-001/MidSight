import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Hero section — MedSight clinical style
 * Terminal-style text, teal accents, live stats counters
 */
export default function Hero() {
  const [count, setCount] = useState({ detections: 0, fps: 0, latency: 0 })

  // Animate counters on mount
  useEffect(() => {
    const targets = { detections: 1240, fps: 10, latency: 280 }
    const duration = 1800
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount({
        detections: Math.round(targets.detections * ease),
        fps: Math.round(targets.fps * ease),
        latency: Math.round(targets.latency * ease),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [])

  const scrollToAnalyze = () => {
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' })
  }

  const stats = [
    { value: `${count.detections}+`, label: 'detections processed', icon: '◈' },
    { value: `${count.fps} FPS`, label: 'edge inference', icon: '◈' },
    { value: `<${count.latency}ms`, label: 'latency', icon: '◈' },
  ]

  return (
    <section className="relative pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* System status bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-6 px-5 py-2 rounded-full font-mono text-xs"
            style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}>
            <span className="status-online">
              <span className="status-dot" />
              SYSTEM ONLINE
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'rgba(0,212,170,0.6)' }}>AI HEALTHCARE VISION</span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'var(--text-dim)' }}>v1.0.0-stable</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6"
        >
          {/* Pre-label */}
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: '#00d4aa' }}>
            ◈ AI DERMATOLOGY ANALYSIS SYSTEM ◈
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-2">
            <span className="text-white">AI </span>
            <span className="teal-text">Skin Disease</span>
            <br />
            <span className="text-white">Detection </span>
            <span style={{ color: 'var(--text-secondary)' }}>&</span>
            <br />
            <span className="teal-text">Severity Analysis</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}
        >
          Real-time computer vision for dermatological analysis. Detect skin conditions,
          assess severity, and receive clinical recommendations — powered by MobileNetV2
          deep learning inference.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={scrollToAnalyze}
            className="relative px-8 py-3.5 rounded-xl font-mono font-semibold text-sm tracking-wider uppercase overflow-hidden group w-full sm:w-auto"
            style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.5)', color: '#00d4aa' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Hover fill */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ background: 'rgba(0,212,170,0.18)' }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            {/* Glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 20px rgba(0,212,170,0.3)' }} />
            <span className="relative flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Start Scanning
            </span>
          </motion.button>

          {/* Secondary */}
          <motion.a
            href="#"
            className="px-8 py-3.5 rounded-xl font-mono text-sm tracking-wider uppercase w-full sm:w-auto text-center transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
            whileHover={{ borderColor: 'rgba(0,212,170,0.3)', color: '#00d4aa', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Browser-based Inference
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-mono font-bold text-2xl teal-text">{stat.value}</div>
              <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}

          {/* Dividers */}
          <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(0,212,170,0.15)' }} />

          {/* Version tag */}
          <div className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            v1.0.0-stable · DermAI Vision Platform
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          {[
            'Real-time Alerts',
            'Clinical-grade Reports',
            'MobileNetV2 CNN',
            'Severity Classification',
          ].map((pill) => (
            <span
              key={pill}
              className="font-mono text-xs px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0,212,170,0.05)',
                border: '1px solid rgba(0,212,170,0.15)',
                color: 'rgba(0,212,170,0.7)',
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center font-mono text-xs mt-8"
          style={{ color: 'var(--text-dim)' }}
        >
          ⚠ For educational purposes only. Not a substitute for professional medical advice.
        </motion.p>
      </div>
    </section>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Clinical footer — MedSight style
 */
export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 py-8 px-4"
      style={{ borderTop: '1px solid rgba(0,212,170,0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-sm">DermAI</span>
              <span className="font-mono text-[10px] ml-2 px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(0,212,170,0.08)', color: 'rgba(0,212,170,0.6)', border: '1px solid rgba(0,212,170,0.15)' }}>
                v1.0.0-stable
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="status-online text-xs">
            <span className="status-dot" />
            SYSTEM ONLINE · AI HEALTHCARE VISION PLATFORM
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            © 2025 DermAI · Educational use only
          </p>
        </div>

        {/* Tech stack */}
        <div className="mt-6 pt-5 flex flex-wrap items-center justify-center gap-2"
          style={{ borderTop: '1px solid rgba(0,212,170,0.05)' }}>
          {[
            { label: 'React 18', color: 'rgba(0,207,232,0.7)' },
            { label: 'FastAPI', color: 'rgba(0,212,170,0.7)' },
            { label: 'MobileNetV2', color: 'rgba(0,212,170,0.7)' },
            { label: 'TensorFlow 2.21', color: 'rgba(245,158,11,0.7)' },
            { label: 'Tailwind CSS', color: 'rgba(0,207,232,0.7)' },
            { label: 'Framer Motion', color: 'rgba(167,139,250,0.7)' },
          ].map((tech) => (
            <span key={tech.label} className="font-mono text-[10px] px-2 py-1 rounded"
              style={{
                background: 'rgba(0,212,170,0.03)',
                border: '1px solid rgba(0,212,170,0.08)',
                color: tech.color,
              }}>
              {tech.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

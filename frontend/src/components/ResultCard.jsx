import React from 'react'
import { motion } from 'framer-motion'

/**
 * Clinical result card — MedSight style
 * Teal/navy palette, mono labels, terminal-style data display
 */
export default function ResultCard({ result, previewImage, onReset }) {
  const { disease, severity, confidence, suggestions } = result

  // Severity config
  const severityConfig = {
    Mild: {
      color: '#00d4aa',
      bg: 'rgba(0,212,170,0.08)',
      border: 'rgba(0,212,170,0.3)',
      glow: 'rgba(0,212,170,0.15)',
      bar: 'linear-gradient(90deg, #00d4aa, #00cfe8)',
      code: 'SEV_LOW',
      pct: 33,
    },
    Moderate: {
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.3)',
      glow: 'rgba(245,158,11,0.1)',
      bar: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      code: 'SEV_MED',
      pct: 66,
    },
    Severe: {
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.3)',
      glow: 'rgba(239,68,68,0.1)',
      bar: 'linear-gradient(90deg, #ef4444, #f87171)',
      code: 'SEV_HIGH',
      pct: 100,
    },
  }

  const diseaseInfo = {
    Acne: { icon: '◈', code: 'COND_001', desc: 'Inflammatory follicular condition' },
    Eczema: { icon: '◈', code: 'COND_002', desc: 'Chronic inflammatory dermatitis' },
    Psoriasis: { icon: '◈', code: 'COND_003', desc: 'Autoimmune epidermal condition' },
    Normal: { icon: '◈', code: 'COND_000', desc: 'No significant condition detected' },
  }

  const sev = severityConfig[severity] || severityConfig.Mild
  const dis = diseaseInfo[disease] || { icon: '◈', code: 'COND_UNK', desc: 'Skin condition detected' }
  const confidencePct = Math.round(confidence * 100)

  const getConfLabel = (pct) => {
    if (pct >= 85) return { label: 'HIGH_CONF', color: '#00d4aa' }
    if (pct >= 70) return { label: 'MED_CONF', color: '#00cfe8' }
    if (pct >= 55) return { label: 'LOW_CONF', color: '#f59e0b' }
    return { label: 'UNCERTAIN', color: '#ef4444' }
  }
  const confLabel = getConfLabel(confidencePct)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="font-mono text-xs tracking-widest uppercase" style={{ color: '#00d4aa' }}>
            ◈ ANALYSIS COMPLETE
          </div>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,212,170,0.15)' }} />
          <div className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
            ✓ SCAN_COMPLETE
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Detection Results</h2>
        <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
          // AI classification report · {new Date().toLocaleString()}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left column ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Analyzed image */}
          <div className="rounded-xl overflow-hidden relative"
            style={{ background: 'var(--navy-card)', border: '1px solid rgba(0,212,170,0.15)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(0,212,170,0.08)' }}>
              <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>INPUT_IMAGE</span>
              <span className="font-mono text-[10px]" style={{ color: '#00d4aa' }}>◈ ANALYZED</span>
            </div>
            <div className="p-3">
              <div className="relative rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
                <img src={previewImage} alt="Analyzed" className="w-full h-40 object-cover" />
                {/* Corner brackets */}
                {['top-1 left-1 border-t border-l','top-1 right-1 border-t border-r',
                  'bottom-1 left-1 border-b border-l','bottom-1 right-1 border-b border-r'].map((cls, i) => (
                  <div key={i} className={`absolute w-3 h-3 ${cls}`}
                    style={{ borderColor: '#00d4aa', opacity: 0.7 }} />
                ))}
                <div className="absolute bottom-1.5 right-1.5 font-mono text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#00d4aa' }}>
                  AI_PROCESSED
                </div>
              </div>
            </div>
          </div>

          {/* Disease classification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background: 'var(--navy-card)',
              border: '1px solid rgba(0,212,170,0.2)',
              boxShadow: '0 0 20px rgba(0,212,170,0.05)',
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)' }} />

            <div className="font-mono text-[10px] mb-3" style={{ color: 'var(--text-dim)' }}>
              CLASSIFICATION_RESULT:
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                <span style={{ color: '#00d4aa', fontSize: '14px' }}>{dis.icon}</span>
              </div>
              <div>
                <div className="text-xl font-black text-white">{disease}</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(0,212,170,0.6)' }}>
                  [{dis.code}]
                </div>
                <div className="font-mono text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                  {dis.desc}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right columns ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Severity + Confidence row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Severity */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl p-4 relative overflow-hidden"
              style={{
                background: sev.bg,
                border: `1px solid ${sev.border}`,
                boxShadow: `0 0 20px ${sev.glow}`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${sev.color}, transparent)` }} />

              <div className="font-mono text-[10px] mb-3" style={{ color: 'var(--text-dim)' }}>
                SEVERITY_LEVEL:
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full"
                  style={{ background: sev.color, boxShadow: `0 0 8px ${sev.color}` }} />
                <span className="text-2xl font-black" style={{ color: sev.color }}>{severity}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded ml-auto"
                  style={{ background: `${sev.bg}`, border: `1px solid ${sev.border}`, color: sev.color }}>
                  {sev.code}
                </span>
              </div>

              {/* Severity scale */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px]" style={{ color: 'var(--text-dim)' }}>
                  <span>MILD</span><span>MODERATE</span><span>SEVERE</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: sev.bar, boxShadow: `0 0 6px ${sev.color}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${sev.pct}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Confidence */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl p-4 relative overflow-hidden"
              style={{ background: 'var(--navy-card)', border: '1px solid rgba(0,212,170,0.2)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)' }} />

              <div className="font-mono text-[10px] mb-3" style={{ color: 'var(--text-dim)' }}>
                CONFIDENCE_SCORE:
              </div>

              <div className="flex items-center gap-4 mb-3">
                {/* Circular gauge */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="rgba(0,212,170,0.08)" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="url(#tealGrad)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${confidencePct} 100`}
                      initial={{ strokeDasharray: '0 100' }}
                      animate={{ strokeDasharray: `${confidencePct} 100` }}
                      transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00d4aa" />
                        <stop offset="100%" stopColor="#00cfe8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono font-bold text-sm" style={{ color: '#00d4aa' }}>
                      {confidencePct}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-sm font-bold" style={{ color: confLabel.color }}>
                    {confLabel.label}
                  </div>
                  <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    model certainty
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(0,212,170,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00d4aa, #00cfe8)', boxShadow: '0 0 6px rgba(0,212,170,0.5)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePct}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="font-mono text-[9px] mt-1" style={{ color: 'var(--text-dim)' }}>
                {confidencePct}% · {confidence.toFixed(4)} raw score
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--navy-card)', border: '1px solid rgba(0,212,170,0.15)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(0,212,170,0.08)', background: 'rgba(0,212,170,0.03)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color: '#00d4aa' }}>◈ CLINICAL_RECOMMENDATIONS</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: 'rgba(0,212,170,0.7)' }}>
                {suggestions?.length || 0} ITEMS
              </span>
            </div>

            <div className="p-4 space-y-2">
              {suggestions?.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                  style={{ background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.06)' }}
                  whileHover={{ borderColor: 'rgba(0,212,170,0.15)', background: 'rgba(0,212,170,0.05)' }}
                >
                  <span className="font-mono text-[10px] flex-shrink-0 mt-0.5 w-12"
                    style={{ color: 'rgba(0,212,170,0.5)' }}>
                    REC_{String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {suggestion}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-3 rounded-lg flex items-start gap-3 font-mono text-xs"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
          >
            <span style={{ color: '#f59e0b' }}>⚠ DISCLAIMER:</span>
            <span style={{ color: 'rgba(245,158,11,0.7)' }}>
              This AI analysis is for informational purposes only. Not a substitute for
              professional medical advice. Consult a qualified dermatologist.
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
      >
        <motion.button
          onClick={onReset}
          className="relative px-8 py-3 rounded-xl font-mono text-sm font-semibold tracking-wider uppercase overflow-hidden group"
          style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.4)', color: '#00d4aa' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <motion.div className="absolute inset-0 rounded-xl"
            style={{ background: 'rgba(0,212,170,0.15)' }}
            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
          <span className="relative flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            [ NEW SCAN ]
          </span>
        </motion.button>

        <motion.button
          onClick={() => window.print()}
          className="px-8 py-3 rounded-xl font-mono text-sm tracking-wider uppercase transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
          whileHover={{ borderColor: 'rgba(0,212,170,0.3)', color: '#00d4aa', scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          [ EXPORT REPORT ]
        </motion.button>
      </motion.div>
    </div>
  )
}

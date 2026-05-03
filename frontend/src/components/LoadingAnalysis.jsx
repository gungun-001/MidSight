import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Clinical scanning animation — MedSight style
 * Terminal log output, scan overlay, teal progress
 */
export default function LoadingAnalysis({ previewImage }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [logLines, setLogLines] = useState([])

  const steps = [
    { label: 'Preprocessing image buffer...', code: 'PROC_001', duration: 700 },
    { label: 'Loading MobileNetV2 weights...', code: 'MODEL_002', duration: 900 },
    { label: 'Running CNN forward pass...', code: 'INFER_003', duration: 1100 },
    { label: 'Classifying skin condition...', code: 'CLASS_004', duration: 800 },
    { label: 'Computing severity score...', code: 'SEV_005', duration: 600 },
    { label: 'Generating recommendations...', code: 'REC_006', duration: 500 },
  ]

  useEffect(() => {
    let timeout
    const advance = (step) => {
      // Add log line
      setLogLines(prev => [...prev, {
        time: new Date().toTimeString().slice(0, 8),
        code: steps[step].code,
        label: steps[step].label,
      }])
      if (step < steps.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStep(step + 1)
          advance(step + 1)
        }, steps[step].duration)
      }
    }
    advance(0)
    return () => clearTimeout(timeout)
  }, [])

  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--navy-card)', border: '1px solid rgba(0,212,170,0.2)' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(0,212,170,0.1)', background: 'rgba(0,212,170,0.04)' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {['#ef4444','#f59e0b','#00d4aa'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
              ))}
            </div>
            <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
              dermai_analysis.py — running
            </span>
          </div>
          <div className="status-online text-[10px]">
            <span className="status-dot" />
            PROCESSING
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Image with scan */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(0,212,170,0.4)' }}>
                {previewImage && (
                  <img src={previewImage} alt="Scanning" className="w-full h-full object-cover" />
                )}
                {/* Scan line */}
                <div className="scan-line" />
                {/* Grid overlay on image */}
                <div className="absolute inset-0 grid-overlay opacity-30" />
                {/* Corner brackets */}
                {[
                  'top-1.5 left-1.5 border-t border-l',
                  'top-1.5 right-1.5 border-t border-r',
                  'bottom-1.5 left-1.5 border-b border-l',
                  'bottom-1.5 right-1.5 border-b border-r',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-3 h-3 ${cls}`}
                    style={{ borderColor: '#00d4aa' }} />
                ))}
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-2 rounded-lg"
                  style={{ border: '1px solid rgba(0,212,170,0.3)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Progress below image */}
              <div className="mt-3">
                <div className="flex justify-between font-mono text-[10px] mb-1"
                  style={{ color: 'var(--text-dim)' }}>
                  <span>SCAN PROGRESS</span>
                  <span style={{ color: '#00d4aa' }}>{progress}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(0,212,170,0.1)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00d4aa, #00cfe8)', boxShadow: '0 0 8px rgba(0,212,170,0.5)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Terminal log */}
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs mb-3" style={{ color: '#00d4aa' }}>
                ◈ ANALYSIS LOG
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: index <= currentStep ? 1 : 0.2, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-2 font-mono text-xs"
                  >
                    {/* Status icon */}
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      {index < currentStep ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: '#00d4aa' }}
                        >✓</motion.span>
                      ) : index === currentStep ? (
                        <motion.div
                          className="w-3 h-3 rounded-full border border-t-transparent"
                          style={{ borderColor: '#00d4aa' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.1)' }}>○</span>
                      )}
                    </div>

                    {/* Code */}
                    <span style={{ color: index <= currentStep ? 'rgba(0,212,170,0.5)' : 'rgba(255,255,255,0.1)' }}>
                      [{step.code}]
                    </span>

                    {/* Label */}
                    <span style={{
                      color: index < currentStep ? '#00d4aa'
                        : index === currentStep ? 'var(--text-primary)'
                        : 'rgba(255,255,255,0.15)'
                    }}>
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Terminal output */}
              <div className="rounded-lg p-3 font-mono text-[10px] space-y-1 max-h-24 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,212,170,0.08)' }}>
                {logLines.slice(-4).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <span style={{ color: 'var(--text-dim)' }}>{line.time}</span>
                    <span style={{ color: 'rgba(0,212,170,0.5)' }}>[INFO]</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{line.label}</span>
                  </motion.div>
                ))}
                {/* Blinking cursor */}
                <div className="flex gap-2">
                  <span style={{ color: 'var(--text-dim)' }}>
                    {new Date().toTimeString().slice(0, 8)}
                  </span>
                  <span style={{ color: '#00d4aa' }}>
                    _<motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >█</motion.span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="px-5 py-2 flex items-center justify-between font-mono text-[10px]"
          style={{ borderTop: '1px solid rgba(0,212,170,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <span style={{ color: 'var(--text-dim)' }}>MobileNetV2 · 224×224 · 4 classes</span>
          <motion.span
            style={{ color: '#00d4aa' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ◈ ANALYZING...
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}

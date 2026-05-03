import React from 'react'
import { motion } from 'framer-motion'

/**
 * Clinical dark background — navy base with teal grid, orbs, and scan lines
 * Matches the MedSight reference app aesthetic
 */
export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep navy base */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0a0f1e 40%, #0d1526 100%)' }} />

      {/* Teal grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-100" />

      {/* Primary teal orb — top left */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 65%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cyan orb — top right */}
      <motion.div
        className="absolute -top-20 right-0 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,207,232,0.06) 0%, transparent 65%)', filter: 'blur(50px)' }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bottom teal glow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-48 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ scaleX: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vertical scan lines (decorative) */}
      {[15, 35, 55, 75, 90].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${left}%`, background: 'linear-gradient(180deg, transparent, rgba(0,212,170,0.04), transparent)' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}

      {/* Floating data points */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${12 + i * 11}%`,
            top: `${20 + (i * 13) % 60}%`,
            background: i % 2 === 0 ? 'rgba(0,212,170,0.7)' : 'rgba(0,207,232,0.5)',
            boxShadow: `0 0 4px ${i % 2 === 0 ? 'rgba(0,212,170,0.8)' : 'rgba(0,207,232,0.6)'}`,
          }}
          animate={{ y: [-15, 15, -15], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Horizontal scan line (moving) */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.15), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

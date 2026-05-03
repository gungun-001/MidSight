import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Clinical navigation bar — MedSight style
 * Dark navy with teal accents, mono font, system status indicator
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(timer) }
  }, [])

  const scrollToAnalyze = () => {
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' })
  }

  const timeStr = time.toTimeString().slice(0, 8)

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,15,30,0.95)' : 'rgba(10,15,30,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,212,170,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
            {/* Icon */}
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-wide">DermAI</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                  v1.0.0
                </span>
              </div>
              <div className="status-online text-[10px]">
                <span className="status-dot" />
                SYSTEM ONLINE
              </div>
            </div>
          </motion.div>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-6">
            {['Analysis', 'Features', 'About'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="font-mono text-xs tracking-widest uppercase transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                whileHover={{ color: '#00d4aa', y: -1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Live clock */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs"
              style={{ color: 'var(--text-dim)' }}>
              <span style={{ color: 'rgba(0,212,170,0.5)' }}>◈</span>
              {timeStr}
            </div>

            {/* CTA */}
            <motion.button
              onClick={scrollToAnalyze}
              className="relative px-4 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-wider uppercase overflow-hidden group"
              style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.4)', color: '#00d4aa' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(0,212,170,0.15)' }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative">[ ANALYZE ]</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Bell, FileCheck, Activity, Zap, Shield } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute bottom-[20%] left-[50%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)', filter: 'blur(120px)' }} />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(168,85,247,0.4)' }}>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-lg font-bold text-gradient-pink">MedSight</span>
        </div>
        <div className="glass-btn px-4 py-2 flex items-center gap-2 text-sm font-mono">
          <div className="pulse-dot" />
          <span className="text-green-400 uppercase tracking-widest text-xs font-bold">System Online</span>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-btn px-5 py-2 mb-8 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="font-mono text-xs tracking-widest uppercase text-white/80">AI Skin Disease Detection</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-white">AI Skin Disease</span>
          <br />
          <span className="text-gradient-pink">Analysis System</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-10"
        >
          Real-time deep learning analysis for dermatological conditions. Detect Acne, Eczema, 
          Psoriasis with severity assessment and personalized treatment recommendations — 
          powered by MobileNetV2 neural inference.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upload')}
          className="gradient-btn px-10 py-5 text-lg font-semibold flex items-center gap-3 mb-16"
        >
          Start Scanning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {[
            { icon: Cpu, label: 'Deep Learning Inference' },
            { icon: Bell, label: 'Severity Alerts' },
            { icon: FileCheck, label: 'Clinical Recommendations' },
          ].map((pill) => (
            <div key={pill.label} className="glass-btn px-4 py-2.5 flex items-center gap-2 text-sm">
              <pill.icon className="w-4 h-4 text-purple-400" />
              <span className="text-white/80">{pill.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3 text-white/30 font-mono text-xs"
        >
          <span><strong className="text-white/60">4</strong> disease classes</span>
          <span>•</span>
          <span><strong className="text-white/60">224×224</strong> input resolution</span>
          <span>•</span>
          <span><strong className="text-white/60">&lt;3s</strong> inference time</span>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6">
        <span className="font-mono text-xs text-white/20">v1.0.0-stable · MedSight AI Platform</span>
      </footer>
    </div>
  )
}

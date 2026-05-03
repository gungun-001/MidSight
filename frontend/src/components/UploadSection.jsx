import React, { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

/**
 * Clinical-style drag & drop upload — MedSight aesthetic
 * Teal borders, mono labels, corner brackets
 */
export default function UploadSection({ onUpload, error }) {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [validationError, setValidationError] = useState('')

  const MAX_SIZE = 10 * 1024 * 1024

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setValidationError('')
    if (rejectedFiles.length > 0) {
      const code = rejectedFiles[0].errors[0]?.code
      if (code === 'file-too-large') setValidationError('FILE_TOO_LARGE: Maximum size is 10MB.')
      else if (code === 'file-invalid-type') setValidationError('INVALID_TYPE: Please upload JPG, PNG, or WebP.')
      else setValidationError('UPLOAD_ERROR: Invalid file. Please try again.')
      return
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: MAX_SIZE,
    multiple: false,
  })

  const handleAnalyze = () => { if (selectedFile) onUpload(selectedFile) }
  const handleClear = () => { setPreview(null); setSelectedFile(null); setValidationError('') }

  const borderColor = isDragReject
    ? 'rgba(239,68,68,0.6)'
    : isDragActive
    ? 'rgba(0,212,170,0.8)'
    : preview
    ? 'rgba(0,212,170,0.5)'
    : 'rgba(0,212,170,0.2)'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Terminal-style label */}
        <div className="flex items-center gap-3 mb-3">
          <div className="font-mono text-xs tracking-widest uppercase" style={{ color: '#00d4aa' }}>
            ◈ DERMAL SCAN INTERFACE
          </div>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,212,170,0.15)' }} />
          <div className="status-online text-[10px]">
            <span className="status-dot" />
            READY
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Upload Skin Image</h2>
        <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
          // Upload a clear, well-lit photo of the affected skin area for AI analysis
        </p>
      </motion.div>

      {/* Error banner */}
      <AnimatePresence>
        {(error || validationError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 p-3 rounded-lg font-mono text-xs flex items-start gap-3"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <span className="flex-shrink-0">⚠ ERROR:</span>
            <span>{error || validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'var(--navy-card)',
          border: `1px solid ${borderColor}`,
          boxShadow: isDragActive ? '0 0 30px rgba(0,212,170,0.15)' : 'none',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)` }} />

        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-4 h-4"
          style={{ borderTop: '1px solid rgba(0,212,170,0.5)', borderLeft: '1px solid rgba(0,212,170,0.5)' }} />
        <div className="absolute top-3 right-3 w-4 h-4"
          style={{ borderTop: '1px solid rgba(0,212,170,0.5)', borderRight: '1px solid rgba(0,212,170,0.5)' }} />
        <div className="absolute bottom-3 left-3 w-4 h-4"
          style={{ borderBottom: '1px solid rgba(0,212,170,0.5)', borderLeft: '1px solid rgba(0,212,170,0.5)' }} />
        <div className="absolute bottom-3 right-3 w-4 h-4"
          style={{ borderBottom: '1px solid rgba(0,212,170,0.5)', borderRight: '1px solid rgba(0,212,170,0.5)' }} />

        {/* Drag active overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'rgba(0,212,170,0.04)' }}
            />
          )}
        </AnimatePresence>

        {!preview ? (
          /* Drop zone */
          <div {...getRootProps()} className="p-12 text-center cursor-pointer select-none">
            <input {...getInputProps()} />
            <motion.div
              animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
              className="flex flex-col items-center gap-5"
            >
              {/* Upload icon */}
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: isDragActive ? 'rgba(0,212,170,0.15)' : 'rgba(0,212,170,0.06)',
                    border: `1px solid ${isDragActive ? 'rgba(0,212,170,0.6)' : 'rgba(0,212,170,0.2)'}`,
                  }}
                  animate={isDragActive ? { boxShadow: '0 0 20px rgba(0,212,170,0.3)' } : {}}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    style={{ color: isDragActive ? '#00d4aa' : 'rgba(0,212,170,0.5)' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                {/* Pulse ring when dragging */}
                {isDragActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ border: '1px solid rgba(0,212,170,0.4)' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </div>

              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {isDragActive ? 'Drop image to scan' : 'Drag & drop skin image'}
                </p>
                <p className="font-mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
                  or click to browse from device
                </p>
                <div className="flex items-center justify-center gap-2 font-mono text-xs"
                  style={{ color: 'var(--text-dim)' }}>
                  {['JPG', 'PNG', 'WebP'].map(fmt => (
                    <span key={fmt} className="px-2 py-0.5 rounded"
                      style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', color: 'rgba(0,212,170,0.6)' }}>
                      {fmt}
                    </span>
                  ))}
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                  <span>MAX 10MB</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Preview */
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Image preview with scan overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex-shrink-0"
              >
                <div className="w-44 h-44 rounded-xl overflow-hidden relative"
                  style={{ border: '1px solid rgba(0,212,170,0.4)' }}>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  {/* Scan line on preview */}
                  <div className="scan-line" />
                  {/* Corner brackets on image */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3"
                    style={{ borderTop: '1px solid #00d4aa', borderLeft: '1px solid #00d4aa' }} />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3"
                    style={{ borderTop: '1px solid #00d4aa', borderRight: '1px solid #00d4aa' }} />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3"
                    style={{ borderBottom: '1px solid #00d4aa', borderLeft: '1px solid #00d4aa' }} />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3"
                    style={{ borderBottom: '1px solid #00d4aa', borderRight: '1px solid #00d4aa' }} />
                </div>
                {/* Status badge */}
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded font-mono text-[10px]"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.4)', color: '#00ff88' }}>
                  LOADED
                </div>
              </motion.div>

              {/* File info */}
              <div className="flex-1 text-center md:text-left">
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                  FILE_LOADED:
                </div>
                <p className="text-white font-semibold mb-0.5 truncate max-w-xs">
                  {selectedFile?.name}
                </p>
                <p className="font-mono text-xs mb-5" style={{ color: 'var(--text-dim)' }}>
                  {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
                  · {selectedFile?.type?.split('/')[1]?.toUpperCase()}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Analyze */}
                  <motion.button
                    onClick={handleAnalyze}
                    className="relative px-6 py-2.5 rounded-lg font-mono text-sm font-semibold tracking-wider uppercase overflow-hidden group"
                    style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.5)', color: '#00d4aa' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(0,212,170,0.18)' }}
                      initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
                    <span className="relative flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Run Analysis
                    </span>
                  </motion.button>

                  {/* Clear */}
                  <motion.button
                    onClick={handleClear}
                    className="px-6 py-2.5 rounded-lg font-mono text-sm tracking-wider uppercase transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
                    whileHover={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444', scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    [ CLEAR ]
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2"
      >
        {[
          { code: 'TIP_01', text: 'Use good lighting for best results' },
          { code: 'TIP_02', text: 'Keep affected area centered in frame' },
          { code: 'TIP_03', text: 'Higher resolution = better accuracy' },
        ].map((tip) => (
          <div key={tip.code} className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs"
            style={{ background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.08)', color: 'var(--text-dim)' }}>
            <span style={{ color: 'rgba(0,212,170,0.4)' }}>{tip.code}</span>
            <span>{tip.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

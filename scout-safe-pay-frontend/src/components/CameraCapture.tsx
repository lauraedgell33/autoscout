'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
  mode: 'selfie' | 'document'
  title?: string
}

export default function CameraCapture({ onCapture, onClose, mode, title }: CameraCaptureProps) {
  const t = useTranslations('kyc')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(mode === 'selfie')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [isFrontCamera])

  const startCamera = async () => {
    try {
      setError(null)
      setIsReady(false)
      
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsReady(true)
        }
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(t('camera.permission_denied'))
      } else if (err.name === 'NotFoundError') {
        setError(t('camera.not_found'))
      } else {
        setError(t('camera.error'))
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const switchCamera = () => {
    setIsFrontCamera(prev => !prev)
  }

  const startCountdown = () => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          capturePhoto()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mirror image for selfie mode
    if (mode === 'selfie') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    
    ctx.drawImage(video, 0, 0)
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageDataUrl)
    setCountdown(null)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const confirmPhoto = () => {
    if (!capturedImage) return

    // Convert data URL to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const filename = mode === 'selfie' ? 'selfie.jpg' : 'id-document.jpg'
        const file = new File([blob], filename, { type: 'image/jpeg' })
        onCapture(file)
        stopCamera()
        onClose()
      })
      .catch(err => {
        console.error('Error converting image:', err)
        setError(t('camera.capture_error'))
      })
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-white p-2 hover:bg-white/20 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-white font-semibold text-lg">
            {title || (mode === 'selfie' ? t('camera.selfie_title') : t('camera.document_title'))}
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Camera View / Captured Image */}
      <div className="flex-1 relative flex items-center justify-center">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`max-w-full max-h-full ${mode === 'selfie' ? 'scale-x-[-1]' : ''}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay Guide */}
            {isReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {mode === 'selfie' ? (
                  <div className="relative">
                    <div className="w-64 h-80 border-4 border-white/50 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full mt-96">
                        {t('camera.selfie_guide')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-96 h-64 border-4 border-white/50 rounded-2xl"></div>
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                      <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full whitespace-nowrap">
                        {t('camera.document_guide')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Countdown */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-white text-9xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
          </>
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center p-6">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                {t('camera.retry')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-6">
        {!capturedImage ? (
          <div className="flex items-center justify-center gap-8">
            {/* Switch Camera Button */}
            <button
              onClick={switchCamera}
              disabled={!isReady}
              className="text-white p-4 hover:bg-white/20 rounded-full transition disabled:opacity-50"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Capture Button */}
            <button
              onClick={mode === 'selfie' ? startCountdown : capturePhoto}
              disabled={!isReady}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:border-accent-500 transition disabled:opacity-50 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-lg"></div>
            </button>

            {/* Gallery Button (placeholder) */}
            <div className="w-16 h-16"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retakePhoto}
              className="px-8 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition"
            >
              {t('camera.retake')}
            </button>
            <button
              onClick={confirmPhoto}
              className="px-8 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition"
            >
              {t('camera.use_photo')}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isReady && !error && !capturedImage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 text-white px-6 py-3 rounded-full text-sm backdrop-blur-sm">
            {mode === 'selfie' ? (
              <p>{t('camera.selfie_instruction')}</p>
            ) : (
              <p>{t('camera.document_instruction')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

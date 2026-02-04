'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Upload, X, CheckCircle, SwitchCamera, RotateCcw, Check, User, FileText, AlertCircle } from 'lucide-react'

interface KYCData {
  document_type: 'passport' | 'id_card' | 'drivers_license'
  document_number: string
  document_front: File | null
  document_back: File | null
  selfie: File | null
}

interface InlineKYCCaptureProps {
  data: KYCData
  onChange: (data: KYCData) => void
  previews: {
    document_front: string | null
    document_back: string | null
    selfie: string | null
  }
  onPreviewChange: (previews: { document_front: string | null; document_back: string | null; selfie: string | null }) => void
}

type CaptureMode = 'document_front' | 'document_back' | 'selfie' | null

export default function InlineKYCCapture({ data, onChange, previews, onPreviewChange }: InlineKYCCaptureProps) {
  const [cameraMode, setCameraMode] = useState<CaptureMode>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'document_front' | 'document_back' | 'selfie') => {
    const file = e.target.files?.[0]
    if (file) {
      onChange({ ...data, [field]: file })
      const url = URL.createObjectURL(file)
      onPreviewChange({ ...previews, [field]: url })
    }
  }

  const handleCameraCapture = (file: File) => {
    if (cameraMode) {
      onChange({ ...data, [cameraMode]: file })
      const url = URL.createObjectURL(file)
      onPreviewChange({ ...previews, [cameraMode]: url })
    }
    setShowCamera(false)
    setCameraMode(null)
  }

  const removeImage = (field: 'document_front' | 'document_back' | 'selfie') => {
    onChange({ ...data, [field]: null })
    if (previews[field]) {
      URL.revokeObjectURL(previews[field]!)
      onPreviewChange({ ...previews, [field]: null })
    }
  }

  const openCamera = (mode: CaptureMode) => {
    setCameraMode(mode)
    setShowCamera(true)
  }

  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ID Type *
        </label>
        <select
          value={data.document_type}
          onChange={(e) => onChange({ ...data, document_type: e.target.value as any })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="id_card">🪪 ID Card</option>
          <option value="passport">📕 Passport</option>
          <option value="drivers_license">🚗 Driver's License</option>
        </select>
      </div>

      {/* Document Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ID Number *
        </label>
        <input
          type="text"
          value={data.document_number}
          onChange={(e) => onChange({ ...data, document_number: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          placeholder="Enter your document number"
          required
        />
      </div>

      {/* Document Front */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Upload Front Side *
        </label>
        {previews.document_front ? (
          <div className="relative">
            <img
              src={previews.document_front}
              alt="Document front"
              className="w-full h-40 object-cover rounded-xl border-2 border-green-500"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <CheckCircle size={12} /> Captured
              </span>
              <button
                type="button"
                onClick={() => removeImage('document_front')}
                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openCamera('document_front')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-600"
            >
              <Camera size={28} />
              <span className="text-sm font-medium">Take Photo</span>
            </button>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer">
              <Upload size={28} />
              <span className="text-sm font-medium">Upload File</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, 'document_front')}
                className="hidden"
              />
            </label>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Click to upload or take a photo of the front of your ID</p>
      </div>

      {/* Document Back */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Upload Back Side {data.document_type !== 'passport' ? '*' : '(optional)'}
        </label>
        {previews.document_back ? (
          <div className="relative">
            <img
              src={previews.document_back}
              alt="Document back"
              className="w-full h-40 object-cover rounded-xl border-2 border-green-500"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <CheckCircle size={12} /> Captured
              </span>
              <button
                type="button"
                onClick={() => removeImage('document_back')}
                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openCamera('document_back')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-600"
            >
              <Camera size={28} />
              <span className="text-sm font-medium">Take Photo</span>
            </button>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer">
              <Upload size={28} />
              <span className="text-sm font-medium">Upload File</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, 'document_back')}
                className="hidden"
              />
            </label>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Click to upload or take a photo of the back of your ID</p>
      </div>

      {/* Selfie with Document */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Selfie with Document *
        </label>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Hold your ID document next to your face. Make sure both your face and the document are clearly visible.
            </p>
          </div>
        </div>
        {previews.selfie ? (
          <div className="relative">
            <img
              src={previews.selfie}
              alt="Selfie with document"
              className="w-full h-48 object-cover rounded-xl border-2 border-green-500"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <CheckCircle size={12} /> Captured
              </span>
              <button
                type="button"
                onClick={() => removeImage('selfie')}
                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openCamera('selfie')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-600"
            >
              <Camera size={32} />
              <span className="text-sm font-medium">Take Selfie</span>
            </button>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer">
              <Upload size={32} />
              <span className="text-sm font-medium">Upload Photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, 'selfie')}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Your Data is Protected</h4>
            <p className="text-xs text-blue-700">
              All documents are encrypted and stored securely. We comply with GDPR and only use your data for verification purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && cameraMode && (
        <CameraModal
          mode={cameraMode === 'selfie' ? 'selfie' : 'document'}
          title={
            cameraMode === 'document_front' ? 'Capture Front Side' :
            cameraMode === 'document_back' ? 'Capture Back Side' :
            'Take Selfie with Document'
          }
          onCapture={handleCameraCapture}
          onClose={() => {
            setShowCamera(false)
            setCameraMode(null)
          }}
        />
      )}
    </div>
  )
}

// Camera Modal Component
interface CameraModalProps {
  mode: 'document' | 'selfie'
  title: string
  onCapture: (file: File) => void
  onClose: () => void
}

function CameraModal({ mode, title, onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    mode === 'selfie' ? 'user' : 'environment'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(d => d.kind === 'videoinput')
      setHasMultipleCameras(videoDevices.length > 1)
    }).catch(() => {})
  }, [])

  const startCamera = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use file upload.')
      } else {
        setError('Failed to access camera. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [facingMode])

  useEffect(() => {
    startCamera()
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!capturedImage) {
      startCamera()
    }
  }, [facingMode])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    if (mode === 'selfie' && facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageDataUrl)

    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }, [stream, mode, facingMode])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const confirmPhoto = useCallback(() => {
    if (!capturedImage) return

    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const filename = mode === 'selfie' 
          ? `selfie_${Date.now()}.jpg` 
          : `document_${Date.now()}.jpg`
        const file = new File([blob], filename, { type: 'image/jpeg' })
        onCapture(file)
      })
  }, [capturedImage, mode, onCapture])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onCapture(file)
    }
  }

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between safe-area-inset-top">
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        <div className="w-10" />
      </div>

      {/* Instructions */}
      <div className="bg-black/60 px-4 py-3 text-center">
        {mode === 'selfie' ? (
          <p className="text-white/90 text-sm">
            📸 Hold your ID next to your face. Both must be clearly visible.
          </p>
        ) : (
          <p className="text-white/90 text-sm">
            📄 Position your document within the frame. All corners must be visible.
          </p>
        )}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {isLoading && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4" />
              <p>Starting camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black p-8">
            <div className="text-center text-white max-w-md">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-red-400 mb-6">{error}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Upload size={20} />
                Upload from Gallery
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {!capturedImage && !error && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`max-h-full max-w-full object-contain ${
                mode === 'selfie' && facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
            
            {/* Frame overlay for document */}
            {mode === 'document' && (
              <div className="absolute inset-8 pointer-events-none">
                <div className="w-full h-full border-2 border-white/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                </div>
              </div>
            )}

            {/* Face oval for selfie */}
            {mode === 'selfie' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-4 border-white/50 rounded-full" />
              </div>
            )}
          </>
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-h-full max-w-full object-contain"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6 safe-area-inset-bottom">
        {!capturedImage ? (
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors"
              title="Upload from gallery"
            >
              <Upload size={28} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={capturePhoto}
              disabled={isLoading || !!error}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform active:scale-95"
            >
              <div className="w-16 h-16 rounded-full border-4 border-black/20" />
            </button>

            {hasMultipleCameras ? (
              <button
                onClick={switchCamera}
                className="text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors"
                title="Switch camera"
              >
                <SwitchCamera size={28} />
              </button>
            ) : <div className="w-14" />}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors"
            >
              <RotateCcw size={20} />
              Retake
            </button>

            <button
              onClick={confirmPhoto}
              className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl transition-colors font-semibold"
            >
              <Check size={20} />
              Use Photo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useAuth } from '@/contexts/AuthContext'
import { vehicleService } from '@/lib/api/vehicles'
import { transactionService } from '@/lib/api/transactions'
import { kycService } from '@/lib/api/kyc'
import { logger } from '@/utils/logger'
import { getImageUrl } from '@/lib/utils'
import ProtectedRoute from '@/components/ProtectedRoute'
import CameraCapture from '@/components/CameraCapture'

function CheckoutPageContent() {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [idImagePreview, setIdImagePreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraMode, setCameraMode] = useState<'selfie' | 'document'>('document')
  const [idImageFront, setIdImageFront] = useState<File | null>(null)
  const [idImageBack, setIdImageBack] = useState<File | null>(null)
  const [idImageFrontPreview, setIdImageFrontPreview] = useState<string | null>(null)
  const [idImageBackPreview, setIdImageBackPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    country: 'DE',
    idType: 'passport',
    idNumber: '',
    idImage: null as File | null,
    selfieImage: null as File | null,
    acceptTerms: false,
    acceptDataProcessing: false,
    acceptContract: false,
  })

  const isDealer = (user as any)?.user_type === 'seller' && (user as any)?.dealer_id != null

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await vehicleService.getById(vehicleId)
        setVehicle(data)
      } catch (error) {
        console.error('Failed to load vehicle:', error)
        alert(t('vehicle_not_found'))
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [vehicleId, router, t])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIdImageFront(file)
      const reader = new FileReader()
      reader.onloadend = () => setIdImageFrontPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleIdImageBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIdImageBack(file)
      const reader = new FileReader()
      reader.onloadend = () => setIdImageBackPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, selfieImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => setSelfiePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const openCamera = (mode: 'selfie' | 'document') => {
    setCameraMode(mode)
    setShowCamera(true)
  }

  const handleCameraCapture = (file: File) => {
    if (cameraMode === 'selfie') {
      setFormData(prev => ({ ...prev, selfieImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => setSelfiePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      // For document, we'll capture both front and back
      if (!idImageFront) {
        setIdImageFront(file)
        const reader = new FileReader()
        reader.onloadend = () => setIdImageFrontPreview(reader.result as string)
        reader.readAsDataURL(file)
      } else {
        setIdImageBack(file)
        const reader = new FileReader()
        reader.onloadend = () => setIdImageBackPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  const validateStep = (step: number) => {
    if (step === 1) return formData.fullName && formData.email && formData.phone && formData.dateOfBirth
    if (step === 2) return formData.street && formData.houseNumber && formData.city && formData.postalCode
    if (step === 3) {
      if (isDealer) return true
      return formData.idType && formData.idNumber && idImageFront && formData.selfieImage
    }
    if (step === 4) return formData.acceptTerms && formData.acceptDataProcessing && formData.acceptContract
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, isDealer ? 3 : 4))
    } else {
      alert(t('fill_fields_error'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(isDealer ? 3 : 4)) {
      alert(t('accept_terms_error'))
      return
    }
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert(t('login_required'))
      router.push('/login')
      return
    }
    
    setSubmitting(true)
    try {
      if (!isDealer && idImageFront && formData.selfieImage) {
        logger.info('Submitting KYC documents...')
        await kycService.submit({
          id_document_type: formData.idType as any,
          id_document_number: formData.idNumber,
          id_document_image: idImageFront,
          selfie_image: formData.selfieImage,
        })
        logger.info('KYC submitted successfully')
      }
      
      logger.info('Creating transaction for vehicle:', vehicleId)
      const response = await transactionService.create({
        vehicle_id: vehicleId,
        amount: vehicle.price.toString(),
        payment_method: 'bank_transfer'
      })
      logger.info('Transaction created:', response)
      
      if (response.transaction && response.transaction.id) {
        router.push(`/transaction/${response.transaction.id}`)
      } else {
        throw new Error('Invalid transaction response')
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.response?.data?.message || error.message || t('error_processing'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">{tCommon('loading')}</p>
      </div>
    </div>
  )
  if (!vehicle) return null

  const steps = isDealer 
    ? [
        { number: 1, title: t('buyer_info'), icon: '👤' },
        { number: 2, title: t('delivery_address'), icon: '🏠' },
        { number: 3, title: tCommon('confirm'), icon: '✓' },
      ]
    : [
        { number: 1, title: t('buyer_info'), icon: '👤' },
        { number: 2, title: t('delivery_address'), icon: '🏠' },
        { number: 3, title: 'KYC', icon: '📸' },
        { number: 4, title: tCommon('confirm'), icon: '✓' },
      ]

  const maxSteps = isDealer ? 3 : 4

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link href={`/vehicle/${vehicleId}`} className="text-sm text-primary-900 hover:underline mb-4 inline-flex items-center gap-1">← {tCommon('back')}</Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('title')}</h1>
        <p className="text-sm text-gray-600 mb-6">{t('escrow_desc')}</p>

        {/* Steps */}
        <div className="mb-6 flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${currentStep >= step.number ? 'bg-accent-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.icon}
                </div>
                <span className="text-xs mt-1.5 text-gray-600">{step.title}</span>
              </div>
              {idx < steps.length - 1 && <div className={`h-0.5 flex-1 ${currentStep > step.number ? 'bg-accent-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold mb-3">{t('buyer_info')}</h2>
                  <input id="checkout-fullname" type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name *" required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="name" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input id="checkout-email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email *" required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="email" />
                    <input id="checkout-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone *" required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="tel" />
                  </div>
                  <input id="checkout-dob" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="bday" />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold mb-3">{t('delivery_address')}</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <input id="checkout-street" type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street *" required className="col-span-2 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="address-line1" />
                    <input id="checkout-house-number" type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} placeholder="No. *" required className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="checkout-city" type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City *" required className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="address-level2" />
                    <input id="checkout-postal-code" type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code *" required className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" autoComplete="postal-code" />
                  </div>
                  <select id="checkout-country" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500">
                    <option value="DE">{t('countries.germany')}</option>
                    <option value="AT">{t('countries.austria')}</option>
                    <option value="CH">{t('countries.switzerland')}</option>
                  </select>
                </div>
              )}

              {currentStep === 3 && !isDealer && (
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold mb-3">{t('kyc.title')}</h2>
                  <div className="bg-primary-50 border border-primary-100 rounded-xl p-3">
                    <p className="text-xs text-gray-700">{t('kyc.instructions')}</p>
                  </div>
                  
                  {/* ID Type and Number */}
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">ID Type *</span>
                      <select id="checkout-id-type" name="idType" value={formData.idType} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl">
                        <option value="passport">{t('kyc.id_types.passport')}</option>
                        <option value="id_card">{t('kyc.id_types.id_card')}</option>
                        <option value="drivers_license">{t('kyc.id_types.drivers_license')}</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">ID Number *</span>
                      <input id="checkout-id-number" type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="ID Number" required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl" autoComplete="off" />
                    </label>
                  </div>

                  {/* ID Document Front */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Front Side *</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition">
                      {idImageFrontPreview ? (
                        <div className="relative">
                          <img src={idImageFrontPreview} alt="ID Front" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button type="button" onClick={() => openCamera('document')} className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium">Retake</button>
                            <button type="button" onClick={() => { setIdImageFrontPreview(null); setIdImageFront(null) }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => openCamera('document')}
                              className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl transition"
                            >
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium">Take Photo</span>
                            </button>
                            <label htmlFor="id-image-upload" className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl cursor-pointer transition">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm font-medium">Upload File</span>
                              <input id="id-image-upload" name="idImage" type="file" accept="image/*" onChange={handleIdImageChange} className="hidden" />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">Click to upload or take photo of the front side of your ID</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Document Back (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Back Side (Optional)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition">
                      {idImageBackPreview ? (
                        <div className="relative">
                          <img src={idImageBackPreview} alt="ID Back" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button type="button" onClick={() => openCamera('document')} className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium">Retake</button>
                            <button type="button" onClick={() => { setIdImageBackPreview(null); setIdImageBack(null) }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => openCamera('document')}
                              className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition"
                            >
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium">Take Photo</span>
                            </button>
                            <label htmlFor="id-image-back-upload" className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl cursor-pointer transition">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm font-medium">Upload File</span>
                              <input id="id-image-back-upload" name="idImageBack" type="file" accept="image/*" onChange={handleIdImageBackChange} className="hidden" />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">Click to upload or take photo of the back side</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selfie Verification *</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition">
                      {selfiePreview ? (
                        <div className="relative">
                          <img src={selfiePreview} alt="Selfie" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button type="button" onClick={() => openCamera('selfie')} className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium">Retake</button>
                            <button type="button" onClick={() => { setSelfiePreview(null); setFormData(prev => ({ ...prev, selfieImage: null })) }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => openCamera('selfie')}
                              className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl transition"
                            >
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-sm font-medium">Take Selfie</span>
                            </button>
                            <label htmlFor="selfie-upload" className="flex-1 flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl cursor-pointer transition">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm font-medium">Upload File</span>
                              <input id="selfie-upload" name="selfieImage" type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">Take a selfie to verify your identity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security Icons */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🔒</div>
                      <p className="text-xs text-gray-600">Escrow Protected</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🔐</div>
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">✓</div>
                      <p className="text-xs text-gray-600">Verified</p>
                    </div>
                  </div>
                </div>
              )}

              {((currentStep === 3 && isDealer) || (currentStep === 4 && !isDealer)) && (
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold mb-3">{tCommon('confirm')}</h2>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                    <p className="text-sm font-semibold">{formData.fullName}</p>
                    <p className="text-xs text-gray-600">{formData.email} • {formData.phone}</p>
                    <p className="text-xs text-gray-600">{formData.street} {formData.houseNumber}, {formData.postalCode} {formData.city}</p>
                    {!isDealer && <p className="text-green-600 text-xs mt-2">✓ KYC Verification submitted</p>}
                  </div>
                  <label htmlFor="checkout-accept-terms" className="flex items-start gap-2"><input id="checkout-accept-terms" type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} required className="mt-0.5 rounded" /><span className="text-xs text-gray-700">{t('terms_agree')} {t('terms_link')} *</span></label>
                  <label htmlFor="checkout-accept-data" className="flex items-start gap-2"><input id="checkout-accept-data" type="checkbox" name="acceptDataProcessing" checked={formData.acceptDataProcessing} onChange={handleInputChange} required className="mt-0.5 rounded" /><span className="text-xs text-gray-700">{t('consents.data_processing')} *</span></label>
                  <label htmlFor="checkout-accept-contract" className="flex items-start gap-2"><input id="checkout-accept-contract" type="checkbox" name="acceptContract" checked={formData.acceptContract} onChange={handleInputChange} required className="mt-0.5 rounded" /><span className="text-xs text-gray-700">{t('consents.purchase_contract')} *</span></label>
                </div>
              )}

              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
                <button type="button" onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} disabled={currentStep === 1} className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition">← {tCommon('back')}</button>
                {currentStep < maxSteps ? (
                  <button type="button" onClick={handleNext} className="px-5 py-2.5 text-sm bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-medium transition">{tCommon('next')} →</button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition">{submitting ? t('processing') : t('place_order')}</button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-8">
              <h3 className="text-sm font-semibold mb-3">{t('order_summary')}</h3>
              {(vehicle.primary_image || vehicle.images?.[0]) && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                  <Image src={getImageUrl(vehicle.primary_image || vehicle.images[0])} alt={vehicle.make} fill className="object-cover" />
                </div>
              )}
              <h4 className="text-sm font-semibold">{vehicle.make} {vehicle.model}</h4>
              <p className="text-xs text-gray-500 mb-3">{tCommon('year')}: {vehicle.year}</p>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-600">{t('vehicle_details')}</span><span>{formatPrice(Number(vehicle.price))}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-600">{t('service_fee')}</span><span>{formatPrice(Math.max(Number(vehicle.price) * 0.025, 25))}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-600">{t('vat')}</span><span>{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 0.19)}</span></div>
                <div className="flex justify-between font-semibold text-sm border-t border-gray-100 pt-2 mt-2"><span>{t('total')}</span><span className="text-accent-500">{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 1.19)}</span></div>
              </div>
              {isDealer && (
                <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-2.5">
                  <p className="text-xs text-green-800">{t('dealer_info')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          mode={cameraMode}
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}

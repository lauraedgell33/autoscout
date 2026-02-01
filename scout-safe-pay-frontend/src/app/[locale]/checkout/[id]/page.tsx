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
import ProtectedRoute from '@/components/ProtectedRoute';

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
        router.push(`/${params.locale}/marketplace`)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [vehicleId, router])

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
      setFormData(prev => ({ ...prev, idImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => setIdImagePreview(reader.result as string)
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

  const validateStep = (step: number) => {
    if (step === 1) return formData.fullName && formData.email && formData.phone && formData.dateOfBirth
    if (step === 2) return formData.street && formData.houseNumber && formData.city && formData.postalCode
    if (step === 3) {
      if (isDealer) return true
      return formData.idType && formData.idNumber && formData.idImage && formData.selfieImage
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
      router.push(`/${params.locale}/login`)
      return
    }
    
    setSubmitting(true)
    try {
      if (!isDealer && formData.idImage && formData.selfieImage) {
        logger.info('Submitting KYC documents...')
        await kycService.submit({
          id_document_type: formData.idType as any,
          id_document_number: formData.idNumber,
          id_document_image: formData.idImage,
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
                  <select id="checkout-id-type" name="idType" value={formData.idType} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl">
                    <option value="passport">{t('kyc.id_types.passport')}</option>
                    <option value="id_card">{t('kyc.id_types.id_card')}</option>
                    <option value="drivers_license">{t('kyc.id_types.drivers_license')}</option>
                  </select>
                  <input id="checkout-id-number" type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="ID Number *" required className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl" autoComplete="off" />
                  <div className="border-2 border-dashed border-gray-200 p-5 text-center rounded-xl hover:border-primary-300 transition">
                    {idImagePreview ? (
                      <div><img src={idImagePreview} alt="ID" className="max-h-40 mx-auto rounded-lg" /><button type="button" onClick={() => { setIdImagePreview(null); setFormData(prev => ({ ...prev, idImage: null })) }} className="mt-2 text-xs text-red-600">Remove</button></div>
                    ) : (
                      <label htmlFor="id-image-upload" className="cursor-pointer text-sm text-primary-900 font-medium"><span>{t('kyc.front')}</span><input id="id-image-upload" name="idImage" type="file" accept="image/*" onChange={handleIdImageChange} className="hidden" /></label>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-200 p-5 text-center rounded-xl hover:border-primary-300 transition">
                    {selfiePreview ? (
                      <div><img src={selfiePreview} alt="Selfie" className="max-h-40 mx-auto rounded-lg" /><button type="button" onClick={() => { setSelfiePreview(null); setFormData(prev => ({ ...prev, selfieImage: null })) }} className="mt-2 text-xs text-red-600">Remove</button></div>
                    ) : (
                      <label htmlFor="selfie-upload" className="cursor-pointer text-sm text-primary-900 font-medium"><span>{t('kyc.back')}</span><input id="selfie-upload" name="selfieImage" type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" /></label>
                    )}
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
              {(vehicle.images?.[0] || vehicle.primary_image) && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                  <Image 
                    src={getImageUrl(vehicle.images?.[0] || vehicle.primary_image)} 
                    alt={vehicle.make} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <h4 className="text-sm font-semibold">{vehicle.make} {vehicle.model}</h4>
              <p className="text-xs text-gray-500 mb-3">Year: {vehicle.year}</p>
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

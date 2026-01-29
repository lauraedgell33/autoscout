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

export default function CheckoutPage() {
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
        router.push('/marketplace')
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
      router.push('/login')
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{tCommon('loading')}</p>
      </div>
    </div>
  )
  if (!vehicle) return null

  const steps = isDealer 
    ? [
        { number: 1, title: t('checkout.buyer_info'), icon: '👤' },
        { number: 2, title: t('checkout.delivery_address'), icon: '🏠' },
        { number: 3, title: tCommon('confirm'), icon: '✓' },
      ]
    : [
        { number: 1, title: t('checkout.buyer_info'), icon: '👤' },
        { number: 2, title: t('checkout.delivery_address'), icon: '🏠' },
        { number: 3, title: 'KYC', icon: '📸' },
        { number: 4, title: tCommon('confirm'), icon: '✓' },
      ]

  const maxSteps = isDealer ? 3 : 4

  return (
    <>      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href={`/vehicle/${vehicleId}`} className="text-blue-900 hover:underline mb-4 inline-block">← {tCommon('back')}</Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{t('checkout.title')}</h1>
          <p className="text-gray-600 mb-8">{t('checkout.escrow_desc')}</p>

        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${currentStep >= step.number ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                  {step.icon}
                </div>
                <span className="text-xs mt-2">{step.title}</span>
              </div>
              {idx < steps.length - 1 && <div className={`h-1 flex-1 ${currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">{t('checkout.buyer_info')}</h2>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name *" required className="w-full px-4 py-2 border rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email *" required className="w-full px-4 py-2 border rounded-lg" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone *" required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">{t('checkout.delivery_address')}</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street *" required className="col-span-2 px-4 py-2 border rounded-lg" />
                    <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} placeholder="No. *" required className="px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City *" required className="px-4 py-2 border rounded-lg" />
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code *" required className="px-4 py-2 border rounded-lg" />
                  </div>
                  <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
                    <option value="DE">{t('countries.germany')}</option>
                    <option value="AT">{t('countries.austria')}</option>
                    <option value="CH">{t('countries.switzerland')}</option>
                  </select>
                </div>
              )}

              {currentStep === 3 && !isDealer && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">{t('kyc.title')}</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{t('kyc.instructions')}</p>
                  </div>
                  <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
                    <option value="passport">{t('kyc.id_types.passport')}</option>
                    <option value="id_card">{t('kyc.id_types.id_card')}</option>
                    <option value="drivers_license">{t('kyc.id_types.drivers_license')}</option>
                  </select>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="ID Number *" required className="w-full px-4 py-2 border rounded-lg" />
                  <div className="border-2 border-dashed p-6 text-center rounded-lg">
                    {idImagePreview ? (
                      <div><img src={idImagePreview} alt="ID" className="max-h-48 mx-auto rounded" /><button type="button" onClick={() => { setIdImagePreview(null); setFormData(prev => ({ ...prev, idImage: null })) }} className="mt-2 text-sm text-red-600">Remove</button></div>
                    ) : (
                      <label className="cursor-pointer text-blue-600"><span>{t('kyc.front')}</span><input type="file" accept="image/*" onChange={handleIdImageChange} className="hidden" /></label>
                    )}
                  </div>
                  <div className="border-2 border-dashed p-6 text-center rounded-lg">
                    {selfiePreview ? (
                      <div><img src={selfiePreview} alt="Selfie" className="max-h-48 mx-auto rounded" /><button type="button" onClick={() => { setSelfiePreview(null); setFormData(prev => ({ ...prev, selfieImage: null })) }} className="mt-2 text-sm text-red-600">Remove</button></div>
                    ) : (
                      <label className="cursor-pointer text-blue-600"><span>{t('kyc.back')}</span><input type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" /></label>
                    )}
                  </div>
                </div>
              )}

              {((currentStep === 3 && isDealer) || (currentStep === 4 && !isDealer)) && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">{tCommon('confirm')}</h2>
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <p><strong>{formData.fullName}</strong></p>
                    <p>{formData.email} • {formData.phone}</p>
                    <p>{formData.street} {formData.houseNumber}, {formData.postalCode} {formData.city}</p>
                    {!isDealer && <p className="text-green-600 text-sm">✓ KYC Verification submitted</p>}
                  </div>
                  <label className="flex items-start gap-2"><input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} required className="mt-1" /><span className="text-sm">{t('checkout.terms_agree')} {t('checkout.terms_link')} *</span></label>
                  <label className="flex items-start gap-2"><input type="checkbox" name="acceptDataProcessing" checked={formData.acceptDataProcessing} onChange={handleInputChange} required className="mt-1" /><span className="text-sm">{t('consents.data_processing')} *</span></label>
                  <label className="flex items-start gap-2"><input type="checkbox" name="acceptContract" checked={formData.acceptContract} onChange={handleInputChange} required className="mt-1" /><span className="text-sm">{t('consents.purchase_contract')} *</span></label>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <button type="button" onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} disabled={currentStep === 1} className="px-6 py-3 border rounded-lg disabled:opacity-50">← {tCommon('back')}</button>
                {currentStep < maxSteps ? (
                  <button type="button" onClick={handleNext} className="px-6 py-3 bg-orange-500 text-white rounded-lg">{tCommon('next')} →</button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-6 py-3 bg-green-600 text-white rounded-lg">{submitting ? t('checkout.processing') : t('checkout.place_order')}</button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-8">
              <h3 className="font-bold mb-4">{t('checkout.order_summary')}</h3>
              {vehicle.images?.[0] && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                  <Image src={vehicle.images[0]} alt={vehicle.make} fill className="object-cover" />
                </div>
              )}
              <h4 className="font-bold">{vehicle.make} {vehicle.model}</h4>
              <p className="text-sm text-gray-600">Year: {vehicle.year}</p>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between"><span>{t('checkout.vehicle_details')}</span><span>{formatPrice(Number(vehicle.price))}</span></div>
                <div className="flex justify-between"><span>{t('checkout.service_fee')}</span><span>{formatPrice(Math.max(Number(vehicle.price) * 0.025, 25))}</span></div>
                <div className="flex justify-between"><span>{t('checkout.vat')}</span><span>{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 0.19)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>{t('checkout.total')}</span><span className="text-orange-500">{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 1.19)}</span></div>
              </div>
              {isDealer && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm text-green-800">{t('checkout.dealer_info')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>    </>
  )
}

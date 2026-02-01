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
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, Lock, TrendingUp, User, Home, Camera, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { COUNTRIES, POPULAR_COUNTRIES } from '@/lib/constants/countries';
import AddressAutocomplete from '@/components/AddressAutocomplete';

function CheckoutPageContent() {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
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
        toast.error(t('vehicle_not_found'))
        router.push(`/${params.locale}/marketplace`)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [vehicleId, router])
  
  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | null | undefined): string => {
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
    
    if (!imagePath) return placeholderImage;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}/storage/${imagePath}`;
  };

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
      toast.error(t('fill_fields_error'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(isDealer ? 3 : 4)) {
      toast.error(t('accept_terms_error'))
      return
    }
    
    // Use AuthContext instead of localStorage directly
    if (!user || !isAuthenticated) {
      toast.error(t('login_required'))
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
        toast.success('Order placed successfully!')
        router.push(`/${params.locale}/transaction/${response.transaction.id}`)
      } else {
        throw new Error('Invalid transaction response')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || error.message || t('error_processing'))
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {t('title')}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('escrow_desc')}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge className="bg-white/20 text-white border border-white/30">
                <Lock className="w-3 h-3 mr-1" />
                SSL Secured
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep > step.number ? 'text-green-600' : currentStep === step.number ? 'text-primary-900' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep > step.number ? 'bg-green-500 text-white' :
                    currentStep === step.number ? 'bg-primary-900 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 md:w-24 h-0.5 mx-3 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href={`/vehicle/${vehicleId}`} className="text-sm text-primary-900 hover:underline mb-4 inline-flex items-center gap-1">
          ← {tCommon('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-900" />
                      </div>
                      {t('buyer_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="checkout-fullname" className="text-sm font-semibold text-gray-700 mb-1 block">
                        Full Name *
                      </label>
                      <input 
                        id="checkout-fullname" 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        placeholder="Full Name" 
                        required 
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        autoComplete="name" 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkout-email" className="text-sm font-semibold text-gray-700 mb-1 block">
                          Email *
                        </label>
                        <input 
                          id="checkout-email" 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="Email" 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="email" 
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout-phone" className="text-sm font-semibold text-gray-700 mb-1 block">
                          Phone *
                        </label>
                        <input 
                          id="checkout-phone" 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="Phone" 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="tel" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="checkout-dob" className="text-sm font-semibold text-gray-700 mb-1 block">
                        Date of Birth *
                      </label>
                      <input 
                        id="checkout-dob" 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        autoComplete="bday" 
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-primary-900" />
                      </div>
                      {t('delivery_address')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Address Autocomplete */}
                    <AddressAutocomplete
                      onSelect={(address) => {
                        setFormData(prev => ({
                          ...prev,
                          street: address.street || prev.street,
                          houseNumber: address.houseNumber || prev.houseNumber,
                          city: address.city || prev.city,
                          postalCode: address.postalCode || prev.postalCode,
                          country: address.country || prev.country,
                        }));
                      }}
                      placeholder="Search for your address..."
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Or enter manually</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label htmlFor="checkout-street" className="text-sm font-semibold text-gray-700 mb-1 block">
                          Street *
                        </label>
                        <input 
                          id="checkout-street" 
                          type="text" 
                          name="street" 
                          value={formData.street} 
                          onChange={handleInputChange} 
                          placeholder="Street" 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="address-line1" 
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout-house-number" className="text-sm font-semibold text-gray-700 mb-1 block">
                          No. *
                        </label>
                        <input 
                          id="checkout-house-number" 
                          type="text" 
                          name="houseNumber" 
                          value={formData.houseNumber} 
                          onChange={handleInputChange} 
                          placeholder="No." 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="off" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkout-city" className="text-sm font-semibold text-gray-700 mb-1 block">
                          City *
                        </label>
                        <input 
                          id="checkout-city" 
                          type="text" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleInputChange} 
                          placeholder="City" 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="address-level2" 
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout-postal-code" className="text-sm font-semibold text-gray-700 mb-1 block">
                          Postal Code *
                        </label>
                        <input 
                          id="checkout-postal-code" 
                          type="text" 
                          name="postalCode" 
                          value={formData.postalCode} 
                          onChange={handleInputChange} 
                          placeholder="Postal Code" 
                          required 
                          className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                          autoComplete="postal-code" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="checkout-country" className="text-sm font-semibold text-gray-700 mb-1 block">
                        Country *
                      </label>
                      <select 
                        id="checkout-country" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <optgroup label="Popular Countries">
                          {COUNTRIES.filter(c => POPULAR_COUNTRIES.includes(c.code)).map(country => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="All Countries">
                          {COUNTRIES.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && !isDealer && (
                <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary-900" />
                      </div>
                      {t('kyc.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{t('kyc.instructions')}</p>
                    </div>
                    <div>
                      <label htmlFor="checkout-id-type" className="text-sm font-semibold text-gray-700 mb-1 block">
                        ID Type *
                      </label>
                      <select 
                        id="checkout-id-type" 
                        name="idType" 
                        value={formData.idType} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="passport">{t('kyc.id_types.passport')}</option>
                        <option value="id_card">{t('kyc.id_types.id_card')}</option>
                        <option value="drivers_license">{t('kyc.id_types.drivers_license')}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="checkout-id-number" className="text-sm font-semibold text-gray-700 mb-1 block">
                        ID Number *
                      </label>
                      <input 
                        id="checkout-id-number" 
                        type="text" 
                        name="idNumber" 
                        value={formData.idNumber} 
                        onChange={handleInputChange} 
                        placeholder="ID Number" 
                        required 
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        autoComplete="off" 
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-xl hover:border-primary-400 transition-colors bg-gray-50">
                      {idImagePreview ? (
                        <div>
                          <img src={idImagePreview} alt="ID" className="max-h-40 mx-auto rounded-lg border border-gray-200" />
                          <button 
                            type="button" 
                            onClick={() => { 
                              setIdImagePreview(null); 
                              setFormData(prev => ({ ...prev, idImage: null })) 
                            }} 
                            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="id-image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-primary-900 font-semibold">{t('kyc.front')}</span>
                            <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                          </div>
                          <input 
                            id="id-image-upload" 
                            name="idImage" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleIdImageChange} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-xl hover:border-primary-400 transition-colors bg-gray-50">
                      {selfiePreview ? (
                        <div>
                          <img src={selfiePreview} alt="Selfie" className="max-h-40 mx-auto rounded-lg border border-gray-200" />
                          <button 
                            type="button" 
                            onClick={() => { 
                              setSelfiePreview(null); 
                              setFormData(prev => ({ ...prev, selfieImage: null })) 
                            }} 
                            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="selfie-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-primary-900 font-semibold">{t('kyc.back')}</span>
                            <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                          </div>
                          <input 
                            id="selfie-upload" 
                            name="selfieImage" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleSelfieChange} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {((currentStep === 3 && isDealer) || (currentStep === 4 && !isDealer)) && (
                <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-900" />
                      </div>
                      {tCommon('confirm')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                      <p className="text-sm font-bold text-gray-900 mb-2">{formData.fullName}</p>
                      <p className="text-sm text-gray-600 mb-1">{formData.email} • {formData.phone}</p>
                      <p className="text-sm text-gray-600">{formData.street} {formData.houseNumber}, {formData.postalCode} {formData.city}</p>
                      {!isDealer && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            KYC Verification submitted
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label htmlFor="checkout-accept-terms" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input 
                          id="checkout-accept-terms" 
                          type="checkbox" 
                          name="acceptTerms" 
                          checked={formData.acceptTerms} 
                          onChange={handleInputChange} 
                          required 
                          className="mt-0.5 rounded border-gray-300 text-primary-900 focus:ring-primary-500" 
                        />
                        <span className="text-sm text-gray-700">
                          {t('terms_agree')} {t('terms_link')} *
                        </span>
                      </label>
                      <label htmlFor="checkout-accept-data" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input 
                          id="checkout-accept-data" 
                          type="checkbox" 
                          name="acceptDataProcessing" 
                          checked={formData.acceptDataProcessing} 
                          onChange={handleInputChange} 
                          required 
                          className="mt-0.5 rounded border-gray-300 text-primary-900 focus:ring-primary-500" 
                        />
                        <span className="text-sm text-gray-700">
                          {t('consents.data_processing')} *
                        </span>
                      </label>
                      <label htmlFor="checkout-accept-contract" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input 
                          id="checkout-accept-contract" 
                          type="checkbox" 
                          name="acceptContract" 
                          checked={formData.acceptContract} 
                          onChange={handleInputChange} 
                          required 
                          className="mt-0.5 rounded border-gray-300 text-primary-900 focus:ring-primary-500" 
                        />
                        <span className="text-sm text-gray-700">
                          {t('consents.purchase_contract')} *
                        </span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} 
                  disabled={currentStep === 1} 
                  variant="outline" 
                  className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← {tCommon('back')}
                </Button>
                {currentStep < maxSteps ? (
                  <Button 
                    type="button" 
                    onClick={handleNext} 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  >
                    {tCommon('next')} →
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={submitting} 
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? t('processing') : t('place_order')}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-green-800">Escrow Protected</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <Lock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-blue-800">Secure Payment</p>
                </div>
              </div>

              {/* Order Summary Card */}
              <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <CardHeader className="mb-4">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {t('order_summary')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(vehicle.images?.[0] || vehicle.primary_image) && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 border-2 border-gray-100">
                      <Image 
                        src={getImageUrl(vehicle.images?.[0] || vehicle.primary_image)} 
                        alt={vehicle.make} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  )}
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    {vehicle.make} {vehicle.model}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">Year: {vehicle.year}</p>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('vehicle_details')}</span>
                      <span className="font-semibold text-gray-900">{formatPrice(Number(vehicle.price))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('service_fee')}</span>
                      <span className="font-semibold text-gray-900">{formatPrice(Math.max(Number(vehicle.price) * 0.025, 25))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('vat')}</span>
                      <span className="font-semibold text-gray-900">{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 0.19)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t-2 border-gray-200 pt-3 mt-3">
                      <span className="text-gray-900">{t('total')}</span>
                      <span className="text-accent-500">{formatPrice((Number(vehicle.price) + Math.max(Number(vehicle.price) * 0.025, 25)) * 1.19)}</span>
                    </div>
                  </div>
                  
                  {isDealer && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {t('dealer_info')}
                      </p>
                    </div>
                  )}

                  {/* Trust Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="w-4 h-4 text-primary-900" />
                      <span className="font-medium">Protected by AutoScout24 SafeTrade</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

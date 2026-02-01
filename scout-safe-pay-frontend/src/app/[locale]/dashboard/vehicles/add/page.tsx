'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import vehicleService from '@/lib/api/vehicles'
import vehicleDataService, { VehicleMake, VehicleModel } from '@/lib/api/vehicle-data'
import { VEHICLE_CATEGORIES } from '@/lib/constants/categories'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'

export default function AddVehiclePage() {
  const t = useTranslations('dashboard.add_vehicle')
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [availableMakes, setAvailableMakes] = useState<VehicleMake[]>([])
  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([])
  
  const [formData, setFormData] = useState({
    category: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel_type: 'petrol',
    transmission: 'manual',
    color: '',
    doors: 4,
    seats: 5,
    body_type: 'sedan',
    engine_size: '',
    description: '',
    location_city: '',
    location_country: 'Germany',
    status: 'available'
  })

  // Fetch makes when category changes
  useEffect(() => {
    const fetchMakes = async () => {
      if (!formData.category) return
      
      setLoadingMakes(true)
      try {
        const makes = await vehicleDataService.getMakesByCategory(formData.category)
        setAvailableMakes(makes)
      } catch (err) {
        console.error('Failed to fetch makes:', err)
        toast.error('Failed to load vehicle makes. You can still enter manually.')
        setAvailableMakes([])
      } finally {
        setLoadingMakes(false)
      }
    }

    fetchMakes()
  }, [formData.category])

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.category || !formData.make) return
      
      setLoadingModels(true)
      try {
        const models = await vehicleDataService.getModelsByMake(
          formData.category,
          formData.make
        )
        setAvailableModels(models)
      } catch (err) {
        console.error('Failed to fetch models:', err)
        toast.error('Failed to load vehicle models. You can still enter manually.')
        setAvailableModels([])
      } finally {
        setLoadingModels(false)
      }
    }

    fetchModels()
  }, [formData.category, formData.make])

  // Get makes for selected category (deprecated - now using API)
  const availableMakesLegacy = useMemo(() => {
    return availableMakes
  }, [availableMakes])

  // Get models for selected make (deprecated - now using API)
  const availableModelsLegacy = useMemo(() => {
    return availableModels
  }, [availableModels])

  // Get make name for display
  const selectedMakeName = useMemo(() => {
    const make = availableMakesLegacy.find(m => m.id === formData.make)
    return make?.name || formData.make
  }, [availableMakesLegacy, formData.make])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Reset dependent fields when parent field changes
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value, make: '', model: '' }))
    } else if (name === 'make') {
      setFormData(prev => ({ ...prev, make: value, model: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const vehicleData: any = {
        ...formData,
        make: selectedMakeName, // Send the make name, not the ID
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        engine_size: formData.engine_size ? parseInt(formData.engine_size) : undefined
      }

      await vehicleService.createVehicle(vehicleData)
      router.push('/dashboard/vehicles')
    } catch (err: any) {
      console.error('Failed to create vehicle:', err)
      setError(err.response?.data?.message || t("error"))
    } finally {
      setLoading(false)
    }
  }

  const isStep1Valid = formData.make && formData.model && formData.year && formData.price
  const isStep2Valid = formData.mileage && formData.fuel_type && formData.transmission

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Vehicle</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-accent-500 text-white' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-accent-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-accent-500 font-semibold' : isDark ? 'text-gray-400' : 'text-gray-600'}>Basic Info</span>
              <span className={step >= 2 ? 'text-accent-500 font-semibold' : isDark ? 'text-gray-400' : 'text-gray-600'}>Details</span>
              <span className={step >= 3 ? 'text-accent-500 font-semibold' : isDark ? 'text-gray-400' : 'text-gray-600'}>Review</span>
            </div>
          </div>

          {error && (
            <div className={`px-4 py-3 rounded-lg mb-6 ${isDark ? 'bg-red-900/30 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Basic Information</h2>
                
                {/* Category Selection */}
                <div>
                  <label htmlFor="vehicle-category" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                  <select
                    id="vehicle-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  >
                    {VEHICLE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicle-make" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Make * {loadingMakes && <span className="text-xs text-gray-500">(Loading...)</span>}
                    </label>
                    <select
                      id="vehicle-make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                      disabled={loadingMakes}
                    >
                      <option value="">{loadingMakes ? 'Loading makes...' : 'Select Make'}</option>
                      {availableMakesLegacy.map((make) => (
                        <option key={make.id} value={make.id}>{make.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vehicle-model" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Model * {loadingModels && <span className="text-xs text-gray-500">(Loading...)</span>}
                    </label>
                    <select
                      id="vehicle-model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!formData.make || loadingModels ? 'opacity-50 cursor-not-allowed' : ''}`}
                      required
                      disabled={!formData.make || loadingModels}
                    >
                      <option value="">{!formData.make ? 'Select Make First' : loadingModels ? 'Loading models...' : 'Select Model'}</option>
                      {availableModelsLegacy.map((model) => (
                        <option key={model.name} value={model.name}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicle-year" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Year *</label>
                    <input
                      id="vehicle-year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicle-price" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Price (€) *</label>
                    <input
                      id="vehicle-price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Vehicle Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Mileage (km) *</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Engine Size (cc)</label>
                    <input
                      type="number"
                      name="engine_size"
                      value={formData.engine_size}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Fuel Type *</label>
                    <select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Transmission *</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    >
                      <option value="manual">Manual</option>
                      <option value="automatic">Automatic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Body Type</label>
                    <select
                      name="body_type"
                      value={formData.body_type}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="coupe">Coupe</option>
                      <option value="wagon">Wagon</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Doors</label>
                    <input
                      type="number"
                      name="doors"
                      value={formData.doors}
                      onChange={handleChange}
                      min="2"
                      max="5"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Seats</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      min="2"
                      max="9"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Describe your vehicle..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                    <input
                      type="text"
                      name="location_city"
                      value={formData.location_city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
                    <input
                      type="text"
                      name="location_country"
                      value={formData.location_country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Review & Submit</h2>
                
                <div className={`rounded-lg p-4 space-y-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Make:</span>
                      <span className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedMakeName}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Model:</span>
                      <span className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.model}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Year:</span>
                      <span className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.year}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Price:</span>
                      <span className="ml-2 font-semibold text-accent-500">€{formData.price}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mileage:</span>
                      <span className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.mileage} km</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Fuel:</span>
                      <span className={`ml-2 font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.fuel_type}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Transmission:</span>
                      <span className={`ml-2 font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.transmission}</span>
                    </div>
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Body Type:</span>
                      <span className={`ml-2 font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.body_type}</span>
                    </div>
                  </div>
                  {formData.description && (
                    <div className={`pt-3 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Description:</span>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formData.description}</p>
                    </div>
                  )}
                </div>

                <div className={`rounded-lg p-4 ${isDark ? 'bg-primary-900/30 border border-primary-700' : 'bg-primary-50 border border-blue-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
                    <strong>Note:</strong> Your vehicle will be listed immediately after submission. You can add images later from the edit page.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex justify-between mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`px-6 py-3 border rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Back
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && !isStep1Valid || step === 2 && !isStep2Valid}
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Vehicle'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

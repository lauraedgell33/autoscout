'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import vehicleService, { Vehicle } from '@/lib/api/vehicles'

export default function MyVehiclesPage() {
  const t = useTranslations('dashboard.vehicles')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; vehicle: Vehicle | null }>({
    open: false,
    vehicle: null
  })

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await vehicleService.getMyVehicles()
      setVehicles(response.data)
    } catch (err: unknown) {
      console.error('Failed to fetch vehicles:', err)
      setError(t("delete_failed"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await vehicleService.deleteVehicle(vehicle.id)
      setVehicles(vehicles.filter(v => v.id !== vehicle.id))
      setDeleteModal({ open: false, vehicle: null })
    } catch (err: unknown) {
      console.error('Failed to delete vehicle:', err)
      alert(t("delete_failed"))
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      sold: 'bg-gray-100 text-gray-700'
    }
    return colors[status as keyof typeof colors] || colors.available
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['seller']}>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
              <p className="text-gray-600 mt-1">{(vehicles || []).length} vehicles listed</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <Link
                href="/dashboard/vehicles/add"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vehicle
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {vehicles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Yet</h3>
              <p className="text-gray-600 mb-6">Start selling by adding your first vehicle</p>
              <Link
                href="/dashboard/vehicles/add"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Vehicle
              </Link>
            </div>
          ) : (
            /* Vehicles Grid/List */
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={vehicle.primary_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E" }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`${getStatusBadge(vehicle.status)} px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-2xl font-bold text-accent-500 mb-3">
                      {vehicleService.formatPrice(vehicle.price, vehicle.currency)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div>{vehicle.year}</div>
                      <div>{vehicleService.formatMileage(vehicle.mileage)}</div>
                      <div className="capitalize">{vehicle.fuel_type}</div>
                      <div className="capitalize">{vehicle.transmission}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/vehicle/${vehicle.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-center transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/vehicles/${vehicle.id}/edit`}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium text-center transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, vehicle })}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.open && deleteModal.vehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Vehicle?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteModal.vehicle.make} {deleteModal.vehicle.model}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, vehicle: null })}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.vehicle!)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

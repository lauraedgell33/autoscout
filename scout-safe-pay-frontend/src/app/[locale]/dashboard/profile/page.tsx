'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/lib/api/user'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { User, Mail, Phone, Lock, Save, Shield } from 'lucide-react'

export default function ProfilePage() {
  const t = useTranslations('dashboard.profile')
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      await userService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })
      setMessage(t('profile_updated') || 'Profile updated successfully')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (passwordData.new !== passwordData.confirm) {
      setError(t('password_mismatch') || 'Passwords do not match')
      return
    }

    if (passwordData.new.length < 8) {
      setError(t('password_min_length') || 'Password must be at least 8 characters')
      return
    }

    try {
      await userService.updatePassword({
        current_password: passwordData.current,
        password: passwordData.new,
        password_confirmation: passwordData.confirm,
      })
      setMessage(t('password_updated') || 'Password updated successfully')
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center gap-2">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
            Profile Settings
          </h1>

          {message && (
            <Card className="bg-green-50 border-green-200 text-green-700 p-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {message}
              </div>
            </Card>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200 text-red-700 p-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {error}
              </div>
            </Card>
          )}

          {/* Personal Information */}
          <Card className="p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Personal Information
            </h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-base px-4 py-2 capitalize">
                    {user?.role}
                  </Badge>
                </div>

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Minimum 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold w-full sm:w-auto"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Account Info */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Email Verified:</span>
                <Badge className={user?.email_verified_at ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}>
                  {user?.email_verified_at ? '✓ Verified' : '✗ Not Verified'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold text-gray-900">2026</span>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

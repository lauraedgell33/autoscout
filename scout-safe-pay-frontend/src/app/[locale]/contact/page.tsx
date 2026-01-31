'use client'

import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-grow bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('pages.contact.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">{t('pages.contact.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('pages.contact.get_in_touch')}</h2>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-900" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{t('pages.contact.phone')}</p>
                    <p className="text-sm text-gray-600">+49 30 555 1234</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-900" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{t('pages.contact.email')}</p>
                    <p className="text-sm text-gray-600">support@autoscout24.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-900" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{t('pages.contact.office')}</p>
                    <p className="text-sm text-gray-600">Oranienburger Str. 123<br/>10178 Berlin, Germany</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('pages.contact.send_message')}</h2>
                
                {submitted && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-800">{t('pages.contact.thank_you')}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">{t('pages.contact.full_name')} *</label>
                      <input id="contact-name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('pages.contact.email_address')} *</label>
                      <input id="contact-email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1.5">{t('pages.contact.subject')} *</label>
                    <input id="contact-subject" name="subject" type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">{t('pages.contact.message')} *</label>
                    <textarea id="contact-message" name="message" required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    {t('pages.contact.send')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>    </div>
  )
}

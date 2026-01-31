'use client'

import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'
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
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium">We're here to help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('pages.contact.title')}</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">{t('pages.contact.subtitle')}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
            <Clock className="w-4 h-4" />
            <span>Average response time: 2 hours</span>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12 sm:py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('pages.contact.get_in_touch')}</h2>
                
                <a href="tel:+493055551234" className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">{t('pages.contact.phone')}</p>
                    <p className="text-sm text-gray-600">+49 30 555 1234</p>
                  </div>
                </a>

                <a href="mailto:support@autoscout24.com" className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">{t('pages.contact.email')}</p>
                    <p className="text-sm text-gray-600">support@autoscout24.com</p>
                  </div>
                </a>

                <div className="flex items-start p-3 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">{t('pages.contact.office')}</p>
                    <p className="text-sm text-gray-600">Oranienburger Str. 123<br/>10178 Berlin, Germany</p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-blue-100">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-white font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white font-medium">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white/60">Closed</span>
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

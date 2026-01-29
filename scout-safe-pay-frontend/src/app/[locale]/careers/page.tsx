'use client'

import { useTranslations } from 'next-intl'
import { Briefcase, MapPin, Clock, Users } from 'lucide-react'

export default function CareersPage() {
  const t = useTranslations()
  
  const openPositions = [
    { title: 'Senior Full Stack Developer', department: 'Engineering', location: 'Berlin', type: 'Full-time' },
    { title: 'Product Manager', department: 'Product', location: 'Berlin', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Customer Success', location: 'Remote', type: 'Full-time' },
    { title: 'UX/UI Designer', department: 'Design', location: 'Berlin', type: 'Full-time' },
    { title: 'DevOps Engineer', department: 'Engineering', location: 'Berlin / Remote', type: 'Full-time' },
    { title: 'Marketing Manager', department: 'Marketing', location: 'Berlin', type: 'Full-time' }
  ]

  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">{t('pages.careers.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('pages.careers.subtitle')}</p>
            <div className="flex gap-4 justify-center text-blue-100 mt-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Berlin Office</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>6 Open Positions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('pages.careers.open_positions')}</h2>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{position.department}</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{position.location}</div>
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{position.type}</div>
                      </div>
                    </div>
                    <a href="/contact" className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block text-center">
                      {t('pages.careers.apply_now')}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gray-50 rounded-2xl p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.careers.no_perfect_role')}</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for talented people. Send us your CV and tell us how you could contribute to our team.
              </p>
              <a href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
                {t('pages.careers.send_application')}
              </a>
            </div>
          </div>
        </div>
      </main>    </div>
  )
}

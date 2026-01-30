'use client'

import { useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'

interface AdvancedSearchProps {
  onSearch: (query: string) => void
  onFilterToggle?: () => void
  placeholder?: string
  showFilters?: boolean
}

export function AdvancedSearch({
  onSearch,
  onFilterToggle,
  placeholder = 'Search vehicles...',
  showFilters = true,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in">
      <div className="relative flex items-center gap-2">
        {/* Search Input */}
        <div
          className={`
            flex-1 relative
            transition-all duration-200
            ${isFocused ? 'scale-[1.01]' : 'scale-100'}
          `}
        >
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-12 py-4
              bg-white border-2 rounded-xl
              text-gray-900 placeholder-gray-400
              transition-all duration-200
              ${isFocused
                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
              }
              focus:outline-none
            `}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors animate-scale-in"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Filter Toggle */}
        {showFilters && onFilterToggle && (
          <button
            type="button"
            onClick={onFilterToggle}
            className="px-4 py-4 border-2 border-gray-200 hover:border-blue-500 bg-white text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Toggle Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Suggestions (optional) */}
      {isFocused && query.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2 animate-slide-up">
          <span className="text-sm text-gray-500">Popular:</span>
          {['BMW', 'Mercedes', 'Audi', 'Tesla'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion)
                onSearch(suggestion)
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

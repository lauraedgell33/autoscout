import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Get full image URL from a relative path
 * Handles both full URLs and relative storage paths
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/placeholder-car.jpg'
  
  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath
  }
  
  // Relative path - prepend storage URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api'
  const storageUrl = baseUrl.replace('/api', '/storage')
  return `${storageUrl}/${imagePath}`
}

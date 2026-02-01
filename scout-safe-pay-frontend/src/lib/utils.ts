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
  // Simple placeholder SVG data URL for missing images
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect fill="%23e5e7eb" width="800" height="600"/%3E%3Cpath fill="%239ca3af" d="M400 250c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80m0-30c-60.8 0-110 49.2-110 110s49.2 110 110 110 110-49.2 110-110-49.2-110-110-110zm-200 270h400l-100-150-75 100-50-50z"/%3E%3C/svg%3E';
  
  if (!imagePath) return placeholderSvg;
  
  // Already a full URL (including absolute paths starting with /)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If path starts with /storage, it's already correct - prepend backend domain
  if (imagePath.startsWith('/storage/')) {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api').replace('/api', '').trim()
    return `${backendUrl}${imagePath}`
  }
  
  // If absolute path but not /storage, return as is (for Next.js public folder)
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // Relative path - prepend storage URL (e.g., "vehicles/1/image.png")
  const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api').replace('/api', '').trim()
  return `${backendUrl}/storage/${imagePath}`
}

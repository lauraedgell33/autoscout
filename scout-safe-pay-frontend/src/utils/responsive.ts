// Responsive utilities for mobile optimization

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

// Touch target size checker
export const isTouchTargetValid = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return rect.width >= 44 && rect.height >= 44
}

// Viewport height fix for mobile browsers
export const getViewportHeight = (): number => {
  return typeof window !== 'undefined' ? window.innerHeight : 0
}

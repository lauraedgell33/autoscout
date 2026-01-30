export type PushPermissionState = NotificationPermission | 'unsupported'

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    return await navigator.serviceWorker.register('/sw.js')
  } catch (error) {
    console.error('Service worker registration failed', error)
    return null
  }
}

export function getPermissionState(): PushPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported'
  }

  return Notification.permission
}

export async function requestPushPermission(): Promise<PushPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported'
  }

  try {
    const result = await Notification.requestPermission()
    return result
  } catch (error) {
    console.error('Push permission request failed', error)
    return Notification.permission
  }
}

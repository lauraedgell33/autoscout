import { useUIStore } from '@/lib/stores/uiStore'

/**
 * Hook pentru gestionarea toast notifications
 * 
 * @example
 * const toast = useToast()
 * toast.success('Operation successful!')
 * toast.error('Something went wrong')
 */
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast)

  return {
    success: (message: string) => {
      addToast({ message, type: 'success' })
    },
    error: (message: string) => {
      addToast({ message, type: 'error' })
    },
    warning: (message: string) => {
      addToast({ message, type: 'warning' })
    },
    info: (message: string) => {
      addToast({ message, type: 'info' })
    },
  }
}

/**
 * Hook pentru gestionarea loading state global
 * 
 * @example
 * const { isLoading, setLoading } = useLoading()
 * setLoading(true)
 * // async operation
 * setLoading(false)
 */
export const useLoading = () => {
  const isLoading = useUIStore((state) => state.isLoading)
  const setLoading = useUIStore((state) => state.setLoading)

  return { isLoading, setLoading }
}

/**
 * Hook pentru wrapping async operations cu loading și toast
 * 
 * @example
 * const { execute, isLoading } = useAsyncOperation()
 * 
 * const handleSubmit = async () => {
 *   await execute(
 *     async () => await apiService.create(data),
 *     'Item created successfully!',
 *     'Failed to create item'
 *   )
 * }
 */
export const useAsyncOperation = () => {
  const toast = useToast()
  const { isLoading, setLoading } = useLoading()

  const execute = async <T,>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setLoading(true)
    try {
      const result = await operation()
      if (successMessage) {
        toast.success(successMessage)
      }
      return result
    } catch (error: any) {
      const message = errorMessage || error?.response?.data?.message || error?.message || 'An error occurred'
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { execute, isLoading }
}

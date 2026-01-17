import { OptimizedAPIClient } from '@/lib/api-client'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('OptimizedAPIClient', () => {
  let client: any
  let mockAxiosInstance: any

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      defaults: {
        baseURL: 'http://localhost:8000/api',
      },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    }

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any)
    mockedAxios.get = jest.fn()

    // Re-import to get fresh instance
    jest.resetModules()
    const apiClientModule = require('@/lib/api-client')
    client = apiClientModule.apiClient
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should make GET request and return data', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockAxiosInstance.get.mockResolvedValue({ data: mockData })

      const result = await client.get('/test')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined)
      expect(result).toEqual(mockData)
    })

    it('should deduplicate identical GET requests', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockAxiosInstance.get.mockResolvedValue({ data: mockData })

      // Make 3 identical requests simultaneously
      const [result1, result2, result3] = await Promise.all([
        client.get('/test'),
        client.get('/test'),
        client.get('/test'),
      ])

      // Should only make one actual request
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
      expect(result1).toEqual(mockData)
      expect(result2).toEqual(mockData)
      expect(result3).toEqual(mockData)
    })
  })

  describe('POST requests', () => {
    it('should make POST request with CSRF cookie', async () => {
      const mockData = { success: true }
      const postData = { name: 'Test' }

      mockedAxios.get.mockResolvedValue({})
      mockAxiosInstance.post.mockResolvedValue({ data: mockData })

      const result = await client.post('/test', postData)

      // Should call CSRF endpoint first
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/sanctum/csrf-cookie',
        { withCredentials: true }
      )

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, undefined)
      expect(result).toEqual(mockData)
    })
  })

  describe('withCredentials configuration', () => {
    it('should create axios instance with withCredentials: true', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      )
    })
  })
})

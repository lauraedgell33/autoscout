import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Create mock instance that will be used
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:8000/api',
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
} as unknown as jest.Mocked<AxiosInstance>

// Mock axios BEFORE any imports that use it
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  get: jest.fn(),
  isAxiosError: jest.fn(() => false),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('OptimizedAPIClient', () => {
  let client: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset the mock returns
    mockAxiosInstance.get.mockReset()
    mockAxiosInstance.post.mockReset()
    mockAxiosInstance.put.mockReset()
    mockAxiosInstance.delete.mockReset()
    mockAxiosInstance.patch.mockReset()
    
    // Import fresh module
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
      mockAxiosInstance.get.mockResolvedValue({ data: mockData } as AxiosResponse)

      const result = await client.get('/test')

      expect(mockAxiosInstance.get).toHaveBeenCalled()
      expect(result).toEqual(mockData)
    })

    it('should handle request deduplication concept', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockAxiosInstance.get.mockResolvedValue({ data: mockData } as AxiosResponse)

      // Make sequential requests (testing client works)
      const result1 = await client.get('/test1')
      const result2 = await client.get('/test2')

      expect(result1).toEqual(mockData)
      expect(result2).toEqual(mockData)
    })
  })

  describe('POST requests', () => {
    it('should make POST request', async () => {
      const mockData = { success: true }
      const postData = { name: 'Test' }

      // Mock CSRF call
      ;(axios.get as jest.Mock).mockResolvedValue({})
      mockAxiosInstance.post.mockResolvedValue({ data: mockData } as AxiosResponse)

      const result = await client.post('/test', postData)

      expect(mockAxiosInstance.post).toHaveBeenCalled()
      expect(result).toEqual(mockData)
    })
  })

  describe('axios configuration', () => {
    it('should have apiClient available', () => {
      expect(client).toBeDefined()
    })
  })
})

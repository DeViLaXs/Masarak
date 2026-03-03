import api from '@/lib/axios'

// ============== Base API Response Types ==============
export type ApiResponse<T> = {
  statusCode: number
  success: boolean
  data: T
  errors: string[]
}

export type PaginatedData<T> = {
  items: T[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// ============== Lookup DTOs ==============
export type LookupItem = {
  id: number
  name: string
}

export type CountryItem = {
  id: number
  name: string
  code: string
}

export type CurrencyItem = {
  id: number
  code: string
  name: string
}

// ============== Job DTOs ==============
export type CreateJobDto = {
  title: string
  description: string
  jobTypeId: number
  categoryId: number
  jobLocationTypeId: number
  currencyId: number
  countryId: number
  governateId: number
  addressLine?: string
  minSalary: number
  maxSalary: number
  expirationDate: string // ISO string
  skillIds?: number[]
  newSkills?: string[]
}

// ============== Job Service ==============

export const jobService = {
  /**
   * Create a new job
   */
  createJob: async (data: CreateJobDto): Promise<{ message: string }> => {
    const res = await api.post('/Job/jobs', data)
    return res.data?.data
  },

  // --- Lookups ---

  getCategories: async (search?: string): Promise<LookupItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Job/categories${q}`)
    return res.data?.data || []
  },

  getJobTypes: async (): Promise<LookupItem[]> => {
    const res = await api.get('/Job/job-types')
    return res.data?.data || []
  },

  getLocationTypes: async (): Promise<LookupItem[]> => {
    const res = await api.get('/Job/location-types')
    return res.data?.data || []
  },

  getCurrencies: async (search?: string): Promise<CurrencyItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Job/currencies${q}`)
    return res.data?.data || []
  },

  getCountries: async (search?: string): Promise<CountryItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Job/countries${q}`)
    return res.data?.data || []
  },

  getGovernates: async (
    countryId: number,
    search?: string,
  ): Promise<LookupItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Job/governates/${countryId}${q}`)
    return res.data?.data || []
  },

  searchSkills: async (query: string): Promise<LookupItem[]> => {
    if (!query) return []
    const res = await api.get(`/Job/skills?search=${encodeURIComponent(query)}`)
    return res.data?.data || []
  },
}

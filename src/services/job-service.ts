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

export type JobListItemDto = {
  id: number
  title: string
  description: string
  jobType: string
  minSalary: number
  maxSalary: number
  currency: string
  postedDate: string // ISO string
  expirationDate: string // ISO string
  applicantsCount: number
  status: 'Published' | 'Closed' | 'Filled' | 'Expired'
}

export type JobDetailDto = {
  id: number
  title: string
  description: string
  jobTypeId: number
  jobType: string
  categoryId: number
  category: string
  jobLocationTypeId: number
  jobLocationType: string
  currencyId: number
  currency: string
  minSalary: number
  maxSalary: number
  postedDate: string // ISO string
  expirationDate: string // ISO string
  applicantsCount: number
  status: 'Published' | 'Closed' | 'Filled' | 'Expired'
  addressLine?: string
  countryId: number
  country: string
  governateId: number
  governate: string
  skills: Array<{ id: number; name: string }>
}

export type UpdateJobDto = Partial<CreateJobDto>

// ============== Job Service ==============

export const jobService = {
  /**
   * Create a new job
   */
  createJob: async (data: CreateJobDto): Promise<{ message: string }> => {
    const res = await api.post('/Jobs/jobs', data)
    return res.data?.data
  },

  /**
   * Get paginated list of company jobs
   */
  getCompanyJobs: async (params?: {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    jobTypeId?: number
  }): Promise<PaginatedData<JobListItemDto>> => {
    const res = await api.get('/Jobs/jobs', { params })
    return res.data?.data
  },

  /**
   * Get job by ID
   */
  getJobById: async (id: number): Promise<JobDetailDto> => {
    const res = await api.get(`/Jobs/jobs/${id}`)
    return res.data?.data
  },

  /**
   * Update an existing job
   */
  updateJob: async (
    id: number,
    data: UpdateJobDto,
  ): Promise<{ message: string }> => {
    const res = await api.put(`/Jobs/jobs/${id}`, data)
    return res.data?.data
  },

  /**
   * Update job status (Publish, Close, etc.)
   */
  updateJobStatus: async (
    id: number,
    status: 'Published' | 'Closed',
  ): Promise<{ message: string }> => {
    const res = await api.patch(`/Jobs/jobs/${id}/status`, { status })
    return res.data?.data
  },

  // --- Lookups ---

  getCategories: async (search?: string): Promise<LookupItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Jobs/categories${q}`)
    return res.data?.data || []
  },

  getJobTypes: async (): Promise<LookupItem[]> => {
    const res = await api.get('/Jobs/job-types')
    return res.data?.data || []
  },

  getLocationTypes: async (): Promise<LookupItem[]> => {
    const res = await api.get('/Jobs/location-types')
    return res.data?.data || []
  },

  getCurrencies: async (search?: string): Promise<CurrencyItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Jobs/currencies${q}`)
    return res.data?.data || []
  },

  getCountries: async (search?: string): Promise<CountryItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Jobs/countries${q}`)
    return res.data?.data || []
  },

  getGovernates: async (
    countryId: number,
    search?: string,
  ): Promise<LookupItem[]> => {
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await api.get(`/Jobs/governates/${countryId}${q}`)
    return res.data?.data || []
  },

  searchSkills: async (query: string): Promise<LookupItem[]> => {
    if (!query) return []
    const res = await api.get(`/Jobs/skills?search=${encodeURIComponent(query)}`)
    return res.data?.data || []
  },
}

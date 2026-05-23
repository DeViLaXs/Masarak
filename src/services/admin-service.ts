import api from '@/lib/axios'

// ============== Interfaces ==============

export interface BaseResponse<T> {
  statusCode: number
  success: boolean
  data: T
  errors: string[]
}

export interface StatisticsDto {
  totalCompanies: number
  pendingVerification: number
  verified: number
  rejected: number
}

export interface DashboardStatisticsDto {
  totalCompanies: number
  totalFeedbacks: number
  pendingVerificationRequests: number
  unreadFeedbacks: number
  totalPublishedJobs: number
  companiesRegisteredThisMonth: number
  newFeedbacksThisWeek: number
}

export interface CompanyDto {
  id: number
  companyName: string
  industry: string
  email: string
  phoneNumber: string
  createdAt: string
  status:
    | 'PendingApproval'
    | 'Active'
    | 'Suspended'
    | 'Inactive'
    | 'Rejected'
    | 'Blocked'
  logoUrl?: string | null
}

export interface CompanyDetailDto extends CompanyDto {
  emailConfirmed: boolean
  totalJobs: number
  city: string
  governate: string
  address?: string | null
  commercialRegisterNumber?: string | null
  taxNumber?: string | null
  companyType?: string | null
  description?: string | null
}

export interface PaginatedCompaniesDto {
  items: CompanyDto[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface GetCompaniesParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UpdateCompanyStatusDto {
  status:
    | 'PendingApproval'
    | 'Active'
    | 'Suspended'
    | 'Inactive'
    | 'Rejected'
    | 'Blocked'
}

export interface UpdateCompanyDto {
  companyName?: string
  industry?: string
  email?: string
  phoneNumber?: string
}

export interface BulkActionDto {
  companyIds: number[]
  action: 'Approve' | 'Reject' | 'Suspend' | 'Delete'
}

// ============== Service ==============

export const adminService = {
  getStatistics: async (): Promise<BaseResponse<StatisticsDto>> => {
    const res = await api.get('/Admin/statistics')
    return res.data
  },

  getDashboardStatistics: async (): Promise<BaseResponse<DashboardStatisticsDto>> => {
    const res = await api.get('/Admin/dashboard-statistics')
    return res.data
  },

  getCompanies: async (
    params: GetCompaniesParams,
  ): Promise<BaseResponse<PaginatedCompaniesDto>> => {
    const res = await api.get('/Admin/companies', { params })
    return res.data
  },

  getCompany: async (id: number): Promise<BaseResponse<CompanyDetailDto>> => {
    const res = await api.get(`/Admin/companies/${id}`)
    return res.data
  },

  updateCompanyStatus: async (
    id: number,
    data: UpdateCompanyStatusDto,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.patch(`/Admin/companies/${id}/status`, data)
    return res.data
  },

  deleteCompany: async (
    id: number,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.delete(`/Admin/companies/${id}`)
    return res.data
  },

  updateCompany: async (
    id: number,
    data: UpdateCompanyDto,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.put(`/Admin/companies/${id}`, data)
    return res.data
  },

  bulkAction: async (
    data: BulkActionDto,
  ): Promise<
    BaseResponse<{ successCount: number; failedCount: number; message: string }>
  > => {
    const res = await api.post('/Admin/companies/bulk-action', data)
    return res.data
  },
}

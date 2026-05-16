import api from '@/lib/axios'
import type { PaginatedData } from './job-service'
import { ScheduleInterviewDTO } from './interview-service'

export type ApplicationListItemDto = {
  applicationId: number
  profilePhoto: string | null
  fullName: string
  email: string
  jobTitle: string
  applicationDate: string // ISO string
  matchingPercentage: number | null
  applicationStatus: string
  cvDownloadUrl: string | null
  canReject: boolean
  canSchedule: boolean
  canHire: boolean
}

export type GetApplicationsParams = {
  search?: string
  jobId?: number
  applicationStatusId?: number
  page?: number
  pageSize?: number
}

export type ApplicationFiltersDto = {
  statuses: { id: number; name: string }[]
  jobs: { id: number; name: string }[]
}

export const applicationService = {
  /**
   * Retrieves a paginated list of all applications for the logged-in company's jobs.
   */
  getApplications: async (
    params?: GetApplicationsParams,
  ): Promise<PaginatedData<ApplicationListItemDto>> => {
    // Clean up undefined params
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== ''),
    )
    
    const res = await api.get('/Applications/company', { params: cleanParams })
    return res.data?.data || res.data
  },

  /**
   * Returns the data needed for the filter dropdowns.
   */
  getFilters: async (): Promise<ApplicationFiltersDto> => {
    const res = await api.get('/Applications/company/filters')
    return res.data?.data || res.data
  },

  /**
   * Reject a candidate.
   */
  reject: async (id: number): Promise<{ message: string }> => {
    const res = await api.post(`/Applications/${id}/reject`)
    return res.data?.data || res.data
  },

  /**
   * Hire a candidate.
   */
  hire: async (id: number): Promise<{ message: string }> => {
    const res = await api.post(`/Applications/${id}/hire`)
    return res.data?.data || res.data
  },

  /**
   * Schedule an interview.
   */
  scheduleInterview: async (id: number, data: ScheduleInterviewDTO): Promise<{ message: string }> => {
    const res = await api.post(`/Applications/${id}/schedule-interview`, data)
    return res.data?.data || res.data
  },

  /**
   * Get application by ID.
   */
  getApplicationById: async (id: number): Promise<ApplicationListItemDto> => {
    const res = await api.get(`/Applications/${id}`)
    return res.data?.data || res.data
  },
}

import api from '@/lib/axios'
import { PaginatedData, LookupItem } from './job-service'

// ============== DTOs ==============

export type InterviewStatisticsDto = {
  scheduled: number
  confirmed: number
  completed: number
  rescheduled: number
  cancelled: number
  noShow: number
  missingInterview: number
}

export interface CompanyInterviewStatisticsDto {
  totalInterviews: number
  scheduledInterviews: number
  confirmedInterviews: number
  completedInterviews: number
  todayInterviews: number
}

export type InterviewListItemDto = {
  interviewId: number
  candidateName: string
  jobTitle: string
  interviewDate: string
  interviewType: string
  interviewStatus: string
  location: string | null
  countryId?: number | null
  governateId?: number | null
  addressLine?: string | null
  addressId?: number | null
  canCancel: boolean
  canReschedule: boolean
  canComplete: boolean
  canMarkMissing: boolean
  email?: string
  matchingPercentage?: number | null
  cvDownloadUrl?: string | null
  notes?: string | null
}

export type ScheduleInterviewDTO = {
  interviewDate: string // ISO
  notes?: string | null
  interviewTypeId: number
  meetingLink?: string | null
  countryId?: number | null
  governateId?: number | null
  addressLine?: string | null
  addressId?: number | null
}

export type InterviewFiltersDto = {
  statuses: { id: number; name: string }[]
  jobs: { id: number; name: string }[]
}

// ============== Service ==============

export const interviewService = {
  getCompanyStatistics: async (): Promise<CompanyInterviewStatisticsDto> => {
    const res = await api.get('/Interviews/company/statistics')
    return res.data?.data || res.data
  },

  getStatistics: async (): Promise<InterviewStatisticsDto> => {
    const res = await api.get('/Interviews/statistics')
    return res.data?.data || res.data
  },

  getInterviews: async (params?: {
    search?: string
    interviewStatusId?: number
    jobId?: number
    page?: number
    pageSize?: number
  }): Promise<PaginatedData<InterviewListItemDto>> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, v]) => v !== undefined && v !== '',
      ),
    )
    const res = await api.get('/Interviews/company', { params: cleanParams })
    return res.data?.data || res.data
  },

  getFilters: async (): Promise<InterviewFiltersDto> => {
    const res = await api.get('/Interviews/company/filters')
    return res.data?.data || res.data
  },

  reschedule: async (
    id: number,
    data: ScheduleInterviewDTO,
  ): Promise<{ message: string }> => {
    const res = await api.post(`/Interviews/${id}/reschedule`, data)
    return res.data?.data || res.data
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const res = await api.post(`/Interviews/${id}/cancel`)
    return res.data?.data || res.data
  },

  missing: async (id: number): Promise<{ message: string }> => {
    const res = await api.post(`/Interviews/${id}/missing`)
    return res.data?.data || res.data
  },

  complete: async (id: number): Promise<{ message: string }> => {
    const res = await api.post(`/Interviews/${id}/complete`)
    return res.data?.data || res.data
  },

  getInterviewById: async (id: number): Promise<InterviewListItemDto> => {
    const res = await api.get(`/Interviews/${id}`)
    return res.data?.data || res.data
  },
}

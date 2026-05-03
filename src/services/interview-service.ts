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
}

export type InterviewListItemDto = {
  interviewId: number
  applicationId: number
  candidateName: string
  candidateEmail: string
  jobTitle: string
  interviewDate: string
  interviewTypeName: string
  location: string
  statusId: number
  statusName: string
  notes: string | null
}

export type InterviewDetailDto = {
  interviewId: number
  applicationId: number
  candidateName: string
  candidateEmail: string
  jobTitle: string
  interviewDate: string
  interviewTypeName: string
  location: string
  statusId: number
  statusName: string
  notes: string | null
}

// ============== Service ==============

export const interviewService = {
  /**
   * Get interview statistics (counts per status)
   */
  getStatistics: async (): Promise<InterviewStatisticsDto> => {
    const res = await api.get('/Interviews/statistics')
    return res.data?.data
  },

  /**
   * Get paginated and filtered interview list
   */
  getInterviews: async (params?: {
    searchTerm?: string
    statusId?: number
    page?: number
    pageSize?: number
  }): Promise<PaginatedData<InterviewListItemDto>> => {
    const res = await api.get('/Interviews', { params })
    return res.data?.data
  },

  /**
   * Get a single interview
   */
  getInterviewById: async (id: number): Promise<InterviewDetailDto> => {
    const res = await api.get(`/Interviews/${id}`)
    return res.data?.data
  },

  /**
   * Update interview status
   */
  updateStatus: async (id: number, statusId: number): Promise<{ message: string }> => {
    const res = await api.patch(`/Interviews/${id}/status`, { statusId })
    return res.data?.data
  },

  /**
   * Reschedule an interview
   */
  reschedule: async (
    id: number,
    data: { newDate: string; notes?: string },
  ): Promise<{ message: string }> => {
    const res = await api.post(`/Interviews/${id}/reschedule`, data)
    return res.data?.data
  },

  /**
   * Get all interview statuses
   */
  getStatuses: async (): Promise<LookupItem[]> => {
    const res = await api.get('/Interviews/statuses')
    return res.data?.data || []
  },
}

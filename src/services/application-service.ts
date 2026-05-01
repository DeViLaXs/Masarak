import api from '@/lib/axios'
import type { PaginatedData } from './job-service'

export type ApplicationListItemDto = {
  applicationId: number
  candidateName: string
  candidateEmail: string
  jobTitle: string
  applicationDate: string // ISO string
  candidateDescription: string
  resumeUrl: string
  statusId: number
  statusName: string
}

export type GetApplicationsParams = {
  SearchTerm?: string
  JobId?: number
  StatusId?: number
  Page?: number
  PageSize?: number
}

export const applicationService = {
  /**
   * Retrieves a paginated list of all candidates who applied to the logged-in company's jobs.
   */
  getApplications: async (
    params?: GetApplicationsParams,
  ): Promise<PaginatedData<ApplicationListItemDto>> => {
    // Clean up undefined params
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== ''),
    )
    
    const res = await api.get('/Applications/applications', { params: cleanParams })
    return res.data?.data || res.data
  },

  /**
   * Updates the status of a specific candidate's application.
   * Reference: 3 = Rejected, 4 = Accepted
   */
  updateApplicationStatus: async (
    applicationId: number,
    statusId: number,
  ): Promise<{ message: string }> => {
    const res = await api.put(`/Applications/applications/${applicationId}/status`, {
      statusId,
    })
    return res.data?.data || res.data
  },
}

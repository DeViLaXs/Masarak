import api from '@/lib/axios'

export interface CompanyDashboardStatisticsDto {
  activeJobsNow: number
  newApplicantsThisWeek: number
  interviewsToday: number
  successfulHires: number
}

export const companyService = {
  getDashboardStatistics: async (): Promise<CompanyDashboardStatisticsDto> => {
    const res = await api.get('/Company/dashboard-statistics')
    return res.data?.data || res.data
  },
}

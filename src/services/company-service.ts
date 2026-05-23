import api from '@/lib/axios'
import {
  BaseResponse,
  ChartPieResponseDto,
  ChartBarMultiResponseDto,
} from './admin-service'

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

  getJobDistribution: async (): Promise<BaseResponse<ChartPieResponseDto>> => {
    const res = await api.get('/Company/dashboard-charts/job-distribution')
    return res.data
  },

  getApplicationsTrend: async (period = 'weekly'): Promise<BaseResponse<ChartBarMultiResponseDto>> => {
    const res = await api.get('/Company/dashboard-charts/applications-trend', {
      params: { period }
    })
    return res.data
  },
}

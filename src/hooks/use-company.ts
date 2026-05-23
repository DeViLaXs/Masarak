import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/services/company-service'

export const companyKeys = {
  all: ['company'] as const,
  statistics: () => [...companyKeys.all, 'statistics'] as const,
  jobDistribution: () => [...companyKeys.all, 'job-distribution'] as const,
  applicationsTrend: (period: string) => [...companyKeys.all, 'applications-trend', period] as const,
}

export function useCompanyDashboardStatistics() {
  return useQuery({
    queryKey: companyKeys.statistics(),
    queryFn: () => companyService.getDashboardStatistics(),
  })
}

export function useJobDistribution() {
  return useQuery({
    queryKey: companyKeys.jobDistribution(),
    queryFn: () => companyService.getJobDistribution(),
  })
}

export function useApplicationsTrend(period = 'weekly') {
  return useQuery({
    queryKey: companyKeys.applicationsTrend(period),
    queryFn: () => companyService.getApplicationsTrend(period),
  })
}

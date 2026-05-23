import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/services/company-service'

export const companyKeys = {
  all: ['company'] as const,
  statistics: () => [...companyKeys.all, 'statistics'] as const,
}

export function useCompanyDashboardStatistics() {
  return useQuery({
    queryKey: companyKeys.statistics(),
    queryFn: () => companyService.getDashboardStatistics(),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminService,
  type GetCompaniesParams,
  type UpdateCompanyStatusDto,
  type UpdateCompanyDto,
  type BulkActionDto,
  type DashboardStatisticsDto,
} from '@/services/admin-service'

export const adminKeys = {
  all: ['admin'] as const,
  statistics: () => [...adminKeys.all, 'statistics'] as const,
  dashboardStatistics: () => [...adminKeys.all, 'dashboard-statistics'] as const,
  companies: () => [...adminKeys.all, 'companies'] as const,
  company: (id: number) => [...adminKeys.companies(), id] as const,
  companyStatusDistribution: () => [...adminKeys.all, 'company-status-distribution'] as const,
  companyRegistrations: (period: string) => [...adminKeys.all, 'company-registrations', period] as const,
}

export function useAdmin() {
  const queryClient = useQueryClient()

  // Queries
  const useStatistics = () =>
    useQuery({
      queryKey: adminKeys.statistics(),
      queryFn: adminService.getStatistics,
    })

  const useDashboardStatistics = () =>
    useQuery({
      queryKey: adminKeys.dashboardStatistics(),
      queryFn: adminService.getDashboardStatistics,
    })

  const useCompanies = (params: GetCompaniesParams) =>
    useQuery({
      queryKey: [...adminKeys.companies(), params],
      queryFn: () => adminService.getCompanies(params),
    })

  const useCompany = (id: number) =>
    useQuery({
      queryKey: adminKeys.company(id),
      queryFn: () => adminService.getCompany(id),
      enabled: !!id,
    })

  const useCompanyStatusDistribution = () =>
    useQuery({
      queryKey: adminKeys.companyStatusDistribution(),
      queryFn: adminService.getCompanyStatusDistribution,
    })

  const useCompanyRegistrations = (period = 'weekly') =>
    useQuery({
      queryKey: adminKeys.companyRegistrations(period),
      queryFn: () => adminService.getCompanyRegistrations(period),
    })

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyStatusDto }) =>
      adminService.updateCompanyStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
      queryClient.invalidateQueries({ queryKey: adminKeys.statistics() })
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStatistics() })
    },
  })

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyDto }) =>
      adminService.updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.company(variables.id),
      })
    },
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
      queryClient.invalidateQueries({ queryKey: adminKeys.statistics() })
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStatistics() })
    },
  })

  const bulkActionMutation = useMutation({
    mutationFn: (data: BulkActionDto) => adminService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
      queryClient.invalidateQueries({ queryKey: adminKeys.statistics() })
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStatistics() })
    },
  })

  return {
    // Queries
    useStatistics,
    useDashboardStatistics,
    useCompanies,
    useCompany,
    useCompanyStatusDistribution,
    useCompanyRegistrations,

    // Mutations
    updateCompanyStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,

    updateCompany: updateCompanyMutation.mutateAsync,
    isUpdatingCompany: updateCompanyMutation.isPending,

    deleteCompany: deleteCompanyMutation.mutateAsync,
    isDeletingCompany: deleteCompanyMutation.isPending,

    bulkAction: bulkActionMutation.mutateAsync,
    isExecutingBulkAction: bulkActionMutation.isPending,
  }
}

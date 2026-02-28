import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  subadminService,
  type GetSubAdminsParams,
  type UpdateSubAdminStatusDto,
  type UpdateSubAdminDto,
  type CreateSubAdminDto,
  type SubAdminBulkActionDto,
  type SubAdminDto,
} from '@/services/subadmin-service'

export type { SubAdminDto }

export const subadminKeys = {
  all: ['subadmin'] as const,
  statistics: () => [...subadminKeys.all, 'statistics'] as const,
  subadmins: () => [...subadminKeys.all, 'subadmins'] as const,
  subadmin: (id: number) => [...subadminKeys.subadmins(), id] as const,
}

export function useSubadmins() {
  const queryClient = useQueryClient()

  // Queries
  const useStatistics = () =>
    useQuery({
      queryKey: subadminKeys.statistics(),
      queryFn: subadminService.getStatistics,
    })

  const getSubadmins = (params: GetSubAdminsParams) =>
    useQuery({
      queryKey: [...subadminKeys.subadmins(), params],
      queryFn: () => subadminService.getSubadmins(params),
    })

  const useSubadmin = (id: number) =>
    useQuery({
      queryKey: subadminKeys.subadmin(id),
      queryFn: () => subadminService.getSubadmin(id),
      enabled: !!id,
    })

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubAdminStatusDto }) =>
      subadminService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subadminKeys.subadmins() })
      queryClient.invalidateQueries({ queryKey: subadminKeys.statistics() })
    },
  })

  const deleteSubadminMutation = useMutation({
    mutationFn: (id: number) => subadminService.deleteSubadmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subadminKeys.subadmins() })
      queryClient.invalidateQueries({ queryKey: subadminKeys.statistics() })
    },
  })

  const bulkActionMutation = useMutation({
    mutationFn: (data: SubAdminBulkActionDto) =>
      subadminService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subadminKeys.subadmins() })
      queryClient.invalidateQueries({ queryKey: subadminKeys.statistics() })
    },
  })

  return {
    // Queries
    useStatistics,
    getSubadmins,
    useSubadmin,

    // Mutations
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteSubadmin: deleteSubadminMutation.mutateAsync,
    isDeleting: deleteSubadminMutation.isPending,

    bulkAction: bulkActionMutation.mutateAsync,
    isExecutingBulkAction: bulkActionMutation.isPending,
  }
}

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { applicationService, type GetApplicationsParams } from '@/services/application-service'

export const applicationKeys = {
  all: ['applications'] as const,
  list: (params: GetApplicationsParams) => [...applicationKeys.all, 'list', params] as const,
}

export function useApplications(params: GetApplicationsParams) {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => applicationService.getApplications(params),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      applicationService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}

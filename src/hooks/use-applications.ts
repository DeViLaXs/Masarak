import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { applicationService, type GetApplicationsParams } from '@/services/application-service'

export const applicationKeys = {
  all: ['applications'] as const,
  list: (params: GetApplicationsParams) => [...applicationKeys.all, 'list', params] as const,
}

export function useApplicationFilters() {
  return useQuery({
    queryKey: [...applicationKeys.all, 'filters'] as const,
    queryFn: () => applicationService.getFilters(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useApplications(params: GetApplicationsParams) {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => applicationService.getApplications(params),
    placeholderData: keepPreviousData,
  })
}

export function useRejectCandidate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}

export function useHireCandidate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationService.hire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      applicationService.scheduleInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
      // Also invalidate interviews as a new entry will appear there
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })
}


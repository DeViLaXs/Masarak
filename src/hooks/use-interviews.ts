import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { interviewService } from '@/services/interview-service'

export const interviewKeys = {
  all: ['interviews'] as const,
  list: (params: any) => [...interviewKeys.all, 'list', params] as const,
  stats: () => [...interviewKeys.all, 'stats'] as const,
  statuses: () => [...interviewKeys.all, 'statuses'] as const,
  shortlisted: (params: any) =>
    [...interviewKeys.all, 'shortlisted', params] as const,
}

export function useInterviewStats() {
  return useQuery({
    queryKey: interviewKeys.stats(),
    queryFn: () => interviewService.getStatistics(),
  })
}

export function useInterviewFilters() {
  return useQuery({
    queryKey: [...interviewKeys.all, 'filters'] as const,
    queryFn: () => interviewService.getFilters(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useInterviewsList(params: {
  searchTerm?: string
  statusId?: number
  page?: number
  pageSize?: number
  jobId?: number
}) {
  return useQuery({
    queryKey: interviewKeys.list(params),
    queryFn: () =>
      interviewService.getInterviews({
        search: params.searchTerm,
        interviewStatusId: params.statusId,
        page: params.page,
        pageSize: params.pageSize,
        jobId: params.jobId,
      }),
    placeholderData: keepPreviousData,
  })
}

export function useRescheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      interviewService.reschedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
    },
  })
}

export function useCancelInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => interviewService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useMissingInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => interviewService.missing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useCompleteInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => interviewService.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

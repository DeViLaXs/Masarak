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
  shortlisted: (params: any) => [...interviewKeys.all, 'shortlisted', params] as const,
}

export function useInterviewStats() {
  return useQuery({
    queryKey: interviewKeys.stats(),
    queryFn: () => interviewService.getStatistics(),
  })
}

export function useInterviewsList(params: {
  searchTerm?: string
  statusId?: number
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: interviewKeys.list(params),
    queryFn: () => interviewService.getInterviews({
      SearchTerm: params.searchTerm,
      StatusId: params.statusId,
      Page: params.page,
      PageSize: params.pageSize,
    }),
    placeholderData: keepPreviousData,
  })
}

export function useShortlistedCandidates(params?: {
  searchTerm?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: interviewKeys.shortlisted(params || {}),
    queryFn: () => interviewService.getShortlistedCandidates({
      SearchTerm: params?.searchTerm,
      Page: params?.page,
      PageSize: params?.pageSize,
    }),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateInterviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, statusId }: { id: number; statusId: number }) =>
      interviewService.updateStatus(id, statusId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
    },
  })
}

export function useRescheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      newDate,
      notes,
    }: { id: number; newDate: string; notes: string }) =>
      interviewService.reschedule(id, { newDate, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
    },
  })
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => interviewService.schedule(data),
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
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      interviewService.complete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useInterviewStatuses() {
  return useQuery({
    queryKey: interviewKeys.statuses(),
    queryFn: () => interviewService.getStatuses(),
    staleTime: 60 * 60 * 1000,
  })
}

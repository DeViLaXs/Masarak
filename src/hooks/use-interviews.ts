import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { interviewService } from '@/services/interview-service'
import { format } from 'date-fns'

export const interviewKeys = {
  all: ['interviews'] as const,
  list: (params: any) => [...interviewKeys.all, 'list', params] as const,
  detail: (id: number) => [...interviewKeys.all, 'detail', id] as const,
  stats: () => [...interviewKeys.all, 'stats'] as const,
  statuses: () => [...interviewKeys.all, 'statuses'] as const,
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
    queryFn: () => interviewService.getInterviews(params),
    placeholderData: keepPreviousData,
  })
}

export function useInterview(id: number) {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: () => interviewService.getInterviewById(id),
    enabled: !!id,
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
      time,
      notes,
    }: {
      id: number
      newDate: Date
      time: string
      notes?: string
    }) => {
      const dateStr = format(newDate, 'yyyy-MM-dd')
      const isoDate = `${dateStr}T${time}:00`
      return interviewService.reschedule(id, { newDate: isoDate, notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all })
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

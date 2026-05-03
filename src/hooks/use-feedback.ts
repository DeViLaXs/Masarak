import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedbackService, SubmitFeedbackDTO } from '@/services/feedback-service'

export const feedbackKeys = {
  all: ['feedbacks'] as const,
  list: (typeId?: number, pageNumber?: number, pageSize?: number) => [...feedbackKeys.all, 'list', typeId, pageNumber, pageSize] as const,
  types: () => [...feedbackKeys.all, 'types'] as const,
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (data: SubmitFeedbackDTO) => feedbackService.submitFeedback(data),
  })
}

export function useFeedbacks(feedbackTypeId?: number, pageNumber: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: feedbackKeys.list(feedbackTypeId, pageNumber, pageSize),
    queryFn: () => feedbackService.getAllFeedbacks(feedbackTypeId, pageNumber, pageSize),
  })
}

export function useFeedbackTypes() {
  return useQuery({
    queryKey: feedbackKeys.types(),
    queryFn: () => feedbackService.getFeedbackTypes(),
  })
}

export function useMarkFeedbackAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => feedbackService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
    },
  })
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => feedbackService.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
    },
  })
}

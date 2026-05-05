import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedbackService, SubmitFeedbackDTO, SendFeedbackReplyDTO } from '@/services/feedback-service'

export const feedbackKeys = {
  all: ['feedbacks'] as const,
  list: (typeId?: number, isRead?: boolean, pageNumber?: number, pageSize?: number) =>
    [...feedbackKeys.all, 'list', typeId, isRead, pageNumber, pageSize] as const,
  types: () => [...feedbackKeys.all, 'types'] as const,
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (data: SubmitFeedbackDTO) =>
      feedbackService.submitFeedback(data),
  })
}

export function useFeedbacks(
  feedbackTypeId?: number,
  isRead?: boolean,
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: feedbackKeys.list(feedbackTypeId, isRead, pageNumber, pageSize),
    queryFn: () =>
      feedbackService.getAllFeedbacks(feedbackTypeId, isRead, pageNumber, pageSize),
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

export function useSendFeedbackReply() {
  return useMutation({
    mutationFn: (data: SendFeedbackReplyDTO) =>
      feedbackService.sendReply(data),
  })
}

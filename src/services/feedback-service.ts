import api from '@/lib/axios'

export type SubmitFeedbackDTO = {
  feedbackType: number
  message: string
}

export type SendFeedbackReplyDTO = {
  email: string
  message: string
}

export type FeedbackResponseDTO = {
  id: number
  reviewerName: string
  reviewerEmail: string
  reviewerType: string
  logoUrl?: string
  feedbackTypeName: string
  message: string
  isRead: boolean
  createdAt: string // ISO date
}

export type PaginatedFeedbacks = {
  items: FeedbackResponseDTO[]
  currentPage: number
  pageSize: number
  totalPages: number
  totalCount: number
}

export type FeedbackTypeDTO = {
  id: number
  name: string
}

export type FeedbackStatisticsDTO = {
  complaintsCount: number
  featureRequestsCount: number
  readFeedbacksCount: number
  unreadFeedbacksCount: number
}

export const feedbackService = {
  submitFeedback: async (data: SubmitFeedbackDTO) => {
    const res = await api.post('/Feedbacks', data)
    return res.data
  },

  getAllFeedbacks: async (
    feedbackTypeId?: number,
    isRead?: boolean,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedFeedbacks> => {
    const params: any = { pageNumber, pageSize }
    if (feedbackTypeId) params.feedbackTypeId = feedbackTypeId
    if (isRead !== undefined) params.isRead = isRead

    const res = await api.get('/Feedbacks', { params })

    if (res.data?.data?.items) {
      return res.data.data
    }

    return {
      items: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalCount: 0,
    }
  },

  getFeedbackTypes: async (): Promise<FeedbackTypeDTO[]> => {
    const res = await api.get('/Feedbacks/types')

    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.data)) return res.data.data

    return []
  },

  getFeedbackStatistics: async (): Promise<FeedbackStatisticsDTO> => {
    const res = await api.get('/Feedbacks/statistics')

    if (res.data?.data) {
      return res.data.data
    }

    return {
      complaintsCount: 0,
      featureRequestsCount: 0,
      readFeedbacksCount: 0,
      unreadFeedbacksCount: 0,
    }
  },

  markAsRead: async (id: number) => {
    const res = await api.patch(`/Feedbacks/${id}/read`)
    return res.data
  },

  deleteFeedback: async (id: number) => {
    const res = await api.delete(`/Feedbacks/${id}`)
    return res.data
  },

  sendReply: async (data: SendFeedbackReplyDTO) => {
    const res = await api.post('/Feedbacks/send-reply', data)
    return res.data
  },
}

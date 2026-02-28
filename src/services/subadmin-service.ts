import api from '@/lib/axios'
import { BaseResponse } from './admin-service'

// ============== Interfaces ==============

export interface SubadminStatisticsDto {
  totalSubAdmins: number
  activeSubAdmins: number
  suspendedSubAdmins: number
  blockedSubAdmins?: number
}

export interface SubAdminDto {
  id: number
  name: string
  email: string
  phoneNumber: string
  createdAt: string
  status: 'Active' | 'Suspended' | 'Blocked'
}

export interface PaginatedSubAdminsDto {
  items: SubAdminDto[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface GetSubAdminsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

export interface UpdateSubAdminStatusDto {
  status: 'Active' | 'Suspended' | 'Blocked'
}

export interface UpdateSubAdminDto {
  name?: string
  email?: string
  phoneNumber?: string
}

export interface CreateSubAdminDto {
  name: string
  email: string
  password?: string
  passwordConfirmation?: string
  phoneNumber: string
}

export interface SubAdminBulkActionDto {
  ids: number[]
  action: 'Approve' | 'Suspend' | 'Delete'
}

// ============== Service ==============

export const subadminService = {
  getStatistics: async (): Promise<BaseResponse<SubadminStatisticsDto>> => {
    const res = await api.get('/Admin/sub-admins/statistics')
    return res.data
  },

  getSubadmins: async (
    params: GetSubAdminsParams,
  ): Promise<BaseResponse<PaginatedSubAdminsDto>> => {
    const res = await api.get('/Admin/sub-admins', { params })
    return res.data
  },

  getSubadmin: async (id: number): Promise<BaseResponse<SubAdminDto>> => {
    const res = await api.get(`/Admin/sub-admins/${id}`)
    return res.data
  },

  updateStatus: async (
    id: number,
    data: UpdateSubAdminStatusDto,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.patch(`/Admin/sub-admins/${id}/status`, data)
    return res.data
  },

  deleteSubadmin: async (
    id: number,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.delete(`/Admin/sub-admins/${id}`)
    return res.data
  },

  updateSubadmin: async (
    id: number,
    data: UpdateSubAdminDto,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.put(`/Admin/sub-admins/${id}`, data)
    return res.data
  },

  createSubadmin: async (
    data: CreateSubAdminDto,
  ): Promise<BaseResponse<{ message: string }>> => {
    const res = await api.post('/Admin/sub-admins', data)
    return res.data
  },

  // Bulk action implementation since there's no native bulk endpoint
  bulkAction: async (
    data: SubAdminBulkActionDto,
  ): Promise<{ successCount: number; failedCount: number }> => {
    let successCount = 0
    let failedCount = 0

    const promises = data.ids.map(async (id) => {
      try {
        if (data.action === 'Delete') {
          await subadminService.deleteSubadmin(id)
        } else {
          const status = data.action === 'Approve' ? 'Active' : 'Suspended'
          await subadminService.updateStatus(id, { status })
        }
        successCount++
      } catch (error) {
        failedCount++
      }
    })

    await Promise.allSettled(promises)
    return { successCount, failedCount }
  },
}

import axiosInstance from "./axiosInstance";
import type {User} from '@/auth/types'

export interface LoginDto{
    email:string,
    password:string,
}


export interface RegisterDto{
    email:string,
    password:string, 
    name:string,
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export const authApi = {
  // 🔐 تسجيل الدخول
  login: async (credentials: LoginDto): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },
 
   logout: async (): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  // 👤 جلب بيانات المستخدم الحالي
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  checkAuth: async (): Promise<ApiResponse<{ isAuthenticated: boolean }>> => {
    const response = await axiosInstance.get<ApiResponse<{ isAuthenticated: boolean }>>('/auth/check');
    return response.data;
  },

  // 👤 إنشاء حساب جديد
  register: async (credentials: RegisterDto): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>(
      '/auth/register',
      credentials
    );
    return response.data;
  },


}
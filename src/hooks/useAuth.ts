// 📄 src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        // تحديث بيانات المستخدم
        queryClient.setQueryData(['currentUser'], data);
        //queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      if (!response.success) {
        throw new Error('غير مصرح');
      }
      return response;
    },
    retry: false, // لا تعيد المحاولة عند خطأ 401
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // مسح بيانات المستخدم
      queryClient.setQueryData(['currentUser'], null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};
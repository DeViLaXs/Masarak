
import api from "@/lib/axios";
import { authService, ForgetPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from "@/services/authService";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useRegister = () => {
    return useMutation({
        mutationFn:(data:RegisterDto)=>authService.register(data),
    })
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn:(data:VerifyOtpDto)=>authService.verifyOtp(data),
    })
};

export const useLogin = () => {
    return useMutation({
        mutationFn:(data:LoginDto)=>authService.login(data),
    })
};

export const useLogout = () => {
    return useMutation({
        mutationFn: authService.logout,
    })
};

export const useForgetPassword = () => {
    return useMutation({
        mutationFn: (data:ForgetPasswordDto)=>authService.forgetPassword(data),
    })
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data:ResetPasswordDto)=>authService.resetPassword(data),
    })
};

const checkAdminAccess = async () => {
  await api.get("/Account/AdminTest");
  return true;
};
const checkCompanyAccess = async () => {
  await api.get("/Account/CompanyTest");
  return true;
};

export const useAdminGuard = () => {
  return useQuery({
    queryKey: ["admin-guard"],
    queryFn: checkAdminAccess,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCompanyGuard = () => {
  return useQuery({
    queryKey: ["company-guard"],
    queryFn: checkCompanyAccess,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    retry: false,
    refetchOnWindowFocus: false,
  });
};



